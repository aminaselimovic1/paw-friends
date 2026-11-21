<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/AdoptionApplicationDao.php';
require_once __DIR__ . '/../dao/PetDao.php';
require_once __DIR__ . '/../dao/UserDao.php';

// The rules for adoption applications: applying, and the admin's review.
// Applying and reviewing also change the pet's status, as in M1
// (manage-applications.js). The admin can still change the status by hand
// afterwards (PetService accepts any status).
class AdoptionApplicationService extends BaseService
{
    // A review decides: approve or reject. Back to 'pending' isn't a review.
    private const REVIEW_STATUSES = ['approved', 'rejected'];

    // $this->applicationDao and BaseService's $this->dao are the same object.
    // The typed name tells PHP and the editor that it has getByPetId() etc.
    public function __construct(
        private AdoptionApplicationDao $applicationDao = new AdoptionApplicationDao(),
        private PetDao $petDao = new PetDao(),
        private UserDao $userDao = new UserDao(),
    ) {
        parent::__construct($applicationDao);
    }

    // My applications: one user's applications. Null if there's no such user.
    public function getByUserId(int $userId): ?array
    {
        if ($this->userDao->getById($userId) === null) {
            return null;
        }
        return $this->applicationDao->getByUserId($userId);
    }

    // One pet's applications (the review and the status warning). Null if
    // there's no such pet.
    public function getByPetId(int $petId): ?array
    {
        if ($this->petDao->getById($petId) === null) {
            return null;
        }
        return $this->applicationDao->getByPetId($petId);
    }

    // Applying for a pet. In M4, user_id will come from the login token, not
    // from the request body.
    public function create(array $data): array
    {
        $petId = $this->requiredId($data, 'pet_id');
        $userId = $this->requiredId($data, 'user_id');
        $message = $this->optionalText($data, 'message', 1000);

        $pet = $this->petDao->getById($petId);
        if ($pet === null) {
            throw new InvalidArgumentException("Pet $petId doesn't exist.");
        }
        $user = $this->userDao->getById($userId);
        if ($user === null) {
            throw new InvalidArgumentException("User $userId doesn't exist.");
        }

        // Rule: you can't apply for an adopted pet
        if ($pet['status'] === 'adopted') {
            throw new DomainException("{$pet['name']} has already found a home.");
        }
        // Rule: no second pending application for the same pet (from the same
        // user). Other users may still apply: a pending pet takes more
        // applications. After a rejection, the user may apply again.
        foreach ($this->applicationDao->getByPetId($petId) as $application) {
            if ($application['user_id'] === $userId && $application['status'] === 'pending') {
                throw new DomainException("{$user['name']} already has a pending application for {$pet['name']}.");
            }
        }

        // The application and the pet's new status are saved together or not at all
        $this->dao->beginTransaction();
        try {
            $created = $this->dao->insert([
                'pet_id' => $petId,
                'user_id' => $userId,
                'message' => $message,
                'status' => 'pending',
            ]);
            // An application is being reviewed now (M1: "pending" fits a pending application)
            if ($pet['status'] === 'available') {
                $this->petDao->update($petId, ['status' => 'pending']);
            }
            $this->dao->commit();
        } catch (Throwable $e) {
            $this->dao->rollBack();
            throw $e;
        }
        return $this->getById($created['id']); // with created_at from MySQL
    }

    // PUT = the admin's review: status (approved or rejected) and reviewed_by.
    // pet_id, user_id, message and created_at don't change (not in the allow-list).
    // Returns null if the application doesn't exist (the route answers 404).
    public function update(int $id, array $data): ?array
    {
        $application = $this->getById($id);
        if ($application === null) {
            return null;
        }
        $status = $this->requiredChoice($data, 'status', self::REVIEW_STATUSES);
        $reviewerId = $this->requiredId($data, 'reviewed_by');
        $reviewer = $this->userDao->getById($reviewerId);
        if ($reviewer === null) {
            throw new InvalidArgumentException("User $reviewerId doesn't exist.");
        }

        // Rule: the reviewer must be an admin. (In M4 the reviewer will come
        // from the login token, and a non-admin will get 403 before this.)
        if ($reviewer['role'] !== 'admin') {
            throw new DomainException("Only an admin can review applications. {$reviewer['name']} isn't an admin.");
        }
        // A decision is made once (M1 shows Approve/Reject only for pending ones)
        if ($application['status'] !== 'pending') {
            throw new DomainException("This application was already {$application['status']}.");
        }

        $this->dao->beginTransaction();
        try {
            $this->dao->update($id, ['status' => $status, 'reviewed_by' => $reviewerId]);
            if ($status === 'approved') {
                $this->adoptPet($application['pet_id'], $reviewerId);
            } else {
                $this->freePetIfNobodyWaits($application['pet_id']);
            }
            $this->dao->commit();
        } catch (Throwable $e) {
            $this->dao->rollBack();
            throw $e;
        }
        return $this->getById($id);
    }

    // Deleting a pending application has the same effect on the pet as a
    // rejection. An approved one leaves the pet adopted (the admin can change
    // the status by hand).
    public function delete(int $id): bool
    {
        $application = $this->getById($id);
        if ($application === null) {
            return false;
        }
        $this->dao->beginTransaction();
        try {
            $this->dao->delete($id);
            if ($application['status'] === 'pending') {
                $this->freePetIfNobodyWaits($application['pet_id']);
            }
            $this->dao->commit();
        } catch (Throwable $e) {
            $this->dao->rollBack();
            throw $e;
        }
        return true;
    }

    // Approve (M1): the pet is adopted, so every other pending application for
    // it is rejected by the same admin. Runs inside update()'s transaction.
    private function adoptPet(int $petId, int $reviewerId): void
    {
        $this->petDao->update($petId, ['status' => 'adopted']);
        foreach ($this->applicationDao->getByPetId($petId) as $other) {
            if ($other['status'] === 'pending') { // the approved one isn't pending any more
                $this->dao->update($other['id'], ['status' => 'rejected', 'reviewed_by' => $reviewerId]);
            }
        }
    }

    // Reject (M1): when nobody is waiting for a pending pet any more, it's
    // available again.
    private function freePetIfNobodyWaits(int $petId): void
    {
        $pet = $this->petDao->getById($petId);
        $pendingCount = count(array_filter(
            $this->applicationDao->getByPetId($petId),
            fn ($application) => $application['status'] === 'pending'
        ));
        if ($pet['status'] === 'pending' && $pendingCount === 0) {
            $this->petDao->update($petId, ['status' => 'available']);
        }
    }
}

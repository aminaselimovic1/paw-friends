<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/VaccinationDao.php';
require_once __DIR__ . '/../dao/PetDao.php';
require_once __DIR__ . '/../dao/UserDao.php';

// The rules for vaccinations. The checks match the "Add vaccination" form on
// pet-details.html and the vet dashboard.
class VaccinationService extends BaseService
{
    // $this->vaccinationDao and BaseService's $this->dao are the same object.
    // The typed name tells PHP and the editor that it has getByPetId().
    public function __construct(
        private VaccinationDao $vaccinationDao = new VaccinationDao(),
        private PetDao $petDao = new PetDao(),
        private UserDao $userDao = new UserDao(),
    ) {
        parent::__construct($vaccinationDao);
    }

    // Pet details: one pet's vaccinations, newest first. Null if there's no such pet.
    public function getByPetId(int $petId): ?array
    {
        if ($this->petDao->getById($petId) === null) {
            return null;
        }
        return $this->vaccinationDao->getByPetId($petId);
    }

    public function create(array $data): array
    {
        $vaccination = $this->validate($data);
        $created = $this->dao->insert($vaccination);
        return $this->dao->getById($created['id']);
    }

    // PUT replaces the whole vaccination, so it's validated like create().
    // Returns null if the vaccination doesn't exist (the route answers 404).
    public function update(int $id, array $data): ?array
    {
        if ($this->getById($id) === null) {
            return null;
        }
        $vaccination = $this->validate($data);
        $this->dao->update($id, $vaccination);
        return $this->dao->getById($id);
    }

    // Checks the input and builds a new array with only the allowed fields.
    private function validate(array $data): array
    {
        // Rule: the pet must exist (an unknown pet is invalid input, 400)
        $petId = $this->requiredId($data, 'pet_id');
        if ($this->petDao->getById($petId) === null) {
            throw new InvalidArgumentException("Pet $petId doesn't exist.");
        }

        // Rule: the vet must be a vet. In M4, vet_id will come from the login
        // token, and a non-vet will get 403 before this.
        $vetId = $this->requiredId($data, 'vet_id');
        $vet = $this->userDao->getById($vetId);
        if ($vet === null) {
            throw new InvalidArgumentException("User $vetId doesn't exist.");
        }
        if ($vet['role'] !== 'vet') {
            throw new DomainException("Only a vet can write health records. {$vet['name']} isn't a vet.");
        }

        $vaccineName = $this->requiredText($data, 'vaccine_name', 100);
        // Rule: the date can't be in the future (the form's max = today)
        $dateGiven = $this->requiredPastDate($data, 'date_given');

        // Rule: the next due date is optional, but must come after the date
        // given (the same day isn't "after"). It may be in the past: overdue.
        $nextDueDate = null;
        if (trim($data['next_due_date'] ?? '') !== '') {
            $nextDueDate = $this->requiredDate($data, 'next_due_date');
            if ($nextDueDate <= $dateGiven) {
                throw new InvalidArgumentException("Field 'next_due_date' must be after the date given.");
            }
        }

        return [
            'pet_id' => $petId,
            'vet_id' => $vetId,
            'vaccine_name' => $vaccineName,
            'date_given' => $dateGiven,
            'next_due_date' => $nextDueDate,
        ];
    }
}

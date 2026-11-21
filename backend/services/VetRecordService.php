<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/VetRecordDao.php';
require_once __DIR__ . '/../dao/PetDao.php';
require_once __DIR__ . '/../dao/UserDao.php';

// The rules for vet records (a vet's visit notes). The checks match the
// "Add vet visit" form on pet-details.html and the vet dashboard.
class VetRecordService extends BaseService
{
    // $this->vetRecordDao and BaseService's $this->dao are the same object.
    // The typed name tells PHP and the editor that it has getByPetId().
    public function __construct(
        private VetRecordDao $vetRecordDao = new VetRecordDao(),
        private PetDao $petDao = new PetDao(),
        private UserDao $userDao = new UserDao(),
    ) {
        parent::__construct($vetRecordDao);
    }

    // Pet details: one pet's visits, newest first. Null if there's no such pet.
    public function getByPetId(int $petId): ?array
    {
        if ($this->petDao->getById($petId) === null) {
            return null;
        }
        return $this->vetRecordDao->getByPetId($petId);
    }

    public function create(array $data): array
    {
        $record = $this->validate($data);
        $created = $this->dao->insert($record);
        return $this->dao->getById($created['id']);
    }

    // PUT replaces the whole record, so it's validated like create().
    // Returns null if the record doesn't exist (the route answers 404).
    public function update(int $id, array $data): ?array
    {
        if ($this->getById($id) === null) {
            return null;
        }
        $record = $this->validate($data);
        $this->dao->update($id, $record);
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

        return [
            'pet_id' => $petId,
            'vet_id' => $vetId,
            // Rule: the date can't be in the future (the form's max = today)
            'visit_date' => $this->requiredPastDate($data, 'visit_date'),
            'reason' => $this->requiredText($data, 'reason', 150),
            'diagnosis' => $this->optionalText($data, 'diagnosis', 255),
            'treatment' => $this->optionalText($data, 'treatment', 255),
            'notes' => $this->optionalText($data, 'notes', 1000),
        ];
    }
}

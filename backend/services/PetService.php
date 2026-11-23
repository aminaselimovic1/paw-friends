<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/PetDao.php';
require_once __DIR__ . '/../dao/ShelterDao.php';
require_once __DIR__ . '/../dao/AdoptionApplicationDao.php';
require_once __DIR__ . '/../dao/VetRecordDao.php';
require_once __DIR__ . '/../dao/VaccinationDao.php';

// The rules for pets. The checks match the admin's pet forms (manage-pets.html
// and the edit form on pet-details.html).
class PetService extends BaseService
{
    // The allowed values of the ENUM columns, written once
    private const SPECIES = ['dog', 'cat'];
    private const SEXES = ['male', 'female'];
    private const STATUSES = ['available', 'pending', 'adopted'];

    // Fields the forms don't have yet (no photo upload; the breed id comes in
    // M4). If a request doesn't send them, update() keeps the stored values.
    private const KEPT_IF_NOT_SENT = ['photo_url', 'breed_api_id'];

    public function __construct(
        PetDao $petDao = new PetDao(),
        private ShelterDao $shelterDao = new ShelterDao(),
        private AdoptionApplicationDao $applicationDao = new AdoptionApplicationDao(),
        private VetRecordDao $vetRecordDao = new VetRecordDao(),
        private VaccinationDao $vaccinationDao = new VaccinationDao(),
    ) {
        parent::__construct($petDao);
    }

    public function create(array $data): array
    {
        $pet = $this->validate($data);
        $created = $this->dao->insert($pet);
        return $this->dao->getById($created['id']); // the row as MySQL stored it
    }

    // PUT replaces the whole pet, so it's validated like create().
    // Returns null if the pet doesn't exist (the route answers 404).
    public function update(int $id, array $data): ?array
    {
        $current = $this->getById($id);
        if ($current === null) {
            return null;
        }
        $pet = $this->validate($data);
        foreach (self::KEPT_IF_NOT_SENT as $field) {
            if (!array_key_exists($field, $data)) {
                $pet[$field] = $current[$field];
            }
        }
        // A breed id belongs to one API: TheDogAPI or TheCatAPI. If the species
        // changes and no new breed_api_id is sent, the old one would be looked
        // up in the wrong API, so it's dropped.
        if ($pet['species'] !== $current['species'] && !array_key_exists('breed_api_id', $data)) {
            $pet['breed_api_id'] = null;
        }
        $this->dao->update($id, $pet);
        return $this->dao->getById($id);
    }

    // A pet with applications or health records can't be deleted: they would
    // be lost (the database refuses it too: ON DELETE RESTRICT). The admin can
    // change the pet's status instead.
    public function delete(int $id): bool
    {
        $pet = $this->getById($id);
        if ($pet === null) {
            return false;
        }
        $historyCount = count($this->applicationDao->getByPetId($id))
            + count($this->vetRecordDao->getByPetId($id))
            + count($this->vaccinationDao->getByPetId($id));
        if ($historyCount > 0) {
            throw new DomainException(
                "{$pet['name']} can't be deleted: $historyCount application(s) or health record(s) "
                . 'belong to this pet and would be lost. You can change its status instead.'
            );
        }
        return $this->dao->delete($id);
    }

    // Checks the input and builds a new array with only the allowed fields
    // (an allow-list), in the order of the form.
    private function validate(array $data): array
    {
        $name = $this->requiredText($data, 'name', 50);
        if (mb_strlen($name) < 2) {
            throw new InvalidArgumentException("Field 'name' must have at least 2 characters.");
        }
        $species = $this->requiredChoice($data, 'species', self::SPECIES);
        $breedName = $this->requiredText($data, 'breed_name', 100);
        $sex = $this->requiredChoice($data, 'sex', self::SEXES);

        $birthDate = $this->requiredPastDate($data, 'birth_date');

        // The shelter must exist. An unknown shelter is invalid input (400),
        // like an unknown menu item in Reading 04.
        $shelterId = $this->requiredId($data, 'shelter_id');
        if ($this->shelterDao->getById($shelterId) === null) {
            throw new InvalidArgumentException("Shelter $shelterId doesn't exist.");
        }

        // Any of the three statuses is accepted: the admin keeps manual control
        // (e.g. a pet adopted outside the site). Nothing here locks the status.
        $status = $this->requiredChoice($data, 'status', self::STATUSES);

        return [
            'shelter_id' => $shelterId,
            'name' => $name,
            'species' => $species,
            'breed_name' => $breedName,
            'breed_api_id' => $this->optionalText($data, 'breed_api_id', 20),
            'sex' => $sex,
            'birth_date' => $birthDate,
            'description' => $this->optionalText($data, 'description', 500),
            'photo_url' => $this->optionalText($data, 'photo_url', 255),
            'status' => $status,
        ];
    }
}

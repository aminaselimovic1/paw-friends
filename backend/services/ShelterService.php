<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/ShelterDao.php';
require_once __DIR__ . '/../dao/PetDao.php';

// The rules for shelters. The checks match the admin's shelter form
// (manage-shelters.html), so a value the form accepts is accepted here too.
class ShelterService extends BaseService
{
    // Two DAOs: shelters, and pets for the delete rule and the shelter's pet
    // list. They come in through the constructor, with default values
    // (dependency injection, Reading 04), so a test could pass fake DAOs.
    public function __construct(
        ShelterDao $shelterDao = new ShelterDao(),
        private PetDao $petDao = new PetDao(),
    ) {
        parent::__construct($shelterDao);
    }

    public function create(array $data): array
    {
        $shelter = $this->validate($data);
        $created = $this->dao->insert($shelter);
        return $this->dao->getById($created['id']); // the row as MySQL stored it
    }

    // PUT replaces the whole shelter, so it's validated like create().
    // Returns null if the shelter doesn't exist (the route answers 404).
    public function update(int $id, array $data): ?array
    {
        if ($this->getById($id) === null) {
            return null;
        }
        $shelter = $this->validate($data);
        $this->dao->update($id, $shelter);
        return $this->dao->getById($id);
    }

    // A shelter that still has pets can't be deleted: its pets would have no
    // shelter. The database refuses it too (ON DELETE RESTRICT), but this way
    // the admin gets a clear message instead of a database error.
    public function delete(int $id): bool
    {
        $shelter = $this->getById($id);
        if ($shelter === null) {
            return false;
        }
        $petCount = count($this->petDao->getByShelterId($id));
        if ($petCount > 0) {
            throw new DomainException(
                "{$shelter['name']} can't be deleted: it still has $petCount pet(s). Move or delete them first."
            );
        }
        return $this->dao->delete($id);
    }

    // The pets of one shelter (shelter details). Null if there's no such shelter.
    public function getPets(int $shelterId): ?array
    {
        if ($this->getById($shelterId) === null) {
            return null;
        }
        return $this->petDao->getByShelterId($shelterId);
    }

    // Checks the input and builds a new array with only the allowed fields
    // (an allow-list): a client that sends "id" can't write to that column.
    private function validate(array $data): array
    {
        $name = $this->requiredText($data, 'name', 100);
        if (mb_strlen($name) < 2) {
            throw new InvalidArgumentException("Field 'name' must have at least 2 characters.");
        }
        $address = $this->requiredText($data, 'address', 150);
        $city = $this->requiredText($data, 'city', 100);

        $phone = $this->requiredText($data, 'phone', 50);
        if (!preg_match(self::PHONE_PATTERN, $phone)) {
            throw new InvalidArgumentException("Field 'phone' must have 6 to 15 digits, with + only at the start.");
        }

        $email = $this->requiredText($data, 'email', 255);
        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            throw new InvalidArgumentException("Field 'email' must be a valid email address.");
        }

        // Latitude and longitude: both or neither, because the map needs both
        $latitude = $data['latitude'] ?? null;
        $longitude = $data['longitude'] ?? null;
        $hasLatitude = $latitude !== null && $latitude !== '';
        $hasLongitude = $longitude !== null && $longitude !== '';
        if ($hasLatitude !== $hasLongitude) {
            throw new InvalidArgumentException('Fill in both latitude and longitude, or neither.');
        }
        if ($hasLatitude) {
            if (!is_numeric($latitude) || $latitude < -90 || $latitude > 90) {
                throw new InvalidArgumentException("Field 'latitude' must be a number from -90 to 90.");
            }
            if (!is_numeric($longitude) || $longitude < -180 || $longitude > 180) {
                throw new InvalidArgumentException("Field 'longitude' must be a number from -180 to 180.");
            }
        }

        return [
            'name' => $name,
            'address' => $address,
            'city' => $city,
            'phone' => $phone,
            'email' => $email,
            'description' => $this->optionalText($data, 'description', 500),
            'opening_hours' => $this->optionalText($data, 'opening_hours', 300),
            'latitude' => $hasLatitude ? (float) $latitude : null,
            'longitude' => $hasLongitude ? (float) $longitude : null,
        ];
    }
}

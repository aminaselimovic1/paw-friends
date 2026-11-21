<?php
require_once __DIR__ . '/BaseDao.php';

class VaccinationDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct('vaccinations');
    }

    // Pet details: one pet's vaccinations, newest first
    public function getByPetId(int $petId): array
    {
        $stmt = $this->connection->prepare(
            'SELECT * FROM vaccinations WHERE pet_id = :pet_id ORDER BY date_given DESC'
        );
        $stmt->execute(['pet_id' => $petId]);
        return $stmt->fetchAll();
    }

    // The vaccinations one vet gave, newest first (deleting a user checks them)
    public function getByVetId(int $vetId): array
    {
        $stmt = $this->connection->prepare(
            'SELECT * FROM vaccinations WHERE vet_id = :vet_id ORDER BY date_given DESC'
        );
        $stmt->execute(['vet_id' => $vetId]);
        return $stmt->fetchAll();
    }
}

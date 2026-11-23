<?php
require_once __DIR__ . '/BaseDao.php';

class VetRecordDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct('vet_records');
    }

    // Pet details: one pet's vet visits, newest first
    public function getByPetId(int $petId): array
    {
        $stmt = $this->connection->prepare(
            'SELECT * FROM vet_records WHERE pet_id = :pet_id ORDER BY visit_date DESC'
        );
        $stmt->execute(['pet_id' => $petId]);
        return $stmt->fetchAll();
    }

    // The visits one vet wrote, newest first (deleting a user checks them)
    public function getByVetId(int $vetId): array
    {
        $stmt = $this->connection->prepare(
            'SELECT * FROM vet_records WHERE vet_id = :vet_id ORDER BY visit_date DESC'
        );
        $stmt->execute(['vet_id' => $vetId]);
        return $stmt->fetchAll();
    }
}

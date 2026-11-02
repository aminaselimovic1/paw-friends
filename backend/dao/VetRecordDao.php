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
}

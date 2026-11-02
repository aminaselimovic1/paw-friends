<?php
require_once __DIR__ . '/BaseDao.php';

class AdoptionApplicationDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct('adoption_applications');
    }

    // My applications: one user's applications, newest first
    public function getByUserId(int $userId): array
    {
        $stmt = $this->connection->prepare(
            'SELECT * FROM adoption_applications WHERE user_id = :user_id ORDER BY created_at DESC'
        );
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    // One pet's applications, newest first. The pet's status depends on them.
    public function getByPetId(int $petId): array
    {
        $stmt = $this->connection->prepare(
            'SELECT * FROM adoption_applications WHERE pet_id = :pet_id ORDER BY created_at DESC'
        );
        $stmt->execute(['pet_id' => $petId]);
        return $stmt->fetchAll();
    }
}

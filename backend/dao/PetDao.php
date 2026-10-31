<?php
require_once __DIR__ . '/BaseDao.php';

class PetDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct('pets');
    }

    // Shelter details: the pets of one shelter, by name
    public function getByShelterId(int $shelterId): array
    {
        $stmt = $this->connection->prepare(
            'SELECT * FROM pets WHERE shelter_id = :shelter_id ORDER BY name'
        );
        $stmt->execute(['shelter_id' => $shelterId]);
        return $stmt->fetchAll();
    }
}

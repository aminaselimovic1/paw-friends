<?php
require_once __DIR__ . '/BaseDao.php';

// Shelters need only the common queries from BaseDao.
class ShelterDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct('shelters');
    }
}

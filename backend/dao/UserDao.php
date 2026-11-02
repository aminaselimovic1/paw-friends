<?php
require_once __DIR__ . '/BaseDao.php';

class UserDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct('users');
    }

    // Login and register: find the account with this email (one row or null)
    public function getByEmail(string $email): ?array
    {
        $stmt = $this->connection->prepare(
            'SELECT * FROM users WHERE email = :email'
        );
        $stmt->execute(['email' => $email]);
        return $stmt->fetch() ?: null;
    }
}

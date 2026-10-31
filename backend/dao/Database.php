<?php
require_once __DIR__ . '/../config/config.php';

// Opens the connection to MySQL the first time it's needed and gives the same
// PDO object to every DAO after that, so one request uses one connection.
class Database
{
    private static ?PDO $connection = null;

    public static function getConnection(): PDO
    {
        if (self::$connection === null) {
            $dsn = 'mysql:host=' . Config::DB_HOST()
                . ';dbname=' . Config::DB_NAME()
                . ';charset=utf8mb4';
            self::$connection = new PDO(
                $dsn,
                Config::DB_USER(),
                Config::DB_PASSWORD(),
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_FOUND_ROWS => true, // rowCount() after UPDATE counts found rows, also unchanged ones
                ]
            );
        }
        return self::$connection;
    }
}

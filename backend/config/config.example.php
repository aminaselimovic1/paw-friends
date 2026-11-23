<?php
// Template for backend/config/config.php, which holds the real settings and
// is not committed (.gitignore). Copy this file to config.php and change the
// values if your MySQL is set up differently.
class Config
{
    public static function DB_HOST(): string { return 'localhost'; }
    public static function DB_NAME(): string { return 'paw_friends'; }
    public static function DB_USER(): string { return 'root'; }
    public static function DB_PASSWORD(): string { return ''; } // XAMPP's MySQL has no password by default

    // Keys for the breed info on the pet details page. Get free keys at
    // https://thedogapi.com and https://thecatapi.com and paste them here.
    public static function DOG_API_KEY(): string { return 'your-dog-api-key'; }
    public static function CAT_API_KEY(): string { return 'your-cat-api-key'; }
}

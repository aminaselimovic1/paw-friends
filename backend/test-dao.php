<?php

// This test script must only run from the command line.
if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('This script can only be run from the command line.');
}

require_once __DIR__ . '/dao/ShelterDao.php';
require_once __DIR__ . '/dao/PetDao.php';
require_once __DIR__ . '/dao/UserDao.php';

$shelterDao = new ShelterDao();
$petDao = new PetDao();
$userDao = new UserDao();

// Read
echo count($shelterDao->getAll()) . " shelters\n";
print_r($shelterDao->getById(1));
print_r($petDao->getByShelterId(1));
print_r($userDao->getByEmail('lejla@example.com'));

// Create, update, delete (the test shelter is removed again at the end)
$new = $shelterDao->insert([
    'name' => 'Test Shelter',
    'address' => 'Ulica 1',
    'city' => 'Zenica',
    'phone' => '+387 32 111 222',
    'email' => 'test@shelter.example',
]);
print_r($new);                                  // the data + its new id
$shelterDao->update($new['id'], ['city' => 'Bihać']);
print_r($shelterDao->getById($new['id']));      // city is Bihać now
$shelterDao->delete($new['id']);
var_dump($shelterDao->getById($new['id']));     // NULL: it's gone

<?php
// The front controller: .htaccess sends every request here, and FlightPHP
// finds the route that matches the method and the URL.
require __DIR__ . '/vendor/autoload.php';

// Services: Flight::register() makes Flight::shelterService() return one
// ShelterService object, created the first time a route uses it.
require_once __DIR__ . '/services/ShelterService.php';
require_once __DIR__ . '/services/PetService.php';
require_once __DIR__ . '/services/UserService.php';
require_once __DIR__ . '/services/AdoptionApplicationService.php';
require_once __DIR__ . '/services/VetRecordService.php';
require_once __DIR__ . '/services/VaccinationService.php';
require_once __DIR__ . '/services/BreedService.php';
Flight::register('shelterService', 'ShelterService');
Flight::register('petService', 'PetService');
Flight::register('userService', 'UserService');
Flight::register('adoptionApplicationService', 'AdoptionApplicationService');
Flight::register('vetRecordService', 'VetRecordService');
Flight::register('vaccinationService', 'VaccinationService');
Flight::register('breedService', 'BreedService');

// Errors are handled in one place (Reading 05). Every exception thrown in a
// route or a service ends up here and becomes a JSON answer.
// jsonHalt(), not json(): after an exception Flight no longer sends the
// response by itself, so json() would answer 200 with an empty body.
Flight::map('error', function (Throwable $e) {
    // invalid input, e.g. a missing name (the message is safe to show)
    if ($e instanceof InvalidArgumentException) {
        Flight::jsonHalt(['error' => $e->getMessage()], 400);
        return;
    }
    // a broken business rule, e.g. the email is already taken
    if ($e instanceof DomainException) {
        Flight::jsonHalt(['error' => $e->getMessage()], 409);
        return;
    }
    // the external API (breed info) failed: BreedService already wrote the
    // details to the error log, and the message is a friendly one
    if ($e instanceof ExternalApiException) {
        Flight::jsonHalt(['error' => $e->getMessage()], 503);
        return;
    }
    // anything else: the details go to the server log, never to the client
    error_log(get_class($e) . ': ' . $e->getMessage() . ' (' . basename($e->getFile()) . ':' . $e->getLine() . ')');
    Flight::jsonHalt(['error' => 'Something went wrong on the server'], 500);
});

// A URL that matches no route
Flight::map('notFound', function () {
    Flight::json(['error' => 'Route not found'], 404);
});

// The URL exists, but not with this method (e.g. POST on a GET-only route)
Flight::map('methodNotFound', function () {
    Flight::json(['error' => 'Method not allowed'], 405);
});

// Test route: shows that the API is running and answers with JSON
Flight::route('GET /', function () {
    Flight::json(['message' => 'PawFriends API is running']);
});

// Routes, one file per resource
require_once __DIR__ . '/routes/ShelterRoutes.php';
require_once __DIR__ . '/routes/PetRoutes.php';
require_once __DIR__ . '/routes/UserRoutes.php';
require_once __DIR__ . '/routes/AdoptionApplicationRoutes.php';
require_once __DIR__ . '/routes/VetRecordRoutes.php';
require_once __DIR__ . '/routes/VaccinationRoutes.php';

Flight::start();

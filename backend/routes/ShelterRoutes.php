<?php
// Routes for shelters (Reading 05). A route only reads the input, calls one
// service method and answers with JSON and a status code. Invalid data (400)
// and broken rules (409) are thrown by the service and answered by
// Flight::map('error') in index.php.
// @id:[0-9]+ means the id must be digits, so /shelters/abc is a 404.

// GET /shelters                all shelters
Flight::route('GET /shelters', function () {
    Flight::json(Flight::shelterService()->getAll());
});

// GET /shelters/1              one shelter
Flight::route('GET /shelters/@id:[0-9]+', function ($id) {
    $shelter = Flight::shelterService()->getById((int) $id);
    if ($shelter === null) {
        Flight::json(['error' => 'Shelter not found'], 404);
        return;
    }
    Flight::json($shelter);
});

// GET /shelters/1/pets         the pets of one shelter (shelter details)
Flight::route('GET /shelters/@id:[0-9]+/pets', function ($id) {
    $pets = Flight::shelterService()->getPets((int) $id);
    if ($pets === null) {
        Flight::json(['error' => 'Shelter not found'], 404);
        return;
    }
    Flight::json($pets);
});

// POST /shelters               create; JSON in the body
Flight::route('POST /shelters', function () {
    $data = Flight::request()->data->getData();
    Flight::json(Flight::shelterService()->create($data), 201);
});

// PUT /shelters/1              update; JSON in the body
Flight::route('PUT /shelters/@id:[0-9]+', function ($id) {
    $data = Flight::request()->data->getData();
    $shelter = Flight::shelterService()->update((int) $id, $data);
    if ($shelter === null) {
        Flight::json(['error' => 'Shelter not found'], 404);
        return;
    }
    Flight::json($shelter);
});

// DELETE /shelters/1           delete (409 if the shelter still has pets)
Flight::route('DELETE /shelters/@id:[0-9]+', function ($id) {
    if (!Flight::shelterService()->delete((int) $id)) {
        Flight::json(['error' => 'Shelter not found'], 404);
        return;
    }
    Flight::json(['message' => 'Shelter deleted']);
});

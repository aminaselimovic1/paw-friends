<?php
// Routes for vaccinations (Reading 05): read the input, call one service
// method, answer with JSON. 400 and 409 come from the service, through
// Flight::map('error') in index.php.

// GET /vaccinations                    all vaccinations
Flight::route('GET /vaccinations', function () {
    Flight::json(Flight::vaccinationService()->getAll());
});

// GET /vaccinations/1                  one vaccination
Flight::route('GET /vaccinations/@id:[0-9]+', function ($id) {
    $vaccination = Flight::vaccinationService()->getById((int) $id);
    if ($vaccination === null) {
        Flight::json(['error' => 'Vaccination not found'], 404);
        return;
    }
    Flight::json($vaccination);
});

// GET /pets/1/vaccinations             one pet's vaccinations (pet details)
Flight::route('GET /pets/@id:[0-9]+/vaccinations', function ($id) {
    $vaccinations = Flight::vaccinationService()->getByPetId((int) $id);
    if ($vaccinations === null) {
        Flight::json(['error' => 'Pet not found'], 404);
        return;
    }
    Flight::json($vaccinations);
});

// POST /vaccinations                   create; JSON in the body
Flight::route('POST /vaccinations', function () {
    $data = Flight::request()->data->getData();
    Flight::json(Flight::vaccinationService()->create($data), 201);
});

// PUT /vaccinations/1                  update; JSON in the body
Flight::route('PUT /vaccinations/@id:[0-9]+', function ($id) {
    $data = Flight::request()->data->getData();
    $vaccination = Flight::vaccinationService()->update((int) $id, $data);
    if ($vaccination === null) {
        Flight::json(['error' => 'Vaccination not found'], 404);
        return;
    }
    Flight::json($vaccination);
});

// DELETE /vaccinations/1               delete
Flight::route('DELETE /vaccinations/@id:[0-9]+', function ($id) {
    if (!Flight::vaccinationService()->delete((int) $id)) {
        Flight::json(['error' => 'Vaccination not found'], 404);
        return;
    }
    Flight::json(['message' => 'Vaccination deleted']);
});

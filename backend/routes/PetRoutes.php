<?php
// Routes for pets (Reading 05): read the input, call one service method,
// answer with JSON. 400 and 409 come from the service, through
// Flight::map('error') in index.php.

// GET /pets                    all pets
Flight::route('GET /pets', function () {
    Flight::json(Flight::petService()->getAll());
});

// GET /pets/1                  one pet
Flight::route('GET /pets/@id:[0-9]+', function ($id) {
    $pet = Flight::petService()->getById((int) $id);
    if ($pet === null) {
        Flight::json(['error' => 'Pet not found'], 404);
        return;
    }
    Flight::json($pet);
});

// GET /pets/1/breed-info       breed info from TheDogAPI / TheCatAPI (the external API)
// 200 with "breed": null when the pet has no breed info; 503 if the API fails
Flight::route('GET /pets/@id:[0-9]+/breed-info', function ($id) {
    $info = Flight::breedService()->getForPet((int) $id);
    if ($info === null) {
        Flight::json(['error' => 'Pet not found'], 404);
        return;
    }
    Flight::json($info);
});

// POST /pets                   create; JSON in the body
Flight::route('POST /pets', function () {
    $data = Flight::request()->data->getData();
    Flight::json(Flight::petService()->create($data), 201);
});

// PUT /pets/1                  update; JSON in the body
Flight::route('PUT /pets/@id:[0-9]+', function ($id) {
    $data = Flight::request()->data->getData();
    $pet = Flight::petService()->update((int) $id, $data);
    if ($pet === null) {
        Flight::json(['error' => 'Pet not found'], 404);
        return;
    }
    Flight::json($pet);
});

// DELETE /pets/1               delete (409 if the pet has applications or health records)
Flight::route('DELETE /pets/@id:[0-9]+', function ($id) {
    if (!Flight::petService()->delete((int) $id)) {
        Flight::json(['error' => 'Pet not found'], 404);
        return;
    }
    Flight::json(['message' => 'Pet deleted']);
});

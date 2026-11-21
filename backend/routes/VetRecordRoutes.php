<?php
// Routes for vet records (Reading 05): read the input, call one service
// method, answer with JSON. 400 and 409 come from the service, through
// Flight::map('error') in index.php.

// GET /vet-records                     all vet records
Flight::route('GET /vet-records', function () {
    Flight::json(Flight::vetRecordService()->getAll());
});

// GET /vet-records/1                   one vet record
Flight::route('GET /vet-records/@id:[0-9]+', function ($id) {
    $record = Flight::vetRecordService()->getById((int) $id);
    if ($record === null) {
        Flight::json(['error' => 'Vet record not found'], 404);
        return;
    }
    Flight::json($record);
});

// GET /pets/1/vet-records              one pet's visits (pet details)
Flight::route('GET /pets/@id:[0-9]+/vet-records', function ($id) {
    $records = Flight::vetRecordService()->getByPetId((int) $id);
    if ($records === null) {
        Flight::json(['error' => 'Pet not found'], 404);
        return;
    }
    Flight::json($records);
});

// POST /vet-records                    create; JSON in the body
Flight::route('POST /vet-records', function () {
    $data = Flight::request()->data->getData();
    Flight::json(Flight::vetRecordService()->create($data), 201);
});

// PUT /vet-records/1                   update; JSON in the body
Flight::route('PUT /vet-records/@id:[0-9]+', function ($id) {
    $data = Flight::request()->data->getData();
    $record = Flight::vetRecordService()->update((int) $id, $data);
    if ($record === null) {
        Flight::json(['error' => 'Vet record not found'], 404);
        return;
    }
    Flight::json($record);
});

// DELETE /vet-records/1                delete
Flight::route('DELETE /vet-records/@id:[0-9]+', function ($id) {
    if (!Flight::vetRecordService()->delete((int) $id)) {
        Flight::json(['error' => 'Vet record not found'], 404);
        return;
    }
    Flight::json(['message' => 'Vet record deleted']);
});

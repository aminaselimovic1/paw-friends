<?php
// Routes for adoption applications (Reading 05): read the input, call one
// service method, answer with JSON. 400 and 409 come from the service,
// through Flight::map('error') in index.php.

// GET /adoption-applications           all applications
Flight::route('GET /adoption-applications', function () {
    Flight::json(Flight::adoptionApplicationService()->getAll());
});

// GET /adoption-applications/1         one application
Flight::route('GET /adoption-applications/@id:[0-9]+', function ($id) {
    $application = Flight::adoptionApplicationService()->getById((int) $id);
    if ($application === null) {
        Flight::json(['error' => 'Application not found'], 404);
        return;
    }
    Flight::json($application);
});

// GET /users/7/adoption-applications   one user's applications (My applications)
Flight::route('GET /users/@id:[0-9]+/adoption-applications', function ($id) {
    $applications = Flight::adoptionApplicationService()->getByUserId((int) $id);
    if ($applications === null) {
        Flight::json(['error' => 'User not found'], 404);
        return;
    }
    Flight::json($applications);
});

// GET /pets/2/adoption-applications    one pet's applications
Flight::route('GET /pets/@id:[0-9]+/adoption-applications', function ($id) {
    $applications = Flight::adoptionApplicationService()->getByPetId((int) $id);
    if ($applications === null) {
        Flight::json(['error' => 'Pet not found'], 404);
        return;
    }
    Flight::json($applications);
});

// POST /adoption-applications          apply: pet_id, user_id, message
Flight::route('POST /adoption-applications', function () {
    $data = Flight::request()->data->getData();
    Flight::json(Flight::adoptionApplicationService()->create($data), 201);
});

// PUT /adoption-applications/1         the admin's review: status, reviewed_by
Flight::route('PUT /adoption-applications/@id:[0-9]+', function ($id) {
    $data = Flight::request()->data->getData();
    $application = Flight::adoptionApplicationService()->update((int) $id, $data);
    if ($application === null) {
        Flight::json(['error' => 'Application not found'], 404);
        return;
    }
    Flight::json($application);
});

// DELETE /adoption-applications/1      delete
Flight::route('DELETE /adoption-applications/@id:[0-9]+', function ($id) {
    if (!Flight::adoptionApplicationService()->delete((int) $id)) {
        Flight::json(['error' => 'Application not found'], 404);
        return;
    }
    Flight::json(['message' => 'Application deleted']);
});

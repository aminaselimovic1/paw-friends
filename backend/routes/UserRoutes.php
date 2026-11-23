<?php
// Routes for user accounts (Reading 05): read the input, call one service
// method, answer with JSON. UserService never returns password_hash.
// 400 and 409 come from the service, through Flight::map('error') in index.php.

// GET /users                   all users
Flight::route('GET /users', function () {
    Flight::json(Flight::userService()->getAll());
});

// GET /users/1                 one user
Flight::route('GET /users/@id:[0-9]+', function ($id) {
    $user = Flight::userService()->getById((int) $id);
    if ($user === null) {
        Flight::json(['error' => 'User not found'], 404);
        return;
    }
    Flight::json($user);
});

// POST /users                  create; JSON in the body, with "password"
Flight::route('POST /users', function () {
    $data = Flight::request()->data->getData();
    Flight::json(Flight::userService()->create($data), 201);
});

// PUT /users/1                 update the account's data (not the password)
Flight::route('PUT /users/@id:[0-9]+', function ($id) {
    $data = Flight::request()->data->getData();
    $user = Flight::userService()->update((int) $id, $data);
    if ($user === null) {
        Flight::json(['error' => 'User not found'], 404);
        return;
    }
    Flight::json($user);
});

// DELETE /users/1              delete (409 if applications or records belong to the user)
Flight::route('DELETE /users/@id:[0-9]+', function ($id) {
    if (!Flight::userService()->delete((int) $id)) {
        Flight::json(['error' => 'User not found'], 404);
        return;
    }
    Flight::json(['message' => 'User deleted']);
});

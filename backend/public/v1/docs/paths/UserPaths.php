<?php
use OpenApi\Attributes as OA;

/*
 * OpenAPI documentation of routes/UserRoutes.php.
 * swagger-php reads the #[OA\...] attributes; the methods are empty, they only
 * carry the documentation. Keep it in sync with the routes: one method per route.
 */
class UserPaths
{
    #[OA\Get(
        path: '/users',
        tags: ['users'],
        summary: 'All users (without password hashes)',
        responses: [
            new OA\Response(response: 200, description: 'All users',
                content: new OA\JsonContent(type: 'array', items: new OA\Items(ref: '#/components/schemas/User'))),
        ]
    )]
    public function getUsers() {}

    #[OA\Get(
        path: '/users/{id}',
        tags: ['users'],
        summary: 'One user (without the password hash)',
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        responses: [
            new OA\Response(response: 200, description: 'The user',
                content: new OA\JsonContent(ref: '#/components/schemas/User')),
            new OA\Response(response: 404, description: 'User not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function getUserById() {}

    #[OA\Post(
        path: '/users',
        tags: ['users'],
        summary: 'Create a user (the password is stored only as a hash)',
        requestBody: new OA\RequestBody(required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/UserInput')),
        responses: [
            new OA\Response(response: 201, description: 'The new user',
                content: new OA\JsonContent(ref: '#/components/schemas/User')),
            new OA\Response(response: 400, description: 'Invalid data, e.g. a password shorter than 8 characters',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
            new OA\Response(response: 409, description: 'The email is already used by another account',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function postUser() {}

    #[OA\Put(
        path: '/users/{id}',
        tags: ['users'],
        summary: "Update a user's data (never the password)",
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        requestBody: new OA\RequestBody(required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/UserUpdate')),
        responses: [
            new OA\Response(response: 200, description: 'The updated user',
                content: new OA\JsonContent(ref: '#/components/schemas/User')),
            new OA\Response(response: 400, description: 'Invalid data',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
            new OA\Response(response: 404, description: 'User not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
            new OA\Response(response: 409, description: 'The email is already used by another account',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function putUser() {}

    #[OA\Delete(
        path: '/users/{id}',
        tags: ['users'],
        summary: 'Delete a user',
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        responses: [
            new OA\Response(response: 200, description: 'Deleted',
                content: new OA\JsonContent(ref: '#/components/schemas/Message')),
            new OA\Response(response: 404, description: 'User not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
            new OA\Response(response: 409, description: 'Applications, reviews or health records belong to the user',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function deleteUser() {}
}

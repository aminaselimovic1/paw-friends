<?php
use OpenApi\Attributes as OA;

/*
 * OpenAPI documentation of routes/ShelterRoutes.php.
 * swagger-php reads the #[OA\...] attributes; the methods are empty, they only
 * carry the documentation. Keep it in sync with the routes: one method per route.
 */
class ShelterPaths
{
    #[OA\Get(
        path: '/shelters',
        tags: ['shelters'],
        summary: 'All shelters',
        responses: [
            new OA\Response(response: 200, description: 'All shelters',
                content: new OA\JsonContent(type: 'array', items: new OA\Items(ref: '#/components/schemas/Shelter'))),
        ]
    )]
    public function getShelters() {}

    #[OA\Get(
        path: '/shelters/{id}',
        tags: ['shelters'],
        summary: 'One shelter',
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        responses: [
            new OA\Response(response: 200, description: 'The shelter',
                content: new OA\JsonContent(ref: '#/components/schemas/Shelter')),
            new OA\Response(response: 404, description: 'Shelter not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function getShelterById() {}

    #[OA\Get(
        path: '/shelters/{id}/pets',
        tags: ['shelters'],
        summary: 'The pets of one shelter (all statuses), by name',
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        responses: [
            new OA\Response(response: 200, description: "The shelter's pets",
                content: new OA\JsonContent(type: 'array', items: new OA\Items(ref: '#/components/schemas/Pet'))),
            new OA\Response(response: 404, description: 'Shelter not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function getShelterPets() {}

    #[OA\Post(
        path: '/shelters',
        tags: ['shelters'],
        summary: 'Create a shelter',
        requestBody: new OA\RequestBody(required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/ShelterInput')),
        responses: [
            new OA\Response(response: 201, description: 'The new shelter',
                content: new OA\JsonContent(ref: '#/components/schemas/Shelter')),
            new OA\Response(response: 400, description: 'Invalid data, e.g. a missing name or only one coordinate',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function postShelter() {}

    #[OA\Put(
        path: '/shelters/{id}',
        tags: ['shelters'],
        summary: 'Update a shelter (all fields, validated like create)',
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        requestBody: new OA\RequestBody(required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/ShelterInput')),
        responses: [
            new OA\Response(response: 200, description: 'The updated shelter',
                content: new OA\JsonContent(ref: '#/components/schemas/Shelter')),
            new OA\Response(response: 400, description: 'Invalid data',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
            new OA\Response(response: 404, description: 'Shelter not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function putShelter() {}

    #[OA\Delete(
        path: '/shelters/{id}',
        tags: ['shelters'],
        summary: 'Delete a shelter',
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        responses: [
            new OA\Response(response: 200, description: 'Deleted',
                content: new OA\JsonContent(ref: '#/components/schemas/Message')),
            new OA\Response(response: 404, description: 'Shelter not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
            new OA\Response(response: 409, description: 'The shelter still has pets',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function deleteShelter() {}
}

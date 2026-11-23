<?php
use OpenApi\Attributes as OA;

/*
 * OpenAPI documentation of routes/VaccinationRoutes.php.
 * swagger-php reads the #[OA\...] attributes; the methods are empty, they only
 * carry the documentation. Keep it in sync with the routes: one method per route.
 */
class VaccinationPaths
{
    #[OA\Get(
        path: '/vaccinations',
        tags: ['vaccinations'],
        summary: 'All vaccinations',
        responses: [
            new OA\Response(response: 200, description: 'All vaccinations',
                content: new OA\JsonContent(type: 'array', items: new OA\Items(ref: '#/components/schemas/Vaccination'))),
        ]
    )]
    public function getVaccinations() {}

    #[OA\Get(
        path: '/vaccinations/{id}',
        tags: ['vaccinations'],
        summary: 'One vaccination',
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        responses: [
            new OA\Response(response: 200, description: 'The vaccination',
                content: new OA\JsonContent(ref: '#/components/schemas/Vaccination')),
            new OA\Response(response: 404, description: 'Vaccination not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function getVaccinationById() {}

    #[OA\Get(
        path: '/pets/{id}/vaccinations',
        tags: ['vaccinations'],
        summary: "One pet's vaccinations, newest first (pet details)",
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        responses: [
            new OA\Response(response: 200, description: "The pet's vaccinations",
                content: new OA\JsonContent(type: 'array', items: new OA\Items(ref: '#/components/schemas/Vaccination'))),
            new OA\Response(response: 404, description: 'Pet not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function getPetVaccinations() {}

    #[OA\Post(
        path: '/vaccinations',
        tags: ['vaccinations'],
        summary: 'Create a vaccination',
        requestBody: new OA\RequestBody(required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/VaccinationInput')),
        responses: [
            new OA\Response(response: 201, description: 'The new vaccination',
                content: new OA\JsonContent(ref: '#/components/schemas/Vaccination')),
            new OA\Response(response: 400, description: 'Invalid data, e.g. a next due date that is not after the date given',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
            new OA\Response(response: 409, description: 'vet_id is not a vet',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function postVaccination() {}

    #[OA\Put(
        path: '/vaccinations/{id}',
        tags: ['vaccinations'],
        summary: 'Update a vaccination (all fields, validated like create)',
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        requestBody: new OA\RequestBody(required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/VaccinationInput')),
        responses: [
            new OA\Response(response: 200, description: 'The updated vaccination',
                content: new OA\JsonContent(ref: '#/components/schemas/Vaccination')),
            new OA\Response(response: 400, description: 'Invalid data',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
            new OA\Response(response: 404, description: 'Vaccination not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
            new OA\Response(response: 409, description: 'vet_id is not a vet',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function putVaccination() {}

    #[OA\Delete(
        path: '/vaccinations/{id}',
        tags: ['vaccinations'],
        summary: 'Delete a vaccination',
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        responses: [
            new OA\Response(response: 200, description: 'Deleted',
                content: new OA\JsonContent(ref: '#/components/schemas/Message')),
            new OA\Response(response: 404, description: 'Vaccination not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function deleteVaccination() {}
}

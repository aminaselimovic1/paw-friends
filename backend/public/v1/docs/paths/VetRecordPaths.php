<?php
use OpenApi\Attributes as OA;

/*
 * OpenAPI documentation of routes/VetRecordRoutes.php.
 * swagger-php reads the #[OA\...] attributes; the methods are empty, they only
 * carry the documentation. Keep it in sync with the routes: one method per route.
 */
class VetRecordPaths
{
    #[OA\Get(
        path: '/vet-records',
        tags: ['vet-records'],
        summary: 'All vet records',
        responses: [
            new OA\Response(response: 200, description: 'All vet records',
                content: new OA\JsonContent(type: 'array', items: new OA\Items(ref: '#/components/schemas/VetRecord'))),
        ]
    )]
    public function getVetRecords() {}

    #[OA\Get(
        path: '/vet-records/{id}',
        tags: ['vet-records'],
        summary: 'One vet record',
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        responses: [
            new OA\Response(response: 200, description: 'The vet record',
                content: new OA\JsonContent(ref: '#/components/schemas/VetRecord')),
            new OA\Response(response: 404, description: 'Vet record not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function getVetRecordById() {}

    #[OA\Get(
        path: '/pets/{id}/vet-records',
        tags: ['vet-records'],
        summary: "One pet's visits, newest first (pet details)",
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        responses: [
            new OA\Response(response: 200, description: "The pet's vet records",
                content: new OA\JsonContent(type: 'array', items: new OA\Items(ref: '#/components/schemas/VetRecord'))),
            new OA\Response(response: 404, description: 'Pet not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function getPetVetRecords() {}

    #[OA\Post(
        path: '/vet-records',
        tags: ['vet-records'],
        summary: 'Create a vet record',
        requestBody: new OA\RequestBody(required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/VetRecordInput')),
        responses: [
            new OA\Response(response: 201, description: 'The new vet record',
                content: new OA\JsonContent(ref: '#/components/schemas/VetRecord')),
            new OA\Response(response: 400, description: 'Invalid data, e.g. a visit date in the future or a pet that does not exist',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
            new OA\Response(response: 409, description: 'vet_id is not a vet',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function postVetRecord() {}

    #[OA\Put(
        path: '/vet-records/{id}',
        tags: ['vet-records'],
        summary: 'Update a vet record (all fields, validated like create)',
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        requestBody: new OA\RequestBody(required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/VetRecordInput')),
        responses: [
            new OA\Response(response: 200, description: 'The updated vet record',
                content: new OA\JsonContent(ref: '#/components/schemas/VetRecord')),
            new OA\Response(response: 400, description: 'Invalid data',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
            new OA\Response(response: 404, description: 'Vet record not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
            new OA\Response(response: 409, description: 'vet_id is not a vet',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function putVetRecord() {}

    #[OA\Delete(
        path: '/vet-records/{id}',
        tags: ['vet-records'],
        summary: 'Delete a vet record',
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        responses: [
            new OA\Response(response: 200, description: 'Deleted',
                content: new OA\JsonContent(ref: '#/components/schemas/Message')),
            new OA\Response(response: 404, description: 'Vet record not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function deleteVetRecord() {}
}

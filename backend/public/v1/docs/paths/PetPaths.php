<?php
use OpenApi\Attributes as OA;

/*
 * OpenAPI documentation of routes/PetRoutes.php, including the external API
 * route /pets/{id}/breed-info.
 * swagger-php reads the #[OA\...] attributes; the methods are empty, they only
 * carry the documentation. Keep it in sync with the routes: one method per route.
 */
class PetPaths
{
    #[OA\Get(
        path: '/pets',
        tags: ['pets'],
        summary: 'All pets',
        responses: [
            new OA\Response(response: 200, description: 'All pets',
                content: new OA\JsonContent(type: 'array', items: new OA\Items(ref: '#/components/schemas/Pet'))),
        ]
    )]
    public function getPets() {}

    #[OA\Get(
        path: '/pets/{id}',
        tags: ['pets'],
        summary: 'One pet',
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        responses: [
            new OA\Response(response: 200, description: 'The pet',
                content: new OA\JsonContent(ref: '#/components/schemas/Pet')),
            new OA\Response(response: 404, description: 'Pet not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function getPetById() {}

    #[OA\Get(
        path: '/pets/{id}/breed-info',
        tags: ['breed info'],
        summary: "Breed info for a pet from TheDogAPI or TheCatAPI (the pet's species decides)",
        description: 'Calls the external API with a timeout of 5 seconds. "breed" is null when the pet has no breed info.',
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        responses: [
            new OA\Response(response: 200, description: 'The breed info (or "breed": null)',
                content: new OA\JsonContent(ref: '#/components/schemas/BreedInfo')),
            new OA\Response(response: 404, description: 'Pet not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
            new OA\Response(response: 503, description: 'The breed API is unavailable (timeout or an error answer)',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function getPetBreedInfo() {}

    #[OA\Post(
        path: '/pets',
        tags: ['pets'],
        summary: 'Create a pet',
        requestBody: new OA\RequestBody(required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/PetInput')),
        responses: [
            new OA\Response(response: 201, description: 'The new pet',
                content: new OA\JsonContent(ref: '#/components/schemas/Pet')),
            new OA\Response(response: 400, description: 'Invalid data, e.g. a birth date in the future or a shelter that does not exist',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function postPet() {}

    #[OA\Put(
        path: '/pets/{id}',
        tags: ['pets'],
        summary: 'Update a pet (validated like create; photo_url and breed_api_id are kept if not sent, but a new species drops the old breed_api_id)',
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        requestBody: new OA\RequestBody(required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/PetInput')),
        responses: [
            new OA\Response(response: 200, description: 'The updated pet',
                content: new OA\JsonContent(ref: '#/components/schemas/Pet')),
            new OA\Response(response: 400, description: 'Invalid data',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
            new OA\Response(response: 404, description: 'Pet not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function putPet() {}

    #[OA\Delete(
        path: '/pets/{id}',
        tags: ['pets'],
        summary: 'Delete a pet',
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        responses: [
            new OA\Response(response: 200, description: 'Deleted',
                content: new OA\JsonContent(ref: '#/components/schemas/Message')),
            new OA\Response(response: 404, description: 'Pet not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
            new OA\Response(response: 409, description: 'Applications or health records belong to the pet',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function deletePet() {}
}

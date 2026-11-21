<?php
use OpenApi\Attributes as OA;

/*
 * OpenAPI documentation of routes/AdoptionApplicationRoutes.php, including
 * /users/{id}/adoption-applications and /pets/{id}/adoption-applications.
 * swagger-php reads the #[OA\...] attributes; the methods are empty, they only
 * carry the documentation. Keep it in sync with the routes: one method per route.
 */
class AdoptionApplicationPaths
{
    #[OA\Get(
        path: '/adoption-applications',
        tags: ['adoption-applications'],
        summary: 'All applications',
        responses: [
            new OA\Response(response: 200, description: 'All applications',
                content: new OA\JsonContent(type: 'array', items: new OA\Items(ref: '#/components/schemas/AdoptionApplication'))),
        ]
    )]
    public function getApplications() {}

    #[OA\Get(
        path: '/adoption-applications/{id}',
        tags: ['adoption-applications'],
        summary: 'One application',
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        responses: [
            new OA\Response(response: 200, description: 'The application',
                content: new OA\JsonContent(ref: '#/components/schemas/AdoptionApplication')),
            new OA\Response(response: 404, description: 'Application not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function getApplicationById() {}

    #[OA\Get(
        path: '/users/{id}/adoption-applications',
        tags: ['adoption-applications'],
        summary: "One user's applications, newest first (My applications)",
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        responses: [
            new OA\Response(response: 200, description: "The user's applications",
                content: new OA\JsonContent(type: 'array', items: new OA\Items(ref: '#/components/schemas/AdoptionApplication'))),
            new OA\Response(response: 404, description: 'User not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function getUserApplications() {}

    #[OA\Get(
        path: '/pets/{id}/adoption-applications',
        tags: ['adoption-applications'],
        summary: "One pet's applications, newest first",
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        responses: [
            new OA\Response(response: 200, description: "The pet's applications",
                content: new OA\JsonContent(type: 'array', items: new OA\Items(ref: '#/components/schemas/AdoptionApplication'))),
            new OA\Response(response: 404, description: 'Pet not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function getPetApplications() {}

    #[OA\Post(
        path: '/adoption-applications',
        tags: ['adoption-applications'],
        summary: 'Apply for a pet (an available pet becomes pending)',
        requestBody: new OA\RequestBody(required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/AdoptionApplicationInput')),
        responses: [
            new OA\Response(response: 201, description: 'The new application (status pending)',
                content: new OA\JsonContent(ref: '#/components/schemas/AdoptionApplication')),
            new OA\Response(response: 400, description: 'Invalid data, e.g. a pet or user that does not exist',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
            new OA\Response(response: 409, description: 'The pet is adopted, or the user already has a pending application for it',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function postApplication() {}

    #[OA\Put(
        path: '/adoption-applications/{id}',
        tags: ['adoption-applications'],
        summary: "The admin's review: approve or reject",
        description: 'Approve: the pet becomes adopted and its other pending applications are rejected. '
            . 'Reject: a pending pet with nobody else waiting becomes available. Only status and reviewed_by change.',
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        requestBody: new OA\RequestBody(required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/AdoptionApplicationReview')),
        responses: [
            new OA\Response(response: 200, description: 'The reviewed application',
                content: new OA\JsonContent(ref: '#/components/schemas/AdoptionApplication')),
            new OA\Response(response: 400, description: 'Invalid data, e.g. status "pending" or a reviewer that does not exist',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
            new OA\Response(response: 404, description: 'Application not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
            new OA\Response(response: 409, description: 'The reviewer is not an admin, or the application was already reviewed',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function putApplication() {}

    #[OA\Delete(
        path: '/adoption-applications/{id}',
        tags: ['adoption-applications'],
        summary: 'Delete an application (a pending one frees the pet like a rejection)',
        parameters: [new OA\Parameter(ref: '#/components/parameters/id')],
        responses: [
            new OA\Response(response: 200, description: 'Deleted',
                content: new OA\JsonContent(ref: '#/components/schemas/Message')),
            new OA\Response(response: 404, description: 'Application not found',
                content: new OA\JsonContent(ref: '#/components/schemas/Error')),
        ]
    )]
    public function deleteApplication() {}
}

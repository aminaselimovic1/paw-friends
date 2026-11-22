<?php
use OpenApi\Attributes as OA;

/*
 * General API information + reusable parts (Reading 06): the {id} path
 * parameter, the Error and Message schemas, and two schemas per entity: the
 * ...Input schema is what the client sends, the full schema is what the API
 * returns. "required", the lengths and the allowed values are the same as in
 * the services' validate(), so the documentation states the same rules as the code.
 * swagger-php reads these PHP 8 attributes; the class itself is empty.
 * (Plain /* comments on purpose: swagger-php would turn a /** doc comment
 * into a description.)
 */
#[OA\Info(
    title: 'PawFriends API',
    version: '1.0',
    description: 'REST API of PawFriends: pet adoption and veterinary records (IT 2001 Web Programming).'
        . "\n\nErrors always come as JSON `{\"error\": \"...\"}`: **400** invalid input, **404** not found, "
        . '**405** the URL exists but not with this method, '
        . '**409** the request breaks a business rule (e.g. the email is taken, the pet is adopted), '
        . '**503** the external breed API is unavailable, **500** an unexpected server error '
        . '(the details are only in the server log).'
        . "\n\nLogin with JWT and role checks (401/403) come in Milestone 4."
)]
#[OA\Server(url: API_BASE_URL, description: 'This server')]
#[OA\Tag(name: 'shelters', description: 'Animal shelters; one shelter has many pets')]
#[OA\Tag(name: 'pets', description: 'Dogs and cats; each pet belongs to one shelter')]
#[OA\Tag(name: 'breed info', description: 'The external API: breed information from TheDogAPI / TheCatAPI')]
#[OA\Tag(name: 'users', description: 'Accounts with the role user, vet or admin. The password hash is never returned.')]
#[OA\Tag(name: 'adoption-applications', description: "A user's application to adopt a pet, and the admin's review")]
#[OA\Tag(name: 'vet-records', description: "A vet's visit notes for a pet")]
#[OA\Tag(name: 'vaccinations', description: 'Vaccines given to a pet by a vet')]
#[OA\Tag(name: 'status', description: 'Check that the API is running')]

// ---------- Answers that every resource uses ----------
#[OA\Schema(
    schema: 'Error',
    properties: [
        new OA\Property(property: 'error', type: 'string', example: "Field 'name' is required."),
    ]
)]
#[OA\Schema(
    schema: 'Message',
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'Shelter deleted'),
    ]
)]
#[OA\Schema(
    schema: 'Status',
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'PawFriends API is running'),
    ]
)]

// ---------- Shelters (ShelterService) ----------
#[OA\Schema(
    schema: 'ShelterInput',
    required: ['name', 'address', 'city', 'phone', 'email'],
    properties: [
        new OA\Property(property: 'name', type: 'string', minLength: 2, maxLength: 100, example: 'Happy Paws Shelter'),
        new OA\Property(property: 'address', type: 'string', maxLength: 150, example: 'Kestenova 12'),
        new OA\Property(property: 'city', type: 'string', maxLength: 100, example: 'Sarajevo'),
        new OA\Property(property: 'phone', type: 'string', maxLength: 50, example: '+387 33 123 456',
            description: '6 to 15 digits, one space allowed between them, + only at the start'),
        new OA\Property(property: 'email', type: 'string', format: 'email', maxLength: 255, example: 'info@happypaws.example'),
        new OA\Property(property: 'description', type: 'string', maxLength: 500, nullable: true,
            example: "A family-run shelter that has been finding homes for dogs and cats since 2015. Our volunteers walk, feed and play with every animal each day, and we're happy to help you find the pet that fits your home."),
        new OA\Property(property: 'opening_hours', type: 'string', maxLength: 300, nullable: true,
            example: "Monday–Friday: 9:00–17:00\nSaturday: 10:00–14:00\nSunday: closed"),
        new OA\Property(property: 'latitude', type: 'number', minimum: -90, maximum: 90, nullable: true, example: 43.8563,
            description: 'Both coordinates or neither. Answers return it as text with 6 decimals, e.g. "43.856300".'),
        new OA\Property(property: 'longitude', type: 'number', minimum: -180, maximum: 180, nullable: true, example: 18.4131,
            description: 'Both coordinates or neither. Answers return it as text with 6 decimals, e.g. "18.413100".'),
    ]
)]
#[OA\Schema(
    schema: 'Shelter',
    allOf: [new OA\Schema(ref: '#/components/schemas/ShelterInput')],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
    ]
)]

// ---------- Pets (PetService) ----------
#[OA\Schema(
    schema: 'PetInput',
    required: ['shelter_id', 'name', 'species', 'breed_name', 'sex', 'birth_date', 'status'],
    properties: [
        new OA\Property(property: 'shelter_id', type: 'integer', example: 1, description: 'Must be an existing shelter'),
        new OA\Property(property: 'name', type: 'string', minLength: 2, maxLength: 50, example: 'Max'),
        new OA\Property(property: 'species', type: 'string', enum: ['dog', 'cat'], example: 'dog'),
        new OA\Property(property: 'breed_name', type: 'string', maxLength: 100, example: 'Labrador Retriever'),
        new OA\Property(property: 'breed_api_id', type: 'string', maxLength: 20, nullable: true, example: '149',
            description: "The breed's id in TheDogAPI (a number) or TheCatAPI (4 letters). On update: kept if not sent, unless the species changes (then it becomes null)."),
        new OA\Property(property: 'sex', type: 'string', enum: ['male', 'female'], example: 'male'),
        new OA\Property(property: 'birth_date', type: 'string', format: 'date', example: '2023-06-12',
            description: "YYYY-MM-DD, not in the future"),
        new OA\Property(property: 'description', type: 'string', maxLength: 500, nullable: true,
            example: 'A friendly, energetic dog who loves long walks and playing fetch. Great with children.'),
        new OA\Property(property: 'photo_url', type: 'string', maxLength: 255, nullable: true, example: 'assets/images/pet-max.jpg',
            description: 'On update: kept if not sent'),
        new OA\Property(property: 'status', type: 'string', enum: ['available', 'pending', 'adopted'], example: 'available',
            description: 'Any of the three is accepted: the admin keeps manual control of the status'),
    ]
)]
#[OA\Schema(
    schema: 'Pet',
    allOf: [new OA\Schema(ref: '#/components/schemas/PetInput')],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
    ]
)]

// ---------- Breed info (BreedService, the external API) ----------
#[OA\Schema(
    schema: 'Breed',
    properties: [
        new OA\Property(property: 'id', type: 'string', example: '149'),
        new OA\Property(property: 'name', type: 'string', example: 'Labrador Retriever'),
        new OA\Property(property: 'temperament', type: 'string', nullable: true,
            example: 'Friendly, outgoing, energetic, intelligent, gentle, eager to please'),
        new OA\Property(property: 'life_span', type: 'string', nullable: true, example: '10-12', description: 'In years'),
        new OA\Property(property: 'origin', type: 'string', nullable: true, example: 'Newfoundland, Canada'),
        new OA\Property(property: 'image_url', type: 'string', nullable: true,
            example: 'https://cdn4.thedogapi.com/optimized/BE5AcsNMdm.jpg'),
    ]
)]
#[OA\Schema(
    schema: 'BreedInfo',
    properties: [
        new OA\Property(property: 'pet_id', type: 'integer', example: 1),
        new OA\Property(property: 'species', type: 'string', enum: ['dog', 'cat'], example: 'dog'),
        new OA\Property(property: 'breed', nullable: true, allOf: [new OA\Schema(ref: '#/components/schemas/Breed')],
            description: 'null when the pet has no breed info (no breed_api_id, or an id the API does not know)'),
    ]
)]

// ---------- Users (UserService) ----------
#[OA\Schema(
    schema: 'UserInput',
    required: ['name', 'email', 'password'],
    properties: [
        new OA\Property(property: 'name', type: 'string', minLength: 2, maxLength: 100, example: 'Amra Hasić'),
        new OA\Property(property: 'email', type: 'string', format: 'email', maxLength: 255, example: 'amra@example.com',
            description: 'Must not be used by another account (any upper/lower case)'),
        new OA\Property(property: 'password', type: 'string', format: 'password', minLength: 8, maxLength: 72, example: 'demo1234',
            description: 'At least 8 characters, not only spaces, at most 72 bytes (a letter like č counts as 2). Stored only as a hash; never returned.'),
        new OA\Property(property: 'role', type: 'string', enum: ['user', 'vet', 'admin'], example: 'user',
            description: "Optional, 'user' if not sent"),
        new OA\Property(property: 'phone', type: 'string', maxLength: 50, nullable: true, example: '+387 61 123 456'),
        new OA\Property(property: 'city', type: 'string', maxLength: 100, nullable: true, example: 'Sarajevo'),
    ]
)]
#[OA\Schema(
    schema: 'UserUpdate',
    description: 'Never changes the password. role, phone and city keep their stored value if not sent.',
    required: ['name', 'email'],
    properties: [
        new OA\Property(property: 'name', type: 'string', minLength: 2, maxLength: 100, example: 'Selma Hodžić'),
        new OA\Property(property: 'email', type: 'string', format: 'email', maxLength: 255, example: 'admin@example.com'),
        new OA\Property(property: 'role', type: 'string', enum: ['user', 'vet', 'admin'], example: 'admin'),
        new OA\Property(property: 'phone', type: 'string', maxLength: 50, nullable: true, example: '+387 33 111 222'),
        new OA\Property(property: 'city', type: 'string', maxLength: 100, nullable: true, example: 'Sarajevo'),
    ]
)]
#[OA\Schema(
    schema: 'User',
    description: 'An account as the API returns it: never with the password or its hash',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 7),
        new OA\Property(property: 'name', type: 'string', example: 'Lejla Kovač'),
        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'lejla@example.com'),
        new OA\Property(property: 'role', type: 'string', enum: ['user', 'vet', 'admin'], example: 'user'),
        new OA\Property(property: 'phone', type: 'string', nullable: true, example: '+387 61 123 456'),
        new OA\Property(property: 'city', type: 'string', nullable: true, example: 'Sarajevo'),
    ]
)]

// ---------- Adoption applications (AdoptionApplicationService) ----------
#[OA\Schema(
    schema: 'AdoptionApplicationInput',
    description: 'Applying for a pet. The status is always pending at first.',
    required: ['pet_id', 'user_id'],
    properties: [
        new OA\Property(property: 'pet_id', type: 'integer', example: 4, description: 'An existing pet that is not adopted'),
        new OA\Property(property: 'user_id', type: 'integer', example: 7, description: "An existing account with the role 'user' (from the login token in M4)"),
        new OA\Property(property: 'message', type: 'string', maxLength: 1000, nullable: true,
            example: 'We have a garden and lots of time for walks.'),
    ]
)]
#[OA\Schema(
    schema: 'AdoptionApplicationReview',
    description: "The admin's decision. Approve: the pet becomes adopted and its other pending applications are rejected. "
        . 'Reject: a pending pet with nobody else waiting becomes available.',
    required: ['status', 'reviewed_by'],
    properties: [
        new OA\Property(property: 'status', type: 'string', enum: ['approved', 'rejected'], example: 'approved'),
        new OA\Property(property: 'reviewed_by', type: 'integer', example: 1, description: 'Must be an admin'),
    ]
)]
#[OA\Schema(
    schema: 'AdoptionApplication',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'pet_id', type: 'integer', example: 2),
        new OA\Property(property: 'user_id', type: 'integer', example: 7),
        new OA\Property(property: 'message', type: 'string', nullable: true,
            example: 'I work from home and have a quiet flat, which would suit a calm cat like Luna.'),
        new OA\Property(property: 'status', type: 'string', enum: ['pending', 'approved', 'rejected'], example: 'pending'),
        new OA\Property(property: 'reviewed_by', type: 'integer', nullable: true, example: null),
        new OA\Property(property: 'created_at', type: 'string', example: '2026-10-12 00:00:00'),
    ]
)]

// ---------- Vet records (VetRecordService) ----------
#[OA\Schema(
    schema: 'VetRecordInput',
    required: ['pet_id', 'vet_id', 'visit_date', 'reason'],
    properties: [
        new OA\Property(property: 'pet_id', type: 'integer', example: 1, description: 'Must be an existing pet'),
        new OA\Property(property: 'vet_id', type: 'integer', example: 2, description: 'Must be a vet (from the login token in M4)'),
        new OA\Property(property: 'visit_date', type: 'string', format: 'date', example: '2026-08-14',
            description: "YYYY-MM-DD, not in the future and not before the pet's birth date"),
        new OA\Property(property: 'reason', type: 'string', maxLength: 150, example: 'Yearly check-up'),
        new OA\Property(property: 'diagnosis', type: 'string', maxLength: 255, nullable: true, example: 'Healthy, normal weight'),
        new OA\Property(property: 'treatment', type: 'string', maxLength: 255, nullable: true, example: 'Deworming tablet'),
        new OA\Property(property: 'notes', type: 'string', maxLength: 1000, nullable: true, example: null),
    ]
)]
#[OA\Schema(
    schema: 'VetRecord',
    allOf: [new OA\Schema(ref: '#/components/schemas/VetRecordInput')],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
    ]
)]

// ---------- Vaccinations (VaccinationService) ----------
#[OA\Schema(
    schema: 'VaccinationInput',
    required: ['pet_id', 'vet_id', 'vaccine_name', 'date_given'],
    properties: [
        new OA\Property(property: 'pet_id', type: 'integer', example: 1, description: 'Must be an existing pet'),
        new OA\Property(property: 'vet_id', type: 'integer', example: 2, description: 'Must be a vet (from the login token in M4)'),
        new OA\Property(property: 'vaccine_name', type: 'string', maxLength: 100, example: 'Rabies'),
        new OA\Property(property: 'date_given', type: 'string', format: 'date', example: '2026-08-14',
            description: "YYYY-MM-DD, not in the future and not before the pet's birth date"),
        new OA\Property(property: 'next_due_date', type: 'string', format: 'date', nullable: true, example: '2027-08-14',
            description: 'Optional; must be after date_given (it may be in the past: overdue)'),
    ]
)]
#[OA\Schema(
    schema: 'Vaccination',
    allOf: [new OA\Schema(ref: '#/components/schemas/VaccinationInput')],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
    ]
)]
class OpenApiSpec
{
    // GET / is the test route in index.php (there's no routes file for it)
    #[OA\Get(
        path: '/',
        tags: ['status'],
        summary: 'Check that the API is running',
        responses: [
            new OA\Response(response: 200, description: 'The API is running',
                content: new OA\JsonContent(ref: '#/components/schemas/Status')),
        ]
    )]
    public function getStatus() {}
}

/*
 * The {id} in every path, written once and used with
 * ref: '#/components/parameters/id'. It's on its own empty class on purpose:
 * on the OpenApiSpec class, together with the schemas, swagger-php 6.20
 * silently left out every schema (tested; no warning at all).
 */
#[OA\Parameter(
    parameter: 'id',
    name: 'id',
    in: 'path',
    required: true,
    description: 'The id in the path (a whole number)',
    example: 1,
    schema: new OA\Schema(type: 'integer', minimum: 1)
)]
class OpenApiParameters
{
}

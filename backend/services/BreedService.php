<?php
require_once __DIR__ . '/ExternalApiException.php';
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../dao/PetDao.php';

// Breed info for the pet details page (temperament, life span, origin, photo)
// from an external API: TheDogAPI for dogs, TheCatAPI for cats. The pet's
// species decides which one; the pet's breed_api_id says which breed.
// Not a BaseService: there's no breeds table, the data comes from the API.
class BreedService
{
    // Both APIs have the same paths and answers; only the address differs
    private const API_URLS = [
        'dog' => 'https://api.thedogapi.com/v1',
        'cat' => 'https://api.thecatapi.com/v1',
    ];
    private const API_NAMES = ['dog' => 'TheDogAPI', 'cat' => 'TheCatAPI'];

    // If the API is slow or down, the pet page must not wait for it:
    private const CONNECT_TIMEOUT = 3; // seconds to reach the API
    private const TIMEOUT = 5;         // seconds for the whole answer

    private const UNAVAILABLE_MESSAGE = "Breed information isn't available at the moment. Please try again later.";

    public function __construct(private PetDao $petDao = new PetDao()) {}

    // Returns null if there's no such pet (the route answers 404).
    // "breed" is null when the pet has no breed info: a mixed breed without a
    // breed_api_id, or an id the API doesn't know.
    public function getForPet(int $petId): ?array
    {
        $pet = $this->petDao->getById($petId);
        if ($pet === null) {
            return null;
        }
        $breed = $pet['breed_api_id'] === null ? null : $this->fetchBreed($pet['species'], $pet['breed_api_id']);

        return [
            'pet_id' => $pet['id'],
            'species' => $pet['species'],
            'breed' => $breed === null ? null : [
                'id' => $breed['id'] ?? null,
                'name' => $breed['name'],
                'temperament' => $breed['temperament'] ?? null,
                'life_span' => $breed['life_span'] ?? null, // in years, e.g. "10-12"
                'origin' => $breed['origin'] ?? null,
                'image_url' => $breed['image']['url'] ?? null,
            ],
        ];
    }

    // One call: GET /v1/breeds/{id}. The answer already contains the photo
    // (image.url). Returns null if the API doesn't know the breed (404).
    private function fetchBreed(string $species, string $breedApiId): ?array
    {
        $apiName = self::API_NAMES[$species];
        $url = self::API_URLS[$species] . '/breeds/' . rawurlencode($breedApiId);
        $apiKey = $species === 'dog' ? Config::DOG_API_KEY() : Config::CAT_API_KEY();

        $curl = curl_init($url);
        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => true,               // return the answer instead of printing it
            CURLOPT_CONNECTTIMEOUT => self::CONNECT_TIMEOUT,
            CURLOPT_TIMEOUT => self::TIMEOUT,
            CURLOPT_HTTPHEADER => ['x-api-key: ' . $apiKey], // the key goes in a header, never in the URL or the log
        ]);
        $body = curl_exec($curl);
        $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        $curlError = curl_error($curl);
        // (no curl_close(): since PHP 8.0 the handle is freed by itself)

        // No answer at all: a timeout, no internet, the API's server is down
        if ($body === false) {
            $this->fail("$apiName request failed: $curlError ($url)");
        }
        // The API doesn't know this breed: our breed_api_id is wrong. Not the
        // user's fault, so no error for them, but logged so it can be fixed.
        if ($status === 404) {
            error_log("$apiName has no breed '$breedApiId' (HTTP 404, $url)");
            return null;
        }
        // Any other error: a wrong key (401), too many requests (429), 5xx...
        if ($status !== 200) {
            $this->fail("$apiName answered HTTP $status ($url)");
        }
        $breed = json_decode($body, true);
        if (!is_array($breed) || !isset($breed['name'])) {
            $this->fail("$apiName sent an answer that isn't a breed ($url)");
        }
        return $breed;
    }

    // Writes the technical details to the error log, then gives the user a
    // friendly message (503 through Flight::map('error') in index.php)
    private function fail(string $details): never
    {
        error_log("External API error: $details");
        throw new ExternalApiException(self::UNAVAILABLE_MESSAGE);
    }
}

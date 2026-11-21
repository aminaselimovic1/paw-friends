<?php
// Thrown when an external API (TheDogAPI / TheCatAPI) can't be reached or
// answers with an error. Its message is a friendly one for the user; the
// technical details are written to the error log before it's thrown.
// Flight::map('error') in index.php answers it with 503 Service Unavailable.
class ExternalApiException extends RuntimeException
{
}

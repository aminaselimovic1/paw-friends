# AGENTS.md

## Project
PawFriends: a pet adoption and veterinary record system. Shelters list pets, users browse them and apply to adopt, and every pet has a health history of vet records and vaccinations.
Roles: admin (manages all entities, approves or rejects adoption applications), vet (writes vet records and vaccinations), user (browses pets, applies to adopt).
Entities: users, shelters, pets, adoption_applications, vet_records, vaccinations.
External API: TheDogAPI / TheCatAPI. The pet details view shows breed info (temperament, life span, origin, photo); the pet's species decides which API is called.

## Technology stack
- Frontend: HTML, CSS, JavaScript, jQuery, Bootstrap 5, Bootstrap Icons, Leaflet with OpenStreetMap (the map on shelter details), single-page application (SPA)
- Backend: PHP 8.2+ with FlightPHP 3 (REST API, installed with Composer), PDO, MySQL
- Authentication: JWT (from Milestone 4). API documentation: OpenAPI 3.0 with swagger-php (PHP 8 attributes) and Swagger UI
- Local server: XAMPP

## Folder structure
- frontend/: css/, js/, views/ (one HTML file per view), assets/ (images, icons)
- backend/:
  - index.php (the front controller: registers the services, the error handlers and the route files) and .htaccess (sends every request that isn't a real file to index.php)
  - composer.json and composer.lock (committed); vendor/ (not committed, created by composer install)
  - routes/ (one XRoutes.php per resource), services/ (BaseService.php, one service per entity, BreedService.php for the external API, ExternalApiException.php), dao/ (Database.php, BaseDao.php and one DAO per table)
  - public/v1/docs/ (the OpenAPI documentation: doc_setup.php with the API info and schemas, paths/ with one XPaths.php per routes file, swagger.php, and index.html = Swagger UI)
  - middleware/, config/, logs/, database/ (pawfriends.sql: the schema and sample data), test-dao.php (a manual test of the DAOs, run from the terminal; delete it before deploying in Milestone 5)
- docs/: AI_LOG.md and other documentation

## Frontend rules
- Each view is in its own file in frontend/views/.
- Use Bootstrap 5 classes; avoid inline styles. Custom CSS goes in frontend/css/.
- Every view must work on mobile (responsive layout).
- Only service files in frontend/js/ call the backend; views never contain AJAX calls.
- Until Milestone 4, views may use static sample data. From Milestone 4, all data comes from the REST API.

## Backend rules
- Requests go: route -> middleware -> service -> DAO -> database.
- Only services call DAO classes. Routes never call DAO classes directly.
- All SQL is in DAO classes and uses PDO prepared statements. Every DAO extends BaseDao.
- The PDO connection is opened only in Database::getConnection().
- Routes return JSON with correct HTTP status codes (200, 201, 400, 401, 403, 404, 405, 409, 500, 503).
- A route only reads the input, calls one service method and answers with Flight::json(). Business rules belong in services.
- Services validate every input and pass only allowed fields to the DAO (an allow-list). The API never returns password_hash.
- Services report problems with exceptions, and Flight::map('error') in index.php turns them into answers: InvalidArgumentException -> 400, DomainException (a broken business rule) -> 409, ExternalApiException -> 503, anything else -> 500 with a general message (the details go to the error log).
- Every route is documented in public/v1/docs/paths/ (one method per route, in the XPaths.php of its routes file), in the same change as the route.
- Libraries must run on PHP 8.2 (XAMPP's version): run Composer with the PHP that runs the app.
- Middleware is registered in Flight and reused, never copied into individual routes.
- External API calls happen in a service, with a timeout; failures are written to the error log and return a user-friendly message.
- Error responses never expose stack traces, SQL queries or file paths.

## Conventions
- PHP classes: PascalCase (PetService, PetDao). Files are named after the class.
- JavaScript and PHP variables: camelCase. Database tables and columns: snake_case, table names plural.
- View files: kebab-case (pet-details.html). REST routes: plural nouns in kebab-case (/pets, /adoption-applications/{id}).

## Rules for AI assistants
- Do not add new libraries or frameworks without asking me first.
- Do not change the database schema without asking me first.
- Never put passwords, keys or secrets in code; they belong in backend/config/config.php, which is not committed. Update config.example.php instead.
- Do not edit files in backend/logs/.
- Change only what the task asks for; do not "improve" other files or code.
- Keep code simple and readable.
- Make small changes and explain what you changed and why.
- Do not commit, push or merge unless I ask. Never merge a milestone branch into main.

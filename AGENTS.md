# AGENTS.md

## Project
PawFriends: a pet adoption and veterinary record system. Shelters list pets, users browse them and apply to adopt, and every pet has a health history of vet records and vaccinations.
Roles: admin (manages all entities, approves or rejects adoption applications), vet (writes vet records and vaccinations), user (browses pets, applies to adopt).
Entities: users, shelters, pets, adoption_applications, vet_records, vaccinations.
External API: TheDogAPI / TheCatAPI. The pet details view shows breed info (temperament, life span, origin, photo); the pet's species decides which API is called.

## Technology stack
- Frontend: HTML, CSS, JavaScript, jQuery, Bootstrap 5, single-page application (SPA)
- Backend: PHP with FlightPHP (REST API), PDO, MySQL
- Authentication: JWT. API documentation: OpenAPI (Swagger)
- Local server: XAMPP

## Folder structure
- frontend/: css/, js/, views/ (one HTML file per view), assets/ (images, icons)
- backend/: routes/, services/, dao/, middleware/, config/, logs/
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
- Routes return JSON with correct HTTP status codes (200, 201, 400, 401, 403, 404, 500).
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

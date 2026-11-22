# PawFriends

PawFriends is a pet adoption and veterinary record system. Shelters list their pets, users browse them and apply to adopt, and every pet has a health history of vet records and vaccinations.

Course project for IT 2001 Web Programming (IBU).

> **Current state: Milestone 3.** The backend is a REST API (FlightPHP) with a service for each entity, CRUD routes for all six entities, the breed info from TheDogAPI / TheCatAPI, and OpenAPI documentation with a Swagger page. The frontend is still a static single-page application with sample data. Connecting the frontend to the API, with JWT login and role checks, comes in Milestone 4.

## Roles

| Role | What they can do |
|---|---|
| **User** | browses pets and shelters, applies to adopt, follows their applications |
| **Vet** | writes vet records and vaccinations for pets, sees follow-ups that are due |
| **Admin** | manages users, shelters and pets, approves or rejects adoption applications |

Guests (not logged in) can browse pets and shelters, and can log in or register.

## Entities

| Table | Description |
|---|---|
| `users` | everyone who logs in; the `role` column is `user`, `vet` or `admin` |
| `shelters` | animal shelters; one shelter has many pets |
| `pets` | dogs and cats; each pet belongs to one shelter |
| `adoption_applications` | a user's application to adopt a pet, reviewed by an admin |
| `vet_records` | a vet's visit notes for a pet (reason, diagnosis, treatment) |
| `vaccinations` | vaccines given to a pet by a vet, with the next due date |

See [docs/ERD.md](docs/ERD.md) for the relationships between these tables.

## External API

The pet details page shows breed information (temperament, life span, origin, photo) from [TheDogAPI](https://thedogapi.com) for dogs or [TheCatAPI](https://thecatapi.com) for cats. The pet's species decides which API is called, and the pet's `breed_api_id` says which breed.

- **Backend (done in Milestone 3):** `GET /pets/{id}/breed-info`, in `backend/services/BreedService.php`. It calls the API with a timeout (5 seconds) and the API key from `config.php`. If the API is unavailable, the endpoint answers `503` with a friendly message, the details are written to the error log, and the rest of the app keeps working. A pet without breed info (e.g. a mixed breed) gets `"breed": null`.
- **Frontend (Milestone 4):** the "About the breed" card on the pet details page will show this data. Until then it shows a placeholder.

## Technology stack

- **Frontend:** HTML, CSS, JavaScript, jQuery, Bootstrap 5, Bootstrap Icons, Leaflet with OpenStreetMap (the map on shelter details)
- **Backend:** PHP 8.2+, PDO and MySQL; FlightPHP 3 for the REST API, installed with Composer
- **Authentication (from Milestone 4):** JWT
- **API documentation:** OpenAPI 3.0, written with swagger-php (PHP 8 attributes) and shown with Swagger UI
- **Local server:** XAMPP

## Project structure

```
paw-friends/
├── AGENTS.md          rules for AI coding assistants
├── docs/
│   ├── AI_LOG.md      how AI was used in each milestone
│   └── ERD.md         the database design (Entity-Relationship Diagram)
├── backend/
│   ├── index.php      the API's entry point: services, error handling, routes
│   ├── .htaccess      sends every API request to index.php
│   ├── composer.json  the libraries (FlightPHP, swagger-php); composer.lock has the exact versions
│   ├── vendor/        the installed libraries (not in Git; created by composer install)
│   ├── routes/        one routes file per resource, e.g. PetRoutes.php
│   ├── services/      BaseService.php, one service per entity, BreedService.php (the external API)
│   ├── dao/           Database.php (the connection), BaseDao.php and one DAO per table
│   ├── public/v1/docs/  the OpenAPI documentation and the Swagger page
│   ├── database/      pawfriends.sql: the tables and the sample data
│   ├── config/        config.example.php, the template for config.php
│   ├── middleware/    (from Milestone 4)
│   ├── logs/          (from Milestone 4)
│   └── test-dao.php   a manual test of the DAOs
└── frontend/
    ├── index.html     the SPA shell: navbar, footer, and <main> where views load
    ├── css/           style.css
    ├── js/            router, role handling, and one script per page
    ├── views/         one HTML file per page
    └── assets/        images
```

## Running the project with XAMPP

**Requirements:** XAMPP with Apache, MySQL and PHP **8.2 or newer** (swagger-php needs 8.2), [Composer](https://getcomposer.org), Git, and an internet connection (Bootstrap, jQuery, Leaflet and Swagger UI load from a CDN, the map loads from OpenStreetMap, and the breed info comes from TheDogAPI / TheCatAPI).

1. **Clone the repository** into XAMPP's `htdocs` folder. Open a terminal and use the commands for your operating system:

   **macOS (Terminal):**

   ```bash
   cd /Applications/XAMPP/xamppfiles/htdocs
   git clone https://github.com/aminaselimovic1/paw-friends.git
   cd paw-friends
   ```

   **Windows (Command Prompt):**

   ```bat
   cd /d C:\xampp\htdocs
   git clone https://github.com/aminaselimovic1/paw-friends.git
   cd paw-friends
   ```

2. Start **Apache** and **MySQL** in the XAMPP Control Panel.
3. **Import the database:** open phpMyAdmin (<http://localhost/phpmyadmin>), go to the **Import** tab, choose `backend/database/pawfriends.sql` and click **Import**. The file creates the `paw_friends` database with its 6 tables and the sample data. Importing it again resets the data.
4. **Create the configuration file:** from the `paw-friends` project folder (entered in step 1), copy `backend/config/config.example.php` to `backend/config/config.php`:

   **macOS (Terminal):**

   ```bash
   cp backend/config/config.example.php backend/config/config.php
   ```

   **Windows (Command Prompt):**

   ```bat
   copy backend\config\config.example.php backend\config\config.php
   ```

   The database values are XAMPP's defaults (user `root`, no password). Change them in `config.php` if your MySQL is set up differently.

   **API keys for the breed info:** get a free key at [thedogapi.com](https://thedogapi.com) and one at [thecatapi.com](https://thecatapi.com), and put them in `DOG_API_KEY()` and `CAT_API_KEY()` in `config.php`. `config.php` is never committed, because it holds the real credentials and keys.
5. **Install the backend libraries** (FlightPHP and swagger-php) with Composer, from the `paw-friends` project folder:

   ```bash
   cd backend
   composer install
   cd ..
   ```

   This creates `backend/vendor/` with the exact versions from `composer.lock`. Composer must run with PHP 8.2 or newer. If your terminal's `php -v` shows a different PHP than XAMPP's, run Composer with XAMPP's PHP, e.g. on macOS: `/Applications/XAMPP/bin/php $(which composer) install`.
6. **Optional: check the database connection.** Run the DAO test script from the project folder: `/Applications/XAMPP/bin/php backend/test-dao.php` (on Windows: `C:\xampp\php\php.exe backend\test-dao.php`). It prints shelters, pets and a user from the database, then adds, changes and deletes a test shelter.
7. Open the frontend in a browser: <http://localhost/paw-friends/frontend/>
8. Open the API documentation: <http://localhost/paw-friends/backend/public/v1/docs/> (see [REST API](#rest-api) below).

The app must be opened through Apache (`http://localhost/...`), not by double-clicking `index.html`. The router loads each view with an AJAX request, and browsers block those requests for files opened from disk.

## REST API

- **Base URL:** <http://localhost/paw-friends/backend/> (`GET /` answers `{"message": "PawFriends API is running"}`)
- **Swagger documentation:** <http://localhost/paw-friends/backend/public/v1/docs/>. Every endpoint with its parameters, request body and possible answers. **"Try it out"** sends real requests, so POST, PUT and DELETE change the data; importing `pawfriends.sql` again resets it.
- Requests and answers are JSON (send `Content-Type: application/json`).

| Resource | Endpoints |
|---|---|
| Shelters | `GET`/`POST /shelters`, `GET`/`PUT`/`DELETE /shelters/{id}`, `GET /shelters/{id}/pets` |
| Pets | `GET`/`POST /pets`, `GET`/`PUT`/`DELETE /pets/{id}`, `GET /pets/{id}/breed-info` (the external API) |
| Users | `GET`/`POST /users`, `GET`/`PUT`/`DELETE /users/{id}` (the password is stored only as a hash and never returned) |
| Adoption applications | `GET`/`POST /adoption-applications`, `GET`/`PUT`/`DELETE /adoption-applications/{id}` (`PUT` is the admin's review: approve or reject), `GET /users/{id}/adoption-applications`, `GET /pets/{id}/adoption-applications` |
| Vet records | `GET`/`POST /vet-records`, `GET`/`PUT`/`DELETE /vet-records/{id}`, `GET /pets/{id}/vet-records` |
| Vaccinations | `GET`/`POST /vaccinations`, `GET`/`PUT`/`DELETE /vaccinations/{id}`, `GET /pets/{id}/vaccinations` |

**Answers:** `200` OK, `201` created, `400` invalid input, `404` not found, `405` the URL exists but not with this method (e.g. `PATCH`), `409` the request breaks a business rule (for example: the email is already used, the pet is already adopted, a shelter that still has pets can't be deleted), `503` the breed API is unavailable, `500` an unexpected server error. Errors always come as `{"error": "..."}`, without technical details.

In Milestone 3 every endpoint is open. Login with JWT, and the role checks (`401`/`403`) that decide who may call what, come in Milestone 4.

## Trying the frontend demo

The frontend isn't connected to the backend yet (that comes in Milestone 4), so the demo works like this:

- **Switching roles:** the **"Demo: view as"** menu at the top of the page switches between Guest, User, Vet and Admin. The navbar and the pages change to match the role.
- **Logging in:** the login page lists demo accounts. The email decides the role; the password isn't checked yet.

  | Role | Email |
  |---|---|
  | User | `lejla@example.com` |
  | Vet | `emina.vet@example.com` |
  | Admin | `admin@example.com` |

  In the database, every sample account has the password `demo1234`, stored only as a hash. It will be checked at login from Milestone 4.

- **Sample data:** pets, shelters, applications and health records are sample data in the JavaScript files. Changes (for example approving an application or adding a pet) last until the page is reloaded. Only the chosen role is remembered.

### Pages and who can open them

| Page | Address | Who can open it |
|---|---|---|
| Home | `#home` | everyone |
| Pets | `#pets` | everyone |
| Pet details | `#pet-details?id=1` | everyone (the actions depend on the role) |
| Shelters | `#shelters` | everyone |
| Shelter details (with map) | `#shelter-details?id=1` | everyone |
| About, Contact | `#about`, `#contact` | everyone |
| Log in, Register | `#login`, `#register` | guests |
| My applications | `#my-applications` | user |
| Profile | `#profile` | user, vet, admin |
| Vet dashboard | `#vet-dashboard` | vet |
| Admin dashboard | `#admin-dashboard` | admin |
| Manage pets, shelters, users, applications | `#manage-pets`, `#manage-shelters`, `#manage-users`, `#manage-applications` | admin |

Opening a page your role can't see sends guests to the login page and everyone else to the home page. Any unknown address shows the "Page not found" view. All pages are responsive and work on phones.

## Documentation

- **Swagger (API documentation):** <http://localhost/paw-friends/backend/public/v1/docs/> (after the setup above)
- **Deployed application:** the live link is added with the deployment in Milestone 5
- [docs/ERD.md](docs/ERD.md): the Entity-Relationship Diagram with the 6 entities and their relationships
- [backend/database/pawfriends.sql](backend/database/pawfriends.sql): the database tables and the sample data
- [AGENTS.md](AGENTS.md): project rules and conventions, also used by AI coding assistants
- [docs/AI_LOG.md](docs/AI_LOG.md): how AI was used in each milestone

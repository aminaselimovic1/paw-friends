# PawFriends

PawFriends is a pet adoption and veterinary record system. Shelters list their pets, users browse them and apply to adopt, and every pet has a health history of vet records and vaccinations.

Course project for IT 2001 Web Programming (IBU).

> **Current state: Milestone 2.** The backend has its MySQL database, with the same sample data as the frontend, and the DAO layer that reads and writes it. The frontend is still a static single-page application with sample data. The REST API (FlightPHP) comes in Milestone 3, and connecting the frontend to it, with JWT login, in Milestone 4.

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
| `vaccinations` | vaccines given to a pet, with the next due date |

## External API

The pet details page will show breed information (temperament, life span, origin, photo) from [TheDogAPI](https://thedogapi.com) for dogs or [TheCatAPI](https://thecatapi.com) for cats. In Milestone 1 the page has a placeholder for it.

## Technology stack

- **Frontend:** HTML, CSS, JavaScript, jQuery, Bootstrap 5, Bootstrap Icons, Leaflet with OpenStreetMap (the map on shelter details)
- **Backend:** PHP, PDO and MySQL (from Milestone 2), FlightPHP for the REST API (from Milestone 3)
- **Authentication (from Milestone 4):** JWT
- **API documentation:** OpenAPI (Swagger)
- **Local server:** XAMPP

## Project structure

```
paw-friends/
├── AGENTS.md          rules for AI coding assistants
├── docs/
│   ├── AI_LOG.md      how AI was used in each milestone
│   └── ERD.md         the database design (Entity-Relationship Diagram)
├── backend/
│   ├── database/      pawfriends.sql: the tables and the sample data
│   ├── config/        config.example.php, the template for config.php
│   ├── dao/           Database.php (the connection), BaseDao.php and one DAO per table
│   ├── routes/        (from Milestone 3)
│   ├── services/      (from Milestone 3)
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

**Requirements:** XAMPP (Apache and MySQL) and an internet connection (Bootstrap, jQuery and Leaflet load from a CDN, and the map loads from OpenStreetMap).

1. Clone the repository into XAMPP's `htdocs` folder:
   - macOS: `/Applications/XAMPP/xamppfiles/htdocs`
   - Windows: `C:\xampp\htdocs`

   ```bash
   git clone https://github.com/aminaselimovic1/paw-friends.git
   ```
2. Start **Apache** and **MySQL** in the XAMPP Control Panel.
3. **Import the database:** open phpMyAdmin (<http://localhost/phpmyadmin>), go to the **Import** tab, choose `backend/database/pawfriends.sql` and click **Import**. The file creates the `paw_friends` database with its 6 tables and the sample data. Importing it again resets the data.
4. **Create the configuration file:** copy `backend/config/config.example.php` to `backend/config/config.php`:

   ```bash
   cp backend/config/config.example.php backend/config/config.php
   ```
   The values are XAMPP's defaults (user `root`, no password). Change them in `config.php` if your MySQL is set up differently. `config.php` is never committed, because it holds the real credentials.
5. **Optional: check the database connection.** Run the DAO test script from the project folder: `/Applications/XAMPP/bin/php backend/test-dao.php` (on Windows: `C:\xampp\php\php.exe backend\test-dao.php`). It prints shelters, pets and a user from the database, then adds, changes and deletes a test shelter.
6. Open the frontend in a browser: <http://localhost/paw-friends/frontend/>

The app must be opened through Apache (`http://localhost/...`), not by double-clicking `index.html`. The router loads each view with an AJAX request, and browsers block those requests for files opened from disk.

## Trying the Milestone 1 demo

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

- [docs/ERD.md](docs/ERD.md): the Entity-Relationship Diagram with the 6 entities and their relationships
- [backend/database/pawfriends.sql](backend/database/pawfriends.sql): the database tables and the sample data
- [AGENTS.md](AGENTS.md): project rules and conventions, also used by AI coding assistants
- [docs/AI_LOG.md](docs/AI_LOG.md): how AI was used in each milestone

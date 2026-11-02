# AI Log

## Milestone 1

### Tools and tasks
- Claude Code (VS Code extension, agent mode, model Claude Opus 5.5): proposed the database entities for my topic.
  Prompt: "PawFriends is a pet adoption and veterinary record system. Shelters list pets, users browse them and apply to adopt, and every pet has a health history (vet visits and vaccinations). There are three roles: admin (…), vet (…) and user (…). Pet detail pages show breed info (…) from TheDogAPI or TheCatAPI, depending on the species."
  It proposed 6 entities: users, shelters, pets, adoption_applications, vet_records and vaccinations. I kept all six.

- Claude Code (same setup): created the project folder structure and .gitignore.
  Prompt: "Backend folders: routes, services, dao, middleware, config, logs (excluded from Git). Frontend folders: css, js, views (HTML templates), static assets. + .gitignore"
  It created the folders with empty .gitkeep files (Git does not track empty folders) and a .gitignore for config.php, log files, backend/vendor/ and OS/editor files. I kept it as generated.

- Claude Code (same setup): drafted AGENTS.md from the lab template and created this AI log.
  Prompt: "Let's write AGENTS.md and AI_LOG.md following the rules from the attached document."
  I reviewed AGENTS.md, shortened one rule to "Keep code simple and readable." and kept the rest as generated.

- Claude Code (same setup): added CLAUDE.md, the Frontend, Backend and Reviewer custom agents and the update-ai-log skill, in Claude Code's format (.claude/agents/ and .claude/skills/) instead of the lab's Copilot format.
  Prompt: "Regarding this - Adding a one-line CLAUDE.md containing @AGENTS.md makes sure it does. - can you do this? Regarding the custom agents and the update-ai-log skill, do this as well using Claude Code's format."
  I kept all of them as generated, without changes.

- Claude Code (same setup): checked that AGENTS.md and the custom agents work, with the lab's two test prompts.
  Prompts: "Which layer is allowed to call DAO classes in this project?" and "@agent-backend Add a footer to frontend/index.html"
  It answered from AGENTS.md (only services call DAO classes), and the backend agent refused to edit a file outside backend/. No files were changed.

- Claude Code (same setup, frontend agent): built the home page of the static SPA.
  Prompt: "@agent-frontend Let's start with static SPA. We're going to have the following pages in /frontend/views: (…) For starters, create hero, stats, 3 featured pets, "How adoption works", and a call to action button on the home page. Bootstrap template to use as inspiration: https://bootstrapmade.com/demo/Medicio/, but use a more cream color and Nunito font family for the body. (…)"
  It created home.html and style.css with cream colours, the Nunito font and a terracotta accent, because Medicio's teal had too little contrast with white text. It also pointed out that my page list had shelters.html twice.
  I kept the terracotta accent, and renamed the admin pages in my list to manage-shelters.html, manage-users.html and manage-applications.html.

- Claude Code (same setup): built the SPA shell with the navbar and footer, and added Bootstrap Icons.
  Prompt: "add the Bootstrap icons now for the navbar and footer, matching my project's topic"
  I approved Bootstrap Icons, a new library (AGENTS.md says to ask first), and asked for it to be added to the Technology stack in AGENTS.md. It created index.html with the navbar, the footer and an empty `<main id="app">` for the views.
  I kept it as generated, except for one bug in the logo colour (see "Where the AI was wrong").

- Claude Code (same setup): built a demo role switcher for the navbar, frontend/js/roles.js.
  Prompt: "Start with the role switcher. I added the images so that step is done as well."
  I gave it the list of which role sees which page, and chose a demo "view as" switcher from the three options it offered. At my request, it also deleted the old root index.html.
  I kept it as generated.

- Claude Code (same setup): built the login and register views.
  Prompt: "Let's work on login and register. Register should have the following fields: Full name (2–100 characters, required), Email (type="email", required), Phone (optional, digits, spaces and +), Password (min 8) and confirm password (must match), both with a show/hide button, "I agree to the terms" checkbox (required). Login should have the following fields: Email (type="email", required) and Password (required) + show/hide button. There is no role field on register: every new account is a user."
  It created login.html, register.html and auth.js, with HTML validation styled by Bootstrap. Login picks a demo role from the email and register shows a success message, based on notes I pasted.
  I kept it as generated, and checked minlength by hand.

- Claude Code (same setup, reviewer agent): reviewed the whole project against AGENTS.md and the Milestone 1 scope.
  Prompt: "@agent-reviewer check everything up to this point and see if anything is missing."
  It found five small bugs, and listed what is still missing for M1 (14 views, ERD, README, commits and PR).
  I fixed 4 of the 5 bugs (see "Where the AI was wrong"), and decided not to fix the fifth (square eye-button corners).

- Claude Code (same setup): built the My applications page.
  Prompt: "Let's work on the My applications page. For our first functional version, implement these in order: 1. Page header and application count. 2. Application cards with pet photo, name, date, shelter, and status. 3. A View details action. 4. A status filter. 5. An empty state. 6. Optional withdrawal and status history, once the underlying logic exists."
  It built items 1–5 with sample data in my-applications.js. Item 6 waits for the backend, because withdrawal and status history need schema changes.
  I kept it as generated.

- Claude Code (same setup, frontend agent): built the Pets page.
  Prompt: "@agent-frontend Implement a complete, polished Pets page that allows visitors to browse available pets and view their details. Create an attractive, responsive Pets page with the following sections. A. Page header (…) B. Search and filters (…) Search and filters should work together. Include a way to clear/reset all filters. Show a helpful message when no pets match the selected filters. Do not show adopted pets as available for adoption. C. Pet listings (…)"
  It created pets.html and pets.js with 12 sample pets, a search by name, four filters that work together, a Clear filters button and an empty state.
  I removed the header it built, because Home and About already have a hero, and asked for pagination with 6 pets per page. I kept the rest as generated.

- Claude Code (same setup): built the pet details page.
  Prompt: "Let's build pet-details next. Include, where available: Larger pet image. Name, species, breed, age, and gender. (…) Do not display fields that have no data, and do not fabricate medical records or claim that a pet is vaccinated unless the sample data explicitly says so. E. Adoption action and roles (…) Vets should be able to add relevant data, and admins should be able to edit the pets' details. Do not add new authentication logic or change the existing role system. (…)"
  Before building, it asked me three questions, and I chose sample health records, the vet and admin forms in modals, and a spot for the breed info. It created pet-details.html and pet-details.js, where vets add vet records and vaccinations and admins edit the pet.
  I kept it as generated.

- Claude Code (same setup): built the Shelters page.
  Prompt: "Let's work on the shelters page. The page should include: Search and filters: Search shelters by name or location, with optional filters for available animal types. Shelter cards: Display each shelter’s name, image or logo, location, short description, contact information, and a “View Details” button. Navigation: Provide a clear way to browse pets from a selected shelter. (…)"
  It created shelters.html and shelters.js with 4 sample shelters, a search, an "Available animals" filter and an empty state. "Browse pets" opens the Pets page filtered to that shelter.
  I kept it as generated.

- Claude Code (same setup): built the shelter details page with a map.
  Prompt: "Let's work on shelter-details first. For this page: Show the shelter’s full description, address, contact details, operating hours (if available), and pets available for adoption. Later on, we could also use the Google Maps API to display a map that shows the "exact location" of the shelter."
  It created shelter-details.html and shelter-details.js. It explained that Google Maps needs an API key with billing, and I chose "We can use OpenStreetMap with the Leaflet library". It added a Leaflet map with a pin and, at my request, added Leaflet to the Technology stack in AGENTS.md.
  I kept it as generated.

- Claude Code (same setup): built the vet dashboard.
  Prompt: "Let's work on the vet dashboard. It should include the following: Welcome header: “Welcome back, Dr. [Name]” with a short overview. Summary cards: Total assigned pets, health records updated, upcoming appointments (only if appointments are implemented), and pets needing follow-up. (…) Notifications or follow-ups: Highlight pets requiring another visit or vaccination when that information exists."
  It created vet-dashboard.html and vet-dashboard.js with summary cards, follow-ups from the vaccinations' next due dates, a pet records table and recent activity. It left out the appointments card, because the project has no appointments.
  I kept it as generated, except that the "Add" buttons later had to stay on the dashboard (see the bug fixes below).

- Claude Code (same setup): built the admin dashboard and the manage pages.
  Prompt: "Let's just create pages for everything we are missing and I will later do a big manual testing session where I will report any bugs that I find. Let's move onto the admin dashboard; you can add whatever makes sense here, but since the home page steps say that "our team reviews your applications", there should probably be and applications table."
  It created the admin dashboard and the manage applications, pets, shelters and users pages. Approving an application marks the pet as adopted, and records that other data points to can't be deleted.
  I kept it as generated.

- Claude Code (same setup): fixed the bugs from my manual testing.
  Prompt: "Here are some bugs / improvements that I've noticed." (with my bug report of 5 items)
  It fixed the bugs I reported, including emails like "a@a" being accepted (see "Where the AI was wrong"). At my request, the vet dashboard's "Add" buttons now open the forms on the dashboard. Before testing, I had also asked for demo accounts on the login card: "for testing Login, add an email and password on the card (for now, will be removed later) so that we can check what a successful login with a correct email and password looks like."

- Claude Code (same setup): fixed the bugs from my second round of manual testing.
  Prompt: "I tested every page in all four roles. The site is in good shape for the first milestone, but I found a few more real bugs. First, please fix the high priority bugs: 1. Three pages crash if a pet goes missing. (…) 2. Pages aren’t protected by role. (…)"
  Pages now show "Unknown pet" instead of crashing, and each role can open only its own pages. Claude Code found the same "button only hidden" problem in 4 more places, and I asked it to fix them too: "Fix the problems that you've found a well". It also asked before doing my two suggestions, and I accepted both.
  I kept it as generated.

- Claude Code (same setup): fixed the medium-priority bugs from my manual testing.
  Prompt: "next, let's work on the following medium priority issues I found: 1. Fields that contain only spaces pass validation everywhere. (…) 2. A pet’s status doesn’t match its applications. (…) 3. The Profile page always shows Lejla Kovač, whether you’re Guest, Vet or Admin, while the dashboards greet Emina or Selma. (…) 4. Phone validation is too loose. (…)"
  It fixed all four (see "Where the AI was wrong"). Claude Code asked what "Pending" should mean, and I chose that others can still apply to a pending pet. After my re-test, it removed the status dropdown in Manage pets, which I rejected: "No, I want the admin to be able to change the status." Now the dropdown stays and warns when the status doesn't match the pet's applications.
  I kept the rest as generated.

### Where the AI was wrong
- The PawFriends logo in the navbar turned black after a click (SPA shell).
  What was wrong: the CSS set the logo's terracotta colour only for its normal and hover states. After a click, the link keeps focus, and Bootstrap's `.navbar-brand:focus` rule (which is more specific than `.site-brand`) coloured it black.
  How I noticed: I clicked PawFriends in the navbar, and its text and icon turned black.
  How I fixed it: I reported it to Claude Code. It found the Bootstrap rule and added `.site-brand:focus` to the logo's colour rule in style.css. It then checked that the focused logo stays terracotta.

- Headings with a Bootstrap size class weren't bold (home view and footer).
  What was wrong: the heading rule in style.css (h1–h6: bold and brown) was weaker than Bootstrap's .h5 and .h6 classes, because a class beats a tag name. So `<h3 class="h5">` (pet card and step titles) and `<h2 class="h6">` (footer titles) had weight 500, and the card titles were grey instead of brown.
  How it was noticed: Claude Code noticed it in a screenshot while testing the router and confirmed it by measuring the styles in the browser.
  How it was fixed: I asked Claude Code to fix it ("Fix the headings first"). It added .h1–.h6 to the heading rule, and the measured styles were bold and brown afterwards.

- The home page said the wrong role approves adoption applications.
  What was wrong: step 3 of "How adoption works" (home.html, written by the frontend agent) said "The shelter team reviews your application and approves or rejects it". In PawFriends the admin approves or rejects applications (AGENTS.md), and there is no shelter-staff role.
  How it was noticed: the reviewer agent found it when I asked it to check the whole project.
  How I fixed it: I rewrote the step myself: "Our team reviews it" and "We will review your application and approve or reject it."

- The footer's social media links jumped to the home page.
  What was wrong: in the SPA shell, Claude Code used href="#" as a placeholder for the Facebook and Instagram links. With our hash router, "#" empties the hash, which the router treats as the home page, so clicking an icon on any page opened Home.
  How it was noticed: the reviewer agent found it when I asked it to check the whole project.
  How I fixed it: I changed the links myself to https://facebook.com and https://instagram.com and added target="_blank", so they open in a new tab.

- The phone menu stayed open when tapping the link of the current page.
  What was wrong: Claude Code's router closed the phone menu only when the hash changed. Tapping the link of the page you are already on (or Log out or the logo while on Home) doesn't change the hash, so the open menu stayed over the page.
  How it was noticed: the reviewer agent found it when I asked it to check the whole project.
  How I fixed it: I added a click handler in router.js that closes the open menu below 992px. Claude Code tested my fix and found that it missed dropdown items, Log out and the logo. I widened the selector to `#mainNav a, .navbar-brand`, and the test then passed for all of them.

- Role-specific navbar links flashed on first load.
  What was wrong: in Claude Code's role switcher, every role item was visible in the HTML until roles.js ran (after jQuery and Bootstrap had downloaded), so for a moment the links of every role were shown.
  How it was noticed: the reviewer agent found it when I asked it to check the whole project.
  How I fixed it: I first hid the items with a CSS rule (`[data-roles] { visibility: hidden; }`) and showed them again in roles.js. Claude Code's test showed that role-specific elements inside views loaded later would then stay invisible. I removed that, and asked Claude Code to start every role item with class="d-none" in index.html and to call showLinksFor(getRole()) in router.js after each view is loaded. Claude Code tested it: each role sees only its own links, no role item is visible before the scripts run, and role-specific elements inside views are shown only to their role.

- The Edit pet details form let the birth date be left empty (pet details).
  What was wrong: Claude Code made the birth date optional in the admin's edit form. The Pets page calculates each pet's age and age group from the birth date, so after clearing it, the Pets list showed "NaN years".
  How it was noticed: Claude Code's own test in headless Chrome, before handing the page over.
  How it was fixed: Claude Code made the birth date required in the form and removed the code that hid Age and Born on the details page.

- The vet dashboard was wider than a phone screen (vet dashboard).
  What was wrong: at phone width (390px) the page was 466px wide and scrolled sideways. The hidden "Actions" header in the pet table uses Bootstrap's visually-hidden class (position: absolute), so it wasn't kept inside the table's scrolling box.
  How it was noticed: Claude Code's own width check at 390px, before handing the page over.
  How it was fixed: Claude Code added position-relative to the table's box.

- Email fields accepted "a@a" (login, register, contact and the other forms).
  What was wrong: the forms relied only on type="email", which accepts addresses without a dot.
  How I noticed: during my manual testing.
  How it was fixed: I reported it, and Claude Code added a pattern to all six email fields that also requires a dot and an ending like .com, with a clearer error message.

- Pages crashed when a pet was missing (manage applications, admin dashboard, My applications, vet dashboard).
  What was wrong: Claude Code's code used findPetById(…).name without checking that the pet exists, so the pages threw a TypeError and showed empty tables. The pet could go missing because the delete check only hid the Delete button (d-none): its click handler didn't check again, so a script could still delete a pet with applications.
  How I noticed: during my manual testing, after I removed Rocky with a script. Claude Code's first fix missed the vet dashboard, and I found it in my next round.
  How it was fixed: I reported it. Claude Code made the pages show "Unknown pet" and made the delete check again in its click handler. It found the same "only hidden" problem in the shelter and user deletes, Approve/Reject and the admin's own role, and fixed those at my request. Then it checked every lookup in the frontend for the same crash.

- Fields made only of spaces passed validation (all forms).
  What was wrong: Claude Code's forms relied on required and minlength, which check the value before it is trimmed. Names, subjects, messages, breeds, addresses and vaccine names of only spaces were accepted, and register accepted a password of eight spaces. Add pet then saved a pet with an empty name ("was added.").
  How I noticed: during my manual testing.
  How it was fixed: I reported it. Claude Code added a check of the trimmed value to every form with text fields (with setCustomValidity), Profile now trims the values it saves, and a new password can't be only spaces.

- A pet's status didn't match its applications (manage applications and the sample data).
  What was wrong: rejecting a pet's only pending application left it "Pending", and in Claude Code's sample data Luna and Rocky were "Available" although they had pending applications.
  How I noticed: during my manual testing (Mia stayed "Pending" after I rejected her only application).
  How it was fixed: I reported it. Claude Code made the pet available again when its last pending application is rejected, and changed Luna and Rocky to "Pending".

- The phone pattern accepted "+", "++++" and "+++ " (register, Profile and the shelter form).
  What was wrong: the pattern [0-9+ ]+ allows digits, + and spaces in any order. It followed my register spec ("digits, spaces and +") word for word, but Claude Code didn't point out that this doesn't describe a phone number.
  How I noticed: during my manual testing.
  How it was fixed: I reported it, and Claude Code changed the pattern to 6–15 digits with + only at the start.

- Profile always showed Lejla Kovač (Profile page).
  What was wrong: Claude Code gave Profile its own copy of one account, so every role saw Lejla, and renaming her in Manage users didn't change her profile.
  How I noticed: during my manual testing.
  How it was fixed: I reported it, and Claude Code made Profile read the current role's account from the shared list of users.

## Milestone 2

### Tools and tasks
- Claude Code (VS Code extension, agent mode, model Claude Opus 5.5): wrote the database schema, backend/database/pawfriends.sql.
  Prompt: "here is the document you've asked for. keep the 6 tables for now. and add .sql to the file path you suggested." (with the course reading on the DAO layer)
  It created the database paw_friends with the 6 tables from the ERD, their primary and foreign keys, and column lengths taken from the forms' maxlength. The foreign keys use ON DELETE RESTRICT, so a row that other rows point to can't be deleted, the same rule the admin pages show. It tested the file in a temporary database.
  I kept it as generated, and decided not to add users.created_at, because it isn't in the ERD. Later I made the application message optional, because the sample data has an application without one.

- Claude Code (same setup, reviewer agent): reviewed all of Milestone 2 before the pull request.
  Prompt: "@agents-reviewer Check everything for Milestone 2 and see if there are any issues."
  It confirmed that every Milestone 2 requirement is met and found no serious problems, but reported one bug in BaseDao and six smaller issues.
  I fixed five of them myself: the BaseDao bug (see "Where the AI was wrong"), outdated Milestone 1 wording and missing steps in the README's run instructions, a link from the README's entities to the ERD, and a check that stops test-dao.php from running in a browser. I left the other two as they were.

### Where the AI was wrong
- The draft ERD showed five optional fields as required (ERD, found while writing the database schema).
  What was wrong: in the Milestone 1 ERD, written with Claude Code, shelters.description, shelters.latitude, shelters.longitude, pets.description and vet_records.diagnosis had no "optional" mark, although their form fields are not required (the shelter form even labels latitude and longitude "(optional)"). As NOT NULL columns, they would have made those forms fail to save once they are connected to the backend.
  How it was noticed: Claude Code noticed it while writing the database schema, by comparing every column with the forms' required and maxlength attributes.
  How it was fixed: Claude Code made the five columns optional in pawfriends.sql, and at my request ("This needs to be fixed") also marked them as optional in the ERD.

- The schema made the application message required, although the sample data has an application without one (database schema).
  What was wrong: Claude Code made adoption_applications.message required (NOT NULL), as in the ERD, after comparing the columns with the forms. But there is no apply form yet, and the Milestone 1 sample data has an application without a message, which the admin's review page shows as "No message." I had already imported the schema in phpMyAdmin.
  How it was noticed: Claude Code noticed it in the next step, while turning the sample data into INSERT statements, because that application would have failed to import.
  How it was fixed: I chose to make the message optional, and Claude Code changed it in pawfriends.sql and the ERD.

- BaseDao's update() failed when the data contained an id (DAO layer).
  What was wrong: Claude Code took update() from the course reading. When the data included an id, for example a whole row loaded with getById(), the query used the :id placeholder twice, which real prepared statements don't allow, so update() threw a PDOException (HY093). Claude Code's own tests never passed an id, so they didn't catch it.
  How it was noticed: the reviewer agent found it when I asked it to check all of Milestone 2, and Claude Code reproduced the error.
  How I fixed it: I added unset($data['id']) at the start of update(), so the id is only used in the WHERE part. Claude Code then tested that a whole row can be updated.

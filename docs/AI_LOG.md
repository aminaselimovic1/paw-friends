# AI Log

## Milestone 1

### Tools and tasks
- Claude Code (VS Code extension, agent mode, model Claude Opus 5.5): read the Project Requirements document and summarized the requirements, milestones and deadlines.
  Prompt: "I will send you a document that will be your guide on this project. We will start with Milestone 1; I don't want you to do everything at once, we will go part by part (…). First, read the document and tell me that you understand everything."
  No files were changed.

- Claude Code (same setup): proposed the database entities for my topic.
  Prompt: "PawFriends is a pet adoption and veterinary record system. Shelters list pets, users browse them and apply to adopt, and every pet has a health history (vet visits and vaccinations). There are three roles: admin (…), vet (…) and user (…). Pet detail pages show breed info (…) from TheDogAPI or TheCatAPI, depending on the species."
  It proposed 6 entities: users, shelters, pets, adoption_applications, vet_records and vaccinations. I kept all six.

- Claude Code (same setup): created the project folder structure and .gitignore.
  Prompt: "Backend folders: routes, services, dao, middleware, config, logs (excluded from Git). Frontend folders: css, js, views (HTML templates), static assets. + .gitignore"
  It created the folders with empty .gitkeep files (Git does not track empty folders) and a .gitignore for config.php, log files, backend/vendor/ and OS/editor files, then tested the rules with `git check-ignore`. I kept it as generated and committed it.

- Claude Code (same setup): drafted AGENTS.md from the lab template and created this AI log.
  Prompt: "Let's write AGENTS.md and AI_LOG.md following the rules from the attached document."

- Claude Code (same setup): added CLAUDE.md, the Frontend, Backend and Reviewer custom agents and the update-ai-log skill, in Claude Code's format (.claude/agents/ and .claude/skills/) instead of the lab's Copilot format.
  Prompt: "Regarding this - Adding a one-line CLAUDE.md containing @AGENTS.md makes sure it does. - can you do this? Regarding the custom agents and the update-ai-log skill, do this as well using Claude Code's format."
  I kept all of them as generated, without changes.

- Claude Code (same setup): checked that AGENTS.md and the custom agents work, with the lab's two test prompts.
  Prompts: "Which layer is allowed to call DAO classes in this project?" and "@agent-backend Add a footer to frontend/index.html"
  It answered from AGENTS.md (only services call DAO classes), and the backend agent refused to edit a file outside backend/. No files were changed.

- Claude Code (same setup, frontend agent): built the home page of the static SPA.
  Prompt: "@agent-frontend Let's start with static SPA. We're going to have the following pages in /frontend/views: (…) For starters, create hero, stats, 3 featured pets, "How adoption works", and a call to action button on the home page. Bootstrap template to use as inspiration: https://bootstrapmade.com/demo/Medicio/, but use a more cream color and Nunito font family for the body. (…)"
  It created frontend/views/home.html and frontend/css/style.css, with cream colours, the Nunito font and a terracotta accent (Medicio's teal had too little contrast with white text). It also pointed out that my page list had shelters.html twice.
  I kept the terracotta accent, and renamed the admin pages in my list to manage-shelters.html, manage-users.html and manage-applications.html.

- Claude Code (same setup): built the SPA shell with the navbar and footer, and added Bootstrap Icons.
  Prompt: "add the Bootstrap icons now for the navbar and footer, matching my project's topic"
  I approved Bootstrap Icons, a new library (AGENTS.md says to ask first). It created frontend/index.html, which loads Bootstrap, Bootstrap Icons and style.css (the CDN files with integrity hashes) and has the navbar, the footer and an empty <main id="app"> for the views. At my request, it also added Bootstrap Icons to the Technology stack in AGENTS.md.
  I kept it as generated, except for one bug in the logo colour (see "Where the AI was wrong").

- Claude Code (same setup): built the SPA router, frontend/js/router.js.
  Prompt: "let's continue with the router and then I will commit the changes, give me a message I can add."
  It's a hash router with jQuery: #pets loads views/pets.html into <main id="app">. Only the pages in its list can load, and anything else shows the new views/not-found.html. It also highlights the current navbar link. Later I asked it to "make the router accept an id", so #pet-details?id=2 works: getHashParam("id") returns "2".
  I kept it as generated.

- Claude Code (same setup): built a demo role switcher for the navbar, frontend/js/roles.js.
  Prompt: "Start with the role switcher. I added the images so that step is done as well."
  Before that, I gave it the list of which role sees which page, and it offered three ways to show role links before there is a login. I chose a demo "view as" switcher. Navbar items have a data-roles attribute, showLinksFor(role) shows only the allowed ones, and the role is kept in localStorage. At my request, it also deleted the old root index.html.
  I kept it as generated.

- Claude Code (same setup): built the login and register views.
  Prompt: "Let's work on login and register. Register should have the following fields: Full name (2–100 characters, required), Email (type="email", required), Phone (optional, digits, spaces and +), Password (min 8) and confirm password (must match), both with a show/hide button, "I agree to the terms" checkbox (required). Login should have the following fields: Email (type="email", required) and Password (required) + show/hide button. There is no role field on register: every new account is a user."
  It created frontend/views/login.html, frontend/views/register.html and frontend/js/auth.js. The validation uses HTML attributes with Bootstrap's styles, and setCustomValidity() checks that the passwords match. After a valid submit, login picks a demo role from the email and register shows a success message. That behaviour came from notes I pasted, adapted to our code.
  I kept it as generated, and checked minlength by hand.

- Claude Code (same setup, reviewer agent): reviewed the whole project against AGENTS.md and the Milestone 1 scope.
  Prompt: "@agent-reviewer check everything up to this point and see if anything is missing."
  It found five small bugs, and listed what is still missing for M1 (14 views, ERD, README, commits and PR).
  I fixed 4 of the 5 bugs (see "Where the AI was wrong"), and decided not to fix the fifth (square eye-button corners).

- Claude Code (same setup): built the My applications page.
  Prompt: "Let's work on the My applications page. For our first functional version, implement these in order: 1. Page header and application count. 2. Application cards with pet photo, name, date, shelter, and status. 3. A View details action. 4. A status filter. 5. An empty state. 6. Optional withdrawal and status history, once the underlying logic exists."
  It built items 1–5 with sample data in frontend/js/my-applications.js (same field names as the database) and a card <template> in the view, filled in with .text() so the data is never run as HTML. The router now fires a viewLoaded event after each view, so page scripts know when to draw. Item 6 waits for the backend, because withdrawal and status history need schema changes.
  I kept it as generated.

- Claude Code (same setup, frontend agent): built the Pets page.
  Prompt: "@agent-frontend Implement a complete, polished Pets page that allows visitors to browse available pets and view their details. Create an attractive, responsive Pets page with the following sections. A. Page header (…) B. Search and filters (…) Search and filters should work together. Include a way to clear/reset all filters. Show a helpful message when no pets match the selected filters. Do not show adopted pets as available for adoption. C. Pet listings (…)"
  It created frontend/views/pets.html and frontend/js/pets.js with 12 sample pets (the same fields as the pets table, with Max, Luna and Rocky as ids 1–3), a search by name and four filters that work together, a Clear filters button and an empty state. Adopted pets are hidden at first and get a grey "Adopted" badge.
  I removed the header it built, because Home and About already have a hero, and asked for pagination: "Let's get rid of the Header section on the Pets page completely, we already have the home page with the hero image and the about page with the hero image. Let's also add pagination - we will display 6 items per page." Claude Code did both, and the section title became the page's h1. I kept the rest as generated.

- Claude Code (same setup): built the pet details page.
  Prompt: "Let's build pet-details next. Include, where available: Larger pet image. Name, species, breed, age, and gender. (…) Do not display fields that have no data, and do not fabricate medical records or claim that a pet is vaccinated unless the sample data explicitly says so. E. Adoption action and roles (…) Vets should be able to add relevant data, and admins should be able to edit the pets' details. Do not add new authentication logic or change the existing role system. (…)"
  Before building, it asked me three questions. I chose sample vet records and vaccinations, the vet and admin forms in modals, a spot for the breed info, and fixing Home's "View details" links. It created frontend/views/pet-details.html and frontend/js/pet-details.js. The page finds the pet from the link (#pet-details?id=2) and hides fields and sections that have no data. Guests get a login link and users an "Apply to adopt" button, which only explains that nothing is sent yet. Vets can add vet records and vaccinations, and admins can edit the pet, in Bootstrap modals that save to the sample data until a reload.
  I kept it as generated.

- Claude Code (same setup): built the Shelters page.
  Prompt: "Let's work on the shelters page. The page should include: Search and filters: Search shelters by name or location, with optional filters for available animal types. Shelter cards: Display each shelter’s name, image or logo, location, short description, contact information, and a “View Details” button. Navigation: Provide a clear way to browse pets from a selected shelter. (…)"
  It created frontend/views/shelters.html and frontend/js/shelters.js with 4 sample shelters, a search by name or location, an "Available animals" filter, the shelter's initials as its logo, and an empty state. "Browse pets" opens the Pets page with a new Shelter filter set to that shelter (#pets?shelter=2). It moved 5 sample pets to the 2 new shelters so the animal filter has something to filter, and noted shelters.description as a schema decision for M2.
  I kept it as generated.

- Claude Code (same setup): built the shelter details page with a map.
  Prompt: "Let's work on shelter-details first. For this page: Show the shelter’s full description, address, contact details, operating hours (if available), and pets available for adoption. Later on, we could also use the Google Maps API to display a map that shows the "exact location" of the shelter."
  It created frontend/views/shelter-details.html and frontend/js/shelter-details.js: the full description (the Shelters cards now cut it to 3 lines), contact details, opening hours (hidden when a shelter has none) and the available pets, using the Pets page's card function. It explained that Google Maps needs an API key with billing, and I chose "We can use OpenStreetMap with the Leaflet library". It added Leaflet 1.9.4 with checked integrity hashes, coordinates for the sample shelters, and a map with a pin. Opening hours and coordinates are new sample fields, noted for M2. At my request, it also added Leaflet to the Technology stack in AGENTS.md.
  I kept it as generated.

- Claude Code (same setup): built the vet dashboard.
  Prompt: "Let's work on the vet dashboard. It should include the following: Welcome header: “Welcome back, Dr. [Name]” with a short overview. Summary cards: Total assigned pets, health records updated, upcoming appointments (only if appointments are implemented), and pets needing follow-up. (…) Notifications or follow-ups: Highlight pets requiring another visit or vaccination when that information exists."
  It created frontend/views/vet-dashboard.html and frontend/js/vet-dashboard.js with a welcome header, summary cards, follow-ups from the vaccinations' next due dates, a searchable pet records table, recent activity and quick actions. It left out the appointments card because the project has no appointments, and worked out "your patients" from the vet's own records because there is no assigned vet. It also added 8 sample health records.
  I kept it as generated, except that the "Add" buttons later had to stay on the dashboard (see the bug fixes below).

- Claude Code (same setup): built the admin dashboard and the manage pages.
  Prompt: "Let's just create pages for everything we are missing and I will later do a big manual testing session where I will report any bugs that I find. Let's move onto the admin dashboard; you can add whatever makes sense here, but since the home page steps say that "our team reviews your applications", there should probably be and applications table."
  It created the admin dashboard and the manage applications, pets, shelters and users pages. Applications are reviewed in a modal: approving marks the pet as adopted and rejects the other pending applications for it. Pets, shelters and users can be added, edited and deleted, but not deleted when other records point to them. All applications are now in one list, so My applications shows the admin's decisions. Lejla's application for Max became "rejected" to match Max still being available.
  I kept it as generated.

- Claude Code (same setup): fixed the bugs from my manual testing.
  Prompt: "Here are some bugs / improvements that I've noticed." (with my bug report of 5 items)
  It fixed the footer icons, the underline on the Facebook icon, emails like "a@a" being accepted, and the dashboard numbers at different heights (see "Where the AI was wrong"). On my request, the vet dashboard's "Add" buttons now open the forms on the dashboard instead of going to the pet's page. Before testing, I had also asked for demo accounts on the login card: "for testing Login, add an email and password on the card (for now, will be removed later) so that we can check what a successful login with a correct email and password looks like." It shows one account per role, and the password is still not checked.

- Claude Code (same setup): fixed the bugs from my second round of manual testing.
  Prompt: "I tested every page in all four roles. The site is in good shape for the first milestone, but I found a few more real bugs. First, please fix the high priority bugs: 1. Three pages crash if a pet goes missing. (…) 2. Pages aren’t protected by role. (…)"
  Pages now show "Unknown pet" instead of crashing, and router.js has a list of which roles may open each page. Guests are sent to the login page and logged-in users to Home. Claude Code found the same "button only hidden" problem in 4 more places and a missing "Photo coming soon" box on My applications, and I asked it to fix them too: "Fix the problems that you've found a well". After my next report ("New issue: the vet dashboard has the same crash. (…)"), it fixed the vet dashboard. It also asked before doing my two suggestions, and I accepted both: "Unknown pet" is now plain text, and logging in goes back to the page you asked for (#login?next=…).
  I kept it as generated.

- Claude Code (same setup): fixed the medium-priority bugs from my manual testing.
  Prompt: "next, let's work on the following medium priority issues I found: 1. Fields that contain only spaces pass validation everywhere. (…) 2. A pet’s status doesn’t match its applications. (…) 3. The Profile page always shows Lejla Kovač, whether you’re Guest, Vet or Admin, while the dashboards greet Emina or Selma. (…) 4. Phone validation is too loose. (…)"
  All forms now check the trimmed value, so a field of only spaces counts as empty (passwords aren't trimmed, but can't be only spaces), and a phone number needs 6–15 digits. Rejecting a pet's last pending application makes it available again, and Profile shows the account of the current role from the same list as Manage users. Claude Code asked what "Pending" should mean, and I chose that others can still apply to a pending pet. After my re-test ("Still open: the status dropdown in Manage pets → Edit accepts any value, so an admin can break the match by hand. (…)"), it first removed the status dropdown, which I rejected: "No, I want the admin to be able to change the status." Now the dropdown stays and shows a warning when the status doesn't match the pet's applications.
  I kept the rest as generated.

### Where the AI was wrong
- The PawFriends logo in the navbar turned black after a click (SPA shell).
  What was wrong: the CSS set the logo's terracotta colour only for its normal and hover states. After a click, the link keeps focus, and Bootstrap's `.navbar-brand:focus` rule (which is more specific than `.site-brand`) coloured it black.
  How I noticed: I clicked PawFriends in the navbar, and its text and icon turned black.
  How I fixed it: I reported it to Claude Code. It found the Bootstrap rule and added `.site-brand:focus` to the logo's colour rule in style.css. It then checked that the focused logo stays terracotta.

- Headings with a Bootstrap size class weren't bold (home view and footer).
  What was wrong: the heading rule in style.css (h1–h6: bold and brown) was weaker than Bootstrap's .h5 and .h6 classes, because a class beats a tag name. So <h3 class="h5"> (pet card and step titles) and <h2 class="h6"> (footer titles) had weight 500, and the card titles were grey instead of brown.
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

- The empty state on My applications touched the page header.
  What was wrong: in Claude Code's first version, the empty-state box had no top margin. When no card matches the filter, the empty card row (Bootstrap's `row g-4`) keeps its negative top margin of −24px, which pulled the box up against the header.
  How it was noticed: Claude Code saw it in a screenshot of the "Rejected" filter, before handing the page over.
  How it was fixed: Claude Code added `mt-4` to the empty state and measured a 24px gap afterwards, the same as above the cards.

- The Edit pet details form let the birth date be left empty (pet details).
  What was wrong: Claude Code made the birth date optional in the admin's edit form. The Pets page calculates each pet's age and age group from the birth date, so after clearing it, the Pets list showed "NaN years".
  How it was noticed: Claude Code's own test in headless Chrome, before handing the page over.
  How it was fixed: Claude Code made the birth date required in the form and removed the code that hid Age and Born on the details page.

- The heading icons on pet details used a CSS class that doesn't exist.
  What was wrong: Claude Code gave the "Vaccinations" and "Vet visits" heading icons the class `text-accent`, which exists neither in Bootstrap nor in style.css, so the icons would not have been terracotta.
  How it was noticed: Claude Code noticed it right after writing the view, and a search confirmed that the class isn't defined anywhere.
  How it was fixed: Claude Code removed the class and coloured the icons with a rule in style.css (`.detail-card h3 .bi`).

- The vet dashboard was wider than a phone screen (vet dashboard).
  What was wrong: at phone width (390px) the page was 466px wide and scrolled sideways. The hidden "Actions" header in the pet table uses Bootstrap's visually-hidden class (position: absolute), so it wasn't kept inside the table's scrolling box.
  How it was noticed: Claude Code's own width check at 390px, before handing the page over.
  How it was fixed: Claude Code added position-relative to the table's box.

- The footer's contact icons weren't aligned (SPA shell).
  What was wrong: the location pin icon Claude Code chose (bi-geo-alt) is narrower than the phone and envelope icons, so it looked indented.
  How I noticed: during my manual testing.
  How it was fixed: I reported it. Claude Code measured the icons, confirmed that the pin starts about 2px further right, and replaced it with the map icon (bi-map).

- The Facebook icon showed a "_" when hovered (SPA shell).
  What was wrong: the footer CSS underlines links on hover, and the space after the Facebook icon inside the link was underlined.
  How I noticed: during my manual testing.
  How it was fixed: I reported it, and Claude Code added a rule that removes the underline from the social icons.

- Email fields accepted "a@a" (login, register, contact and the other forms).
  What was wrong: the forms relied only on type="email", which accepts addresses without a dot.
  How I noticed: during my manual testing.
  How it was fixed: I reported it, and Claude Code added a pattern to all six email fields that also requires a dot and an ending like .com, with a clearer error message.

- The numbers in the dashboard summary cards weren't at the same height (vet and admin dashboards).
  What was wrong: the cards centred their content vertically, so in a card whose small text took two lines, the number moved up.
  How I noticed: during my manual testing of the vet dashboard; I asked for the admin dashboard to be checked too.
  How it was fixed: Claude Code aligned the content to the top of the cards (align-items-start) on both dashboards.

- Pages crashed when a pet was missing (manage applications, admin dashboard, My applications, vet dashboard).
  What was wrong: Claude Code's code used findPetById(…).name without checking that the pet exists, so the pages threw a TypeError and showed empty tables. The pet could go missing because the delete check only hid the Delete button (d-none): its click handler didn't check again, so a script could still delete a pet with applications.
  How I noticed: during my manual testing, after I removed Rocky with a script. Claude Code's first fix missed the vet dashboard, and I found it in my next round.
  How it was fixed: I reported it. Claude Code made the pages show "Unknown pet" and made the delete check again in its click handler. It found the same "only hidden" problem in the shelter and user deletes, Approve/Reject and the admin's own role, and fixed those at my request. Then it checked every lookup in the frontend for the same crash.

- A new CSS rule turned the Edit, Delete and Review buttons black (admin pages and vet dashboard).
  What was wrong: to make "Unknown pet" plain text, Claude Code first wrote `.text-link:not([href])`. The Edit, Delete, Review and Add record buttons also use .text-link and never have an href, so they lost their terracotta colour and underline.
  How it was noticed: Claude Code saw it in a screenshot of Manage applications, before handing the change over.
  How it was fixed: Claude Code limited the rule to links (`a.text-link:not([href])`) and checked the buttons' styles afterwards.

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

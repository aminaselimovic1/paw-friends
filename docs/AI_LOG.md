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

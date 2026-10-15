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

- Claude Code (same setup): tested that AGENTS.md and the custom agents work.
  Prompt 1: "Which layer is allowed to call DAO classes in this project?"
  It answered from the Backend rules in AGENTS.md: only services call DAO classes (route -> middleware -> service -> DAO -> database).
  Prompt 2: "@agent-backend Add a footer to frontend/index.html"
  The backend agent made no changes. It explained that it may only work in backend/ and that the frontend agent should do this task. No files were changed.

- Claude Code (same setup, frontend agent): started the static SPA with the home page.
  Prompt: "@agent-frontend Let's start with static SPA. We're going to have the following pages in /frontend/views: home.html, not-found.html, login.html, register.html, pets.html, pet-details.html, shelters.html, shelter-details.html, about.html, contact.html, my-applications.html, profile.html, vet-dashboard.html, admin-dashboard.html, manage-pets.html, shelters.html, users.html, applications.html. Later I'm going to tell you what each role sees. For starters, create hero, stats, 3 featured pets, "How adoption works", and a call to action button on the home page. Bootstrap template to use as inspiration: https://bootstrapmade.com/demo/Medicio/, but use a more cream color and Nunito font family for the body. Let me know if you need more information."
  The frontend agent can't open web pages, so Claude Code first read the Medicio template's CSS and passed its layout and styles to the agent. The agent created frontend/views/home.html (hero, stats, 3 featured pets with sample data, "How adoption works" and a call to action) and frontend/css/style.css (cream colours, the Nunito font and a terracotta accent). It used one hero image instead of Medicio's carousel to keep the code simple. It didn't use Medicio's teal, because white text on it has too little contrast (2.3:1). It also pointed out that my page list had shelters.html twice.
  I kept the terracotta accent and the bottom button's link to #pets. I renamed the admin pages in my list to manage-shelters.html, manage-users.html and manage-applications.html.

- Claude Code (same setup): built the SPA shell with the navbar and footer, and added Bootstrap Icons.
  Prompt: "2. frontend/index.html" and "5. add the Bootstrap icons now for the navbar and footer, matching my project's topic"
  I approved adding Bootstrap Icons, a new library (AGENTS.md says to ask first). Claude Code created frontend/index.html. It loads Bootstrap 5.3.3, Bootstrap Icons 1.11.3 (from a CDN, with integrity hashes) and style.css. It also has a navbar with the public links plus Log in and Register, an empty <main id="app"> for the router, and a footer with quick links, sample contact details and social icons. It added the navbar and footer styles to style.css. Bootstrap Icons has no paw, dog or cat icon, so it used heart and house icons, for example house-heart-fill for the logo. It checked the page with screenshots at desktop and phone width.
  I kept it as generated, except for one bug in the logo colour (see "Where the AI was wrong"). Afterwards I asked Claude Code to add Bootstrap Icons to the Technology stack in AGENTS.md.

- Claude Code (same setup): built the SPA router.
  Prompt: "let's continue with the router and then I will commit the changes, give me a message I can add."
  It created frontend/js/router.js, a hash router with jQuery. It loads views/<page>.html into <main id="app"> when the part after # changes. Only the 18 pages in its list can load, and a missing or unknown page shows the new frontend/views/not-found.html. It also highlights the current navbar link, scrolls to the top and closes the phone menu after a click. It added jQuery 3.7.1 to the shell, with an integrity hash. It tested the router in headless Chrome through XAMPP.
  I kept it as generated.

- Claude Code (same setup): built the demo role switcher for the navbar and deleted the old root index.html.
  Prompt 1: "What everyone should see: home.html, not-found.html, pets.html, pet-details.html (actions depend on the role), shelters.html, shelter-details.html, about.html, contact.html (…) What vet sees: vet-dashboard.html (…) Regarding the index.html that's outside of the frontend folder, you can delete it."
  Claude Code deleted the old Hello World index.html (git rm). It then asked how the navbar should show role links before there is a login, and offered three options. I chose the demo role switcher.
  Prompt 2: "Start with the role switcher. I added the images so that step is done as well."
  It added a "Demo: view as" bar above the navbar (Guest / User / Vet / Admin) and frontend/js/roles.js. Navbar items have a data-roles attribute, and showLinksFor(role) hides the ones the role may not see. The role is saved in localStorage, and Log out switches back to Guest. User links are in a "My account" dropdown and admin links in an "Admin" dropdown. It put the switcher above the navbar, not inside it, because the navbar would have been too wide at 992px. It also overrode Bootstrap's dropdown states in style.css (an open toggle would turn black and an active item blue), and made the router highlight dropdown items. It tested every role in headless Chrome.
  I kept it as generated.

- Claude Code (same setup): resized the pet and hero photos.
  Prompt: "Shrink copies with macOS's built-in sips (no new library). No need for the keyboard focus outline."
  I added the 4 photos myself. Claude Code pointed out that they were 12 MB in total (up to 7,400px wide), and offered to resize them. It backed up the originals to a folder on my Desktop, outside the project, then resized them with sips: the hero to 1,920px wide and the pets to 800px, at JPEG quality 80. Together they went from 12 MB to 532 KB. It checked the result in a screenshot. I turned down its other suggestion, a terracotta keyboard focus outline.
  I kept the resized photos.

- Claude Code (same setup): built the login and register views.
  Prompt: "Let's work on login and register. Register should have the following fields: Full name (2–100 characters, required), Email (type="email", required), Phone (optional, digits, spaces and +), Password (min 8) and confirm password (must match), both with a show/hide button, "I agree to the terms" checkbox (required). Login should have the following fields: Email (type="email", required) and Password (required) + show/hide button. There is no role field on register: every new account is a user."
  I also pasted notes on what should happen after a valid submit. They were written for spapp and a RoleSwitcher object we don't have, so Claude Code asked whether to use them. I said yes, adapted to our code.
  It created frontend/views/login.html, frontend/views/register.html and frontend/js/auth.js, and added form styles to style.css. The rules are HTML attributes (required, minlength, pattern, type="email") with Bootstrap's validation styles, and the password match is checked with setCustomValidity(). Login picks the demo role from the email (admin@example.com → admin, emina.vet@example.com → vet, others → user) and goes to #home. Register clears the form, hides revealed passwords again and shows a green "Account created!" message. It left out the notes' "hide the message on hashchange" step, because our router reloads the view on every navigation. It tested both forms in headless Chrome, except minlength, which browsers check only for real typing.
  I kept it as generated. I checked minlength by hand: a one-letter name and a short password both show an error.

- Claude Code (same setup, reviewer agent): reviewed the whole project against AGENTS.md and the Milestone 1 scope.
  Prompt: "@agent-reviewer check everything up to this point and see if anything is missing."
  It found five small bugs (home page says the shelter team approves applications instead of the admin, footer social links jump to Home, the phone menu stays open on the current page's link, role links flash on first load, square eye-button corners), two router limits to fix before pet-details (no ids, no role filter for loaded views), and what's missing for M1 (14 views, ERD, README, commits and PR). Claude Code checked its main findings before reporting them. It disagreed that the Phone field and the custom button classes break AGENTS.md.
  4 of the 5 bugs are fixed (see "Where the AI was wrong"): I fixed the first three myself, and the fourth together with Claude Code. I decided not to fix the fifth (the eye-button corners). Of the two router limits, views loaded by the router now get the role filter (part of the fourth fix). Passing an id to pet-details is still open.

- Claude Code (same setup): updated a comment in roles.js and made the router accept an id.
  Prompt: "Update that line as well. Then make the router accept an id. We won't work on pets and pet-details yet, I will first commit the changes that we have so give me a short commit message."
  It updated the comment above showLinksFor() in roles.js, because the function now also filters parts of views, not only navbar items. In router.js, getRouteFromHash() now ignores everything after "?", so "#pet-details?id=2" gives the route "pet-details". A new function, getHashParam(name), reads values after "?" with the browser's URLSearchParams: getHashParam("id") returns "2", or null if there is no id. It tested this in headless Chrome: ?id=2 and ?id=3 load pet-details with the right id, switching between them reloads the view, other pages still work, and "#../views/home" still shows not-found. It also gave me a short commit message. The "View details" links on Home don't pass an id yet; that's for the pets batch.
  I kept it as generated.

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

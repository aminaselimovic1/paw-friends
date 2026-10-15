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

### Where the AI was wrong
- The PawFriends logo in the navbar turned black after a click (SPA shell).
  What was wrong: the CSS set the logo's terracotta colour only for its normal and hover states. After a click, the link keeps focus, and Bootstrap's `.navbar-brand:focus` rule (which is more specific than `.site-brand`) coloured it black.
  How I noticed: I clicked PawFriends in the navbar, and its text and icon turned black.
  How I fixed it: I reported it to Claude Code. It found the Bootstrap rule and added `.site-brand:focus` to the logo's colour rule in style.css. It then checked that the focused logo stays terracotta.

- Headings with a Bootstrap size class weren't bold (home view and footer).
  What was wrong: the heading rule in style.css (h1–h6: bold and brown) was weaker than Bootstrap's .h5 and .h6 classes, because a class beats a tag name. So <h3 class="h5"> (pet card and step titles) and <h2 class="h6"> (footer titles) had weight 500, and the card titles were grey instead of brown.
  How it was noticed: Claude Code noticed it in a screenshot while testing the router and confirmed it by measuring the styles in the browser.
  How it was fixed: I asked Claude Code to fix it ("Fix the headings first"). It added .h1–.h6 to the heading rule, and the measured styles were bold and brown afterwards.

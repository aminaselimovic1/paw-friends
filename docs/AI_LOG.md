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

### Where the AI was wrong
_(No cases yet. At least 2 are required for this milestone. For each one, write what was wrong, how I noticed it and how I fixed it.)_

---
name: update-ai-log
description: Adds an entry to docs/AI_LOG.md about how AI was used. Use when the student asks to log AI use or finishes a task done with AI help.
---
# Update the AI log

1. Open docs/AI_LOG.md. If it does not exist, create it with the heading "# AI Log".
2. Find the section of the current milestone (the git branch tells you: milestone1 -> "## Milestone 1"). Create it if it is missing.
3. Find out which tool and model were used, what the task was and what the main prompt was.
   If the task was done in this conversation, take them from the conversation and quote the
   student's prompt exactly. Otherwise, ask the student.
4. Add an entry under "### Tools and tasks": tool, task, main prompt (quoted),
   what was generated, and what the student kept, changed or rejected.
5. Ask the student whether the AI was wrong in this task. If yes, add an entry under
   "### Where the AI was wrong": what was wrong, how they noticed it, how they fixed it.
6. Never invent prompts, tools or mistakes. If something is unclear, ask.
7. Show the new entry and wait for confirmation before saving.

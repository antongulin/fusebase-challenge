---
name: git-workflow
description: "General Git workflow for generated apps: safe local commits, clean history, and rollback guidance. Includes strict debug/deploy traceability section when git-debug-commits flag is enabled."
---

# Git Workflow

## Purpose

Use this skill for day-to-day Git work in generated apps:

- keep commits focused and understandable,
- avoid committing secrets,
- keep rollback simple.

## Baseline Workflow

1. Check current state:
   - `git status --short`
   - `git rev-parse --abbrev-ref HEAD`
2. Group related changes.
3. Commit with reason-focused message.
4. Keep unrelated changes in separate commits.

## Commit Rules

- Prefer small, scoped commits.
- Message should explain **why**.
- Do not commit `.env`, credentials, or token files.
- Avoid history rewrite unless explicitly requested.

Suggested message patterns:

- `feat: <why>`
- `fix: <why>`
- `chore: <why>`

## Rollback Guidance

Preferred shared-history rollback:

- `git revert <commit_sha>`

Temporary local rollback during active iteration:

- `git reset --hard <commit_sha_before_change>`

Use `revert` by default on shared branches.

## Operations That Commonly Need Separate Commits

- `fusebase feature create/update` (`fusebase.json` changes)
- `fusebase skills update` (`AGENTS.md`, `.claude/*` changes)
- `fusebase config ide` / `fusebase integrations` (IDE MCP config changes)
- `fusebase env create` (`.env` local changes; usually not committed)

Always review `git status --short` after these operations.


# Task 07 — Documentation Update

**Touches:** `README.md`, `CONTRIBUTING.md`
**Goal:** Bring both docs in sync with the current codebase — correct counts, full schema, accurate builder output.

---

This is **klist** — a Kubernetes checklist. The project has two documentation files at the root: `README.md` and `CONTRIBUTING.md`. Both are currently out of date and need to be brought in sync with the actual codebase state.

**Get accurate counts before editing:** Run `node builder/build.js` from the repo root. The builder prints item counts per category and config counts — use those numbers as the source of truth. Do not count YAML files manually.

**Context to verify before editing:**
- Items live in `items/cloud/`, `items/cluster/`, `items/container/`, `items/code/` — the builder output shows current totals.
- Configs live in `items/config/` — list all config IDs and their `type` field.
- The full item schema (read a few files like `CLUD-2.yaml`, `CLST-9.yaml`) includes fields not currently documented in `CONTRIBUTING.md`: `mitigations`, `tools`.
- The builder lives in `builder/build.js` — skim it to confirm current validation rules and output format.

---

## Your task

1. **README.md**
   - Update item counts in the features/overview section to match the real current totals per category (from builder output).
   - Update the config list if it references specific configs by name.
   - Ensure the project structure tree matches what actually exists in the repo.

2. **CONTRIBUTING.md**
   - Update the item schema example to show all supported fields (`id`, `title`, `description`, `mitigations`, `tags`, `tools`, `references`) with inline comments explaining each.
   - Update the builder success output example to reflect real current item/config/tag counts (from builder output).
   - Update the config type table to include all current `type` values and ensure the compliance row lists all current compliance configs (CIS, HIPAA, PCI-DSS, SOC 2, OWASP Kubernetes Top 10).
   - Fix any rules or instructions that no longer match the actual builder validation logic.

3. Do **not** change the project's voice or restructure sections — only update facts and examples that are stale.

---

## Validation (required before committing)

Run the following from the repo root before making any commit:

```sh
node builder/build.js
```

If the command exits with errors, fix the YAML issues and re-run. **Do not commit if the builder fails.**

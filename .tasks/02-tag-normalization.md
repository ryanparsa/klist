# Task 02 — Tag Normalization

**Touches:** `items/cloud/`, `items/cluster/`, `items/container/`, `items/code/`
**Goal:** Normalize tags across all item YAML files — consistent naming, no noise, no duplicates.

---

This repo is **klist** — a Kubernetes checklist. Checklist items live in `items/cloud/`, `items/cluster/`, `items/container/`, `items/code/` as YAML files. The `tags` field on each item drives the sidebar tag-filter in the UI.

**Constraint:** Only modify the `tags` field. Do not touch `id`, `title`, `description`, `mitigations`, `tools`, or `references`.

---

## Your task

Read every item YAML across all four categories and collect all tags. Then:

1. **Normalize** — rename tags that express the same concept inconsistently. Examples:
   - `rbac` vs `role-based-access` → use `rbac`
   - `secret` vs `secrets` → use `secrets`
   - `network-policy` vs `networkpolicy` → use `network-policy`
   Apply the normalized name to every item that used the old form.

2. **Enrich** — if an item is clearly missing a tag that describes its category or risk domain, add it. Only add tags that genuinely improve filterability.

3. **Remove noise** — delete tags that are:
   - Too broad to be useful as a filter (e.g. `security`, `kubernetes`, `best-practice`)
   - Appearing on only one item and adding no filtering value

4. After changes, every tag must be **lowercase** and **hyphen-separated** (no underscores, no spaces, no camelCase).

---

## Validation (required before committing)

Run the following from the repo root before making any commit:

```sh
node builder/build.js
```

If the command exits with errors, fix the YAML issues and re-run. **Do not commit if the builder fails.**

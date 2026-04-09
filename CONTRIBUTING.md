# Contributing to klist

Contributions are welcome — new checklist items, new configs, bug fixes, and UI improvements.

---

## Setup

```bash
git clone https://github.com/ryanparsa/klist.git
cd klist
npm install
```

After any change to `items/`, regenerate the JSON and verify it builds:

```bash
node builder/build.js
npm run dev
```

---

## Adding a checklist item

Items live in `items/{category}/` as individual YAML files. The category determines the 4C layer.

| Category | Directory | ID prefix | Example |
|---|---|---|---|
| Cloud | `items/cloud/` | `CLD` | `CLUD-11.yaml` |
| Cluster | `items/cluster/` | `CLT` | `CLST-14.yaml` |
| Container | `items/container/` | `CNT` | `CONT-10.yaml` |
| Code | `items/code/` | `CODE` | `CODE-008.yaml` |

**Steps:**

1. Find the highest existing ID in the target category and increment by one.
2. Create the file using the schema below.
3. Run `node builder/build.js` — it will catch any validation errors.
4. Open a pull request against `main`.

**Item schema:**

```yaml
id: CLUD-11
title: "Short, action-oriented label"
description: |
  Explain what the control is, why it matters, and how to remediate it.
  Include what to check and what the fix looks like.
mitigations: # Optional array of strings for remediation steps
  - "List of actionable steps or strategies to reduce the risk."
tags: [network, hardening]
tools: # Optional array of tools
  - title: "Tool Name"
    url: "https://..."
references:
  - title: "Human-readable source name"
    url: "https://..."
```

**Rules:**
- `id` must match the filename exactly (e.g. `CLUD-11.yaml` → `id: CLUD-11`).
- At least one `reference` is required.
- `description` should cover: what the risk is, how to verify it, and how to fix it.
- Reuse existing tags where possible — check `public/checklist.json` → `all_tags` for the current list.
- IDs are never reused or renumbered. Gaps are fine.
- `mitigations` must be an array of strings. `tools` must be an array of objects with `title` and `url`.

---

## Adding a config

Configs live in `items/config/` and control which items are activated and at what priority.

**Steps:**

1. Create `items/config/{id}.yaml`.
2. All item IDs listed in `required` and `suggested` must already exist.
3. Run `node builder/build.js` to validate.
4. Open a pull request.

**Config schema:**

```yaml
id: my-config
label: "Display Name"
type: baseline          # baseline | provider | architecture | compliance
description: "Shown as a tooltip in the sidebar."
items:
  required:
    - CLST-1
    - CONT-3
  suggested:
    - CLUD-5
```

**Type → sidebar order:**

| Type | When to use |
|---|---|
| `baseline` | Applies broadly to all or most clusters |
| `provider` | Specific to a cloud provider (EKS, GKE, AKS, self-managed) |
| `architecture` | Specific to a deployment pattern (HA, multi-cluster) |
| `compliance` | Maps to a regulatory framework (CIS, HIPAA, PCI-DSS, SOC 2, OWASP Kubernetes Top 10) |

**Rules:**
- `id` must match the filename exactly.
- Keep `required` for controls that are genuinely mandatory for this config.
- Use `suggested` for controls that are strongly recommended but not enforced.
- An item ID must not appear in both `required` and `suggested`.

---

## Running the builder

```bash
node builder/build.js
```

On success:

```
✔ 103 items loaded
    cloud        20
    cluster      46
    container    24
    code         13
✔ 13 configs loaded
✔ 114 unique tags extracted
✔ public/checklist.json written
```

On failure, errors are printed with the offending file and field. Fix all errors before opening a PR — the CI pipeline runs the builder and will fail on any validation error.

---

## Pull request guidelines

- One logical change per PR (a new item, a new config, a bug fix).
- Run `node builder/build.js && npm run build` locally before pushing.
- Write a clear PR description explaining what was added or changed and why.
- For new items, cite at least one authoritative source (CIS Benchmark, NSA/CISA guide, cloud provider docs, OWASP, etc.).

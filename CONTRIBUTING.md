# Contributing to klist

Contributions are welcome - new checklist items, new configs, bug fixes, and UI improvements.

---

## Setup

```bash
git clone https://github.com/ryanparsa/klist.git
cd klist/dashboard
npm install
npm run dev
```

Content lives in `practices/` as YAML files. [velite](https://velite.js.org/) processes them at build time - any change to a YAML file is picked up automatically by the dev server with no extra steps.

---

## Adding a checklist item

Items live in `practices/{category}/` as individual YAML files. The directory determines the 4C layer.

| Category | Directory | ID prefix | Example |
|---|---|---|---|
| Cloud | `practices/cloud/` | `CLUD` | `CLUD-11.yaml` |
| Cluster | `practices/cluster/` | `CLST` | `CLST-14.yaml` |
| Container | `practices/container/` | `CONT` | `CONT-10.yaml` |
| Code | `practices/code/` | `CODE` | `CODE-008.yaml` |

**Steps:**

1. Find the highest existing ID in the target category and increment by one.
2. Create the YAML file using the schema below.
3. Run `npm run dev` and confirm the item appears correctly in the dashboard.
4. Open a pull request against `main`.

**Item schema:**

```yaml
id: CLUD-11                        # Must match the filename exactly (e.g. CLUD-11.yaml)
title: "Short, action-oriented label"
stage: active                      # draft | active | deprecated
description: |
  Explain what the control is, why it matters, and how to remediate it.
  Include what to check and what the fix looks like.
  Supports Markdown, including fenced code blocks and mermaid diagrams.
mitigations:                       # Optional - array of actionable remediation steps
  - "Step or strategy to reduce the risk."
tags: [network, hardening]         # Reuse existing tags where possible
tools:                             # Optional - related tools
  - title: "Tool Name"
    url: "https://..."
references:                        # Required - at least one authoritative source
  - title: "Human-readable source name"
    url: "https://..."
```

**Rules:**
- `id` must match the filename exactly (`CLUD-11.yaml` → `id: CLUD-11`).
- `stage` is required and must be `draft`, `active`, or `deprecated`.
- At least one `reference` is required, each with `title` and `url`.
- `description` should cover: what the risk is, how to verify it, and how to fix it.
- Reuse existing tags - check the tag filter in the sidebar for the current list.
- IDs are never reused or renumbered. Gaps are fine.
- `mitigations` must be an array of strings. `tools` must be an array of `{ title, url }` objects.

---

## Adding a config

Configs live in `practices/config/` and control which items are activated and at what priority level.

**Steps:**

1. Create `practices/config/{id}.yaml`.
2. All item IDs listed under `required` and `suggested` must already exist.
3. Run the dev server and verify the config appears in the sidebar and filters correctly.
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

**Type → sidebar section:**

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

## Pull request guidelines

- One logical change per PR (a new item, a new config, a bug fix).
- Run `npm run build` locally before pushing to catch any schema or type errors.
- Write a clear PR description explaining what was added or changed and why.
- For new items, cite at least one authoritative source (CIS Benchmark, NSA/CISA guide, cloud provider docs, OWASP, etc.).

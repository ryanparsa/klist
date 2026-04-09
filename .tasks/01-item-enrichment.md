# Task 01 — Item Enrichment

**Touches:** `items/cloud/`, `items/cluster/`, `items/container/`, `items/code/`
**Goal:** Add concrete commands, remediation snippets, and diagrams to sparse item descriptions.

---

This repo is **klist** — a static Vite + React app that renders a Kubernetes operational checklist. Checklist items live in `items/cloud/`, `items/cluster/`, `items/container/`, `items/code/` as YAML files.

Each item follows this schema:
```yaml
id: CLUD-2
title: Restrict Network Access to API Server and Kubelet
description: |
  Prose explanation of the risk and what to check.
mitigations:
  - Step or action to remediate
tags:
  - network
tools:
  - title: kube-bench
    url: https://github.com/aquasecurity/kube-bench
references:
  - title: CIS Kubernetes Benchmark - API Server
    url: https://...
```

**Your task:** Go through every item YAML file and enrich the `description` and `mitigations` fields where they are thin. Specifically:

1. **Add concrete `kubectl` / CLI commands** in the `description` under "What to check:" so a reader can verify the control immediately. Use fenced code blocks inside the YAML literal block (`|`).
2. **Add remediation code snippets** to `mitigations` — e.g. a `SecurityContext` patch, a `NetworkPolicy` manifest, an RBAC role YAML, or a shell command — wherever the current text is prose-only.
3. **Add ASCII or Mermaid diagrams** (as fenced code blocks inside the description) for items where a flow or architecture helps — e.g. network segmentation (K05), cluster-to-cloud lateral movement (K08), or secret injection paths (K03). Note that you can use mermaid diagram and chart in markdown code.
4. Do **not** change `id`, `title`, `tags`, `tools`, or `references`. Only enrich `description` and `mitigations`.
5. Keep titles **provider-agnostic** — AWS/GCP/Azure specifics belong only in the description body.

Start with the items that have the shortest / most sparse descriptions and work outward.

---

## Skip criteria (do not re-enrich)

Skip any item that already meets **both** of these conditions:
- `description` is longer than 300 characters AND contains at least one fenced code block (` ``` ` or an indented `kubectl` / CLI command)
- `mitigations` has 2 or more entries that contain a code block or a YAML/shell snippet

Focus effort only on items that are still sparse by these criteria.

---

## Validation (required before committing)

Run the following from the repo root before making any commit:

```sh
node builder/build.js
```

If the command exits with errors, fix the YAML issues and re-run. **Do not commit if the builder fails.**

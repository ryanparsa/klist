# Task 03 — Config Coverage & Orphan Analysis

**Touches:** `items/config/` only
**Goal:** Fix config coverage gaps and ensure every item appears in at least one config.

---

This repo is **klist** — a Kubernetes checklist. Config files in `items/config/` define named profiles that promote items to `required` or `suggested` priority. The UI lets users select configs to filter and prioritize items.

**Config schema:**
```yaml
id: eks
label: "Amazon EKS"
type: provider          # one of: baseline | provider | architecture | compliance
description: "..."
items:
  required:
    - CLUD-1
  suggested:
    - CLST-3
```

**Current configs:** `baseline`, `eks`, `aks`, `gke`, `self-managed`, `production`, `ha`, `multi-cluster`, `hipaa`, `pci-dss`, `soc2`, `cis-benchmark`, `owasp-k8s-top10`.

**Constraint:** Only modify files in `items/config/`. Do not create new item YAML files.

---

## Task 1 — Config coverage gaps

Read every item YAML and every config YAML, then fix gaps:

1. **Coverage gaps** — if an item clearly applies to a config (e.g. a GKE-specific control missing from `gke.yaml`, or an HA-relevant item missing from `ha.yaml`) add it at the appropriate priority level.
2. **Baseline completeness** — `baseline.yaml` should include every item that applies to *any* Kubernetes cluster regardless of provider.
3. **Provider configs** (`eks`, `aks`, `gke`, `self-managed`) — each should cover all items whose description mentions that provider or that are only relevant to that deployment model.
4. **Architecture configs** (`ha`, `multi-cluster`) — ensure reliability, resilience, and topology-aware items are present.
5. **Compliance configs** (`hipaa`, `pci-dss`, `soc2`, `cis-benchmark`, `owasp-k8s-top10`) — cross-reference the standard's control objectives against item titles/tags and add missing mappings. Promote to `required` if the standard mandates it, `suggested` if it supports the control.
6. Do **not** add items to a config unless you can justify the mapping from the item's content.

---

## Task 2 — Orphan analysis

Build a matrix of all item IDs × all config IDs. Flag every item that does not appear in **any** config as orphaned.

For each orphaned item, determine which config(s) it logically belongs in and add it. If an item genuinely doesn't fit any existing config, note it as a candidate for a new config — leave a comment in the PR description listing those candidates (do not create new config files).

---

## Validation (required before committing)

Run the following from the repo root before making any commit:

```sh
node builder/build.js
```

If the command exits with errors, fix the YAML issues and re-run. **Do not commit if the builder fails.**

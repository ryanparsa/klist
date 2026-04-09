# Task: Comprehensive Checklist Consolidation

**Touches:** `items/cloud/`, `items/cluster/`, `items/container/`, `items/code/`, `items/config/`
**Goal:** Conduct a holistic pass over all checklist items to enrich content, normalize tags, ensure config coverage, and add missing items from external research.

---

This repo is **klist** — a static Vite + React app that renders a Kubernetes operational checklist. Checklist items live in `items/{category}/` as YAML files. Config files in `items/config/` define named profiles that promote items to `required` or `suggested` priority. 

The `tags` field drives the sidebar tag-filter in the UI.

## Phase 1: Tag Normalization & Cleanup
Read every item YAML across all four categories to normalize the `tags` field:
1. **Normalize**: Ensure consistent naming (e.g., use `rbac` instead of `role-based-access`, `secrets` instead of `secret`, `network-policy` instead of `networkpolicy`).
2. **Enrich**: Add tags that describe the category or risk domain, improving filterability.
3. **Remove noise**: Delete overly broad tags (like `security`, `kubernetes`, `best-practice`) or tags that only appear on one item.
4. **Format**: Every tag must be **lowercase** and **hyphen-separated** (no spaces, underscores, or camelCase).
*(Constraint: Do not touch `id` or other fields during this specific pass unless working on Phase 2).*

## Phase 2: Item Enrichment & Schema Standardization
Go through every item YAML file and enrich the `description` and `mitigations` fields where they are sparse.
1. **Concrete Commands**: Add `kubectl` or CLI commands under a "**What to check:**" heading within the `description` using fenced code blocks.
2. **Remediations**: Add concrete code snippets to `mitigations` (e.g., `SecurityContext` patch, `NetworkPolicy`, RBAC YAML, or shell commands).
3. **Diagrams**: Add ASCII or Mermaid diagrams where architecture or flow explanation helps (e.g., network segmentation, lateral movement). *You can use mermaid diagrams directly in markdown code blocks.*
4. **Provider-Agnostic Titles**: Keep item titles provider-agnostic. Move AWS/GCP/Azure specifics into the description body.
*(Skip criteria: Ignore items if the description is >300 chars AND has >=1 fenced code block, AND mitigations have >=2 entries with code blocks).*

## Phase 3: External Research & New Items
Review external references pre-fetched to `/tmp/refs/`:
- `threat-matrix-k8s/`, `owasp-k8s-top10/`, `owasp-k8s-cheatsheet.md`, `falco-rules/`, `kyverno-policies/`, `gatekeeper-library/`, `eks-best-practices/`, `learnk8s-best-practices/`

Identify gaps and risks not yet covered:
1. **Enrich Existing First**: If an existing item covers the risk, simply enrich its `description` and `mitigations` avoiding duplication.
2. **Create New Items**: If no existing item covers it, create a new YAML file.
   - **ID format**: Find the highest numeric suffix in that `items/{category}/` and use suffix + 1. (e.g., `CLUD-20` -> `CLUD-21`). Never reuse IDs.
   - **Fields**: Must follow the standard schema with `id`, `title`, `description` (with "What to check:"), `mitigations` (with snippets), `tags`, `tools`, and `references`.

## Phase 4: Config Coverage & Orphan Analysis
Fix config coverage gaps ensuring every item is mapped appropriately:
1. **Fix Gaps**: Add items to configs where they logically apply based on content (e.g., GKE-specific to `gke.yaml`, HA-relevant to `ha.yaml`).
2. **Baseline**: `baseline.yaml` should include all universally applicable checks.
3. **Architectures & Compliance**: Ensure maps for `multi-cluster`, `hipaa`, `pci-dss`, `cis-benchmark`, `owasp-k8s-top10`, etc.
4. **Orphan Analysis**: Build a matrix of all items against configs. Any item not in *any* config must be added to appropriate ones. Document candidates for missing configs.

---

## Validation (required before committing)
Run the following from the repo root before making any commit:
```sh
node builder/build.js
```
If the command exits with errors, fix the YAML issues and re-run. **Do not commit if the builder fails.**

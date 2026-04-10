# AI Agent Task: Configuration Coverage & Profile Integrity

## 1. Context & Objective
The `items/config/` directory defines implementation profiles (such as `eks.yaml`, `cis-benchmark.yaml`, `owasp-k8s-top10.yaml`). These aggregate scattered security rules into unified compliance blueprints. These blueprints contain `required` and `suggested` arrays mapping exactly to checklist item IDs. Your routine is to ensure these maps are perfectly synced with the actual project files.

## 2. Expected Input & Dependencies
You will require cross-reference logic mapping between the profile templates (`items/config/*.yaml`) against the live directories (`items/cloud/`, `items/cluster/`, `items/container/`, and `items/code/`). 

## 3. Step-by-Step Implementation

### A. Cataloging The Source of Truth
1. Parse all active YAML checklist files.
2. Build and maintain a live virtual index of every currently defined string `id` parameter.

### B. Dangling Pointer Sweep (Deletions)
1. Parse all aggregation profile YAMLs located under `items/config/`.
2. Iterate over every ID declared within the `items.required` and `items.suggested` sequences.
3. If an ID exists in the aggregation profile but does *not* exist in your live index (for example, the checklist item was previously merged or deleted), you must purge that dangling pointer from the config array to prevent null references during builds.

### C. Orphan Discovery & Auto-Routing (Additions)
1. Invert the discovery process: search your active index for items that are not mapped to *any* relevant aggregation profiles, or specifically check items that share recent commit histories.
2. Run a semantic mapping analysis against the orphan items' metadata and tag footprints.
3. **Routing Examples:**
   - If a new checklist item addresses an "AWS IAM Role Assumption" vector, dynamically append its ID to `items/config/eks.yaml`.
   - If an item identifies a "Server-Side Request Forgery" vulnerability, append its ID to `items/config/owasp-k8s-top10.yaml`.
4. Extrapolate context clues from the description to appropriately place the ID in the `required` block (for critical infrastructure failures) versus the `suggested` block (for operational nice-to-haves).

## 4. Final Post-Condition
If this task achieves 100% success, no new item will be left isolated without a linked compliance framework, and no configuration profile will attempt to output undefined item components.

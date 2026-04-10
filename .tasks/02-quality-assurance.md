# AI Agent Task: Schema Enforcement & Semantic Deduplication

## 1. Context & Objective
As the item collection scales organically over multiple commits and contributors, system entropy is inevitable. Schema validations break, duplicate guidelines are accidentally re-created, and tag vectors drift into inconsistent sub-spellings. You will execute daily as a systemic Data Janitor, running routine validation sweeps to autonomously self-heal the taxonomy.

## 2. Step-by-Step Sweeps

### Sweep A: Schema Strictness & Typing Validations
1. Iterate comprehensively across all YAML files in the `items/` system.
2. **ID Matching:** Check if the root `id` parameter perfectly maps to the file's basename (excluding the `.yaml` extension). Flag and rewrite exceptions.
3. **Stage Enum Validation:** The `stage` field must resolve strictly to accepted states (e.g., `active`, `deprecated`, `draft`). Resolve any spelling anomalies.
4. **YAML Typing Iteration:** Fields corresponding to `tags`, `mitigations`, `tools`, and `references` must strictly be represented as YAML sequence blocks (lists). Use heuristics to convert incorrectly typed raw string arrays into proper singular sequence items.

### Sweep B: Semantic Deduplication & Merging
1. Generate a relative similarity footprint mapping the `title` and `description` of all items against one another.
2. Group files that have dangerously high overlap (for instance, detecting two distinct entries concerning "Pod Security Admissions" where one is parked in `cluster` and the other incorrectly placed in `cloud`).
3. **Merge Logistics:**
   - Heuristically select a "survivor" file based on which is situated in the structurally correct directory and possesses a richer description.
   - Aggregate unique blocks (such as external references, distinct tools, or varied mitigation options) from the redundant counterpart into the survivor file.
   - If either file natively contained embedded Mermaid.js diagrams or explicit bash scripting instructions, prioritize and migrate these elements into the survivor block.
   - Safely branch out and trigger a file deletion action on the redundant, absorbed element.

### Sweep C: Taxonomy Normalization
1. Build a system frequency map containing all terms utilized across the `tags` domain.
2. Isolate and capture synonymous, duplicated, or mis-typed strings. 
   - *Example Targets:* `api-server` vs. `apiserver` vs. `api`. 
   - *Example Targets:* `rbac` vs. `access-control` vs. `iam`.
3. Normalize these scattered data points into a strictly unified baseline dictionary. Replace rogue variants natively within the YAML files to ensure metadata scraping and front-end search logic behave consistently.

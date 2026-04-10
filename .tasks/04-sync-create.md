# AI Agent Task: Kubernetes Threat Synchronization & Item Creation

## 1. Context & Objective
Your objective is to ingest external security intelligence (e.g., Threat Matrix, OWASP, Falco, Kyverno) and translate missing best practices into structured YAML configurations for `klist`. 

## 2. Prerequisites
- Assume setup scripts have already cloned external references into the `/tmp/refs/` directory.
- Familiarize yourself with the destination directories:
  - `items/cloud/`: Cloud-centric checks (AWS, GCP, Azure infrastructure).
  - `items/cluster/`: Kubernetes Control Plane & Node-centric checks.
  - `items/container/`: Pod & Container runtime checks (PSS, AppArmor, Capabilities).
  - `items/code/`: Shift-left checks (CI/CD, SAST, Image Scanning).

## 3. Step-by-Step Execution

### Phase A: Knowledge Synchronization
1. Recursively read markdown and policy files inside `/tmp/refs/`.
2. Extract the core mitigation strategies, attack vectors, and specific configuration baselines.
3. Search the `klist/items/` database for existing items covering the extracted concepts to establish a baseline of "What we currently enforce".

### Phase B: Gap Analysis & Triage
1. Filter the extracted baseline to find "Gaps" (concepts present in `/tmp/refs/` but missing or under-represented in `klist/items/`).
2. Categorize each gap by determining the correct target scope (`cloud`, `cluster`, `container`, or `code`).

### Phase C: Content Generation
For every gap identified, generate a newly authored YAML item. Our schema has strict, non-negotiable requirements:
1. `id`: Must follow the `{Prefix}-{Number}` format (e.g., `CLST-045`, `CONT-012`). Locate the highest existing number in the directory and increment by 1.
2. `title`: Actionable and imperative (e.g., "Restrict Automounting of Service Account Tokens").
3. `stage`: Assign the value `active`.
4. `description`: Explain *why* this represents a security risk and detail its mechanics.
   - **Crucial Rule:** If the subject involves architecture, a multi-stage attack vector, or process workflows, embed a rich **Mermaid.js** diagram (````mermaid`) directly in the markdown syntax of the description string.
   - **Crucial Rule:** The description *must* contain a sub-header `**What to check:**` detailing explicit sample bash snippets, `jq` queries, or `kubectl` validation commands to test the finding in reality.
5. `mitigations`: Provide a YAML sequence (array) of string items, each being a clear, distinct action step.
6. `tags`: Assign relevant semantic categorization strings (e.g., `rbac`, `network`).
7. `tools`: List any applicable tools formatted as `{"title": "Tool Name", "url": "https://..."}` arrays that can automate this check.
8. `references`: **Mandatory citation.** Ensure you append an object referencing the specific URL/path back to the `/tmp/refs` source repository where you originally extracted the intelligence from.

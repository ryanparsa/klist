# AI Agent Task: Item Content Enrichment & Execution Validation

## 1. Context & Objective
The `items/` directories currently hold our Kubernetes security taxonomy, but several legacy entries contain generic or purely theoretical guidance. Your daily goal is to evaluate the existing base and organically escalate the quality by bolting on concrete diagnostic commands, visual flowcharts, and precise remediations.

## 2. Execution Flow
1. Load all active items matching `items/**/*.yaml` in the core directories.
2. Evaluate the markdown text contained in the `description` field for every item, alongside the items represented in the `mitigations` array.
3. Identify entries that lack explicit diagnostic code samples, rely on heavily ambiguous terminology, or define complex topics purely via verbose text without diagrams.

## 3. Remediation Requirements

### A. The "What to Check" Mandate
Every security control must empower an auditor or engineer to rapidly test the live system. If an item simply states "ensure RBAC is configured", it must be forcefully rewritten.
- Append a `**What to check:**` bold section to the description text.
- Provide real-world sample commands. Utilize standard infrastructure tooling relevant to the context: `kubectl get ... -o jsonpath`, `aws eks describe-cluster`, `docker inspect`, `gcloud container clusters`, or fundamental Linux shell constructs (`ps aux | grep`, `cat /etc/...`).

### B. Visual Diagram Generation
Search for checklist items that detail non-linear or multi-step networking logic (such as Network Policy ingress/egress boundaries, RBAC RoleBinding trees, Admission Controller chains, or CI/CD signing lifecycles).
- Rewrite these descriptions to embed a `mermaid` markdown block containing a flowchart (`flowchart TD`), sequence diagram, or state network graph to visually map out exactly how the concept is modeled.

### C. Mitigation & Tools Maturation
- **De-blobbing:** If a mitigation step is authored as a massive monolithic paragraph, break it down into an ordered sequential YAML array holding discrete action steps.
- **Tool Mapping:** Refresh and update the `tools` arrays. If an item addresses scanning a container image, ensure modern tool contexts like `Trivy`, `Grype`, or `Clair` are listed alongside functional URLs. If tool entries are absent, research and dynamically add the standard open-source equivalents.

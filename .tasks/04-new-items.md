# Task 04 — New Items from External Research

**Touches:** `items/cloud/`, `items/cluster/`, `items/container/`, `items/code/`, `items/config/`
**Goal:** Create new checklist items for risks not yet covered, sourced from pre-fetched external references.

---

This repo is **klist** — a Kubernetes checklist. Items live in `items/cloud/`, `items/cluster/`, `items/container/`, `items/code/` as YAML files. Configs in `items/config/` promote items to `required` or `suggested` for named profiles.

**External references are pre-fetched by the Jules setup script** and available offline in `/tmp/refs/`. Read these paths directly — do not fetch URLs at runtime:

| Path | Source |
|------|--------|
| `/tmp/refs/threat-matrix-k8s/website/docs/` | Microsoft Threat Matrix for Kubernetes — one `.md` per technique |
| `/tmp/refs/owasp-k8s-top10/` | OWASP Kubernetes Top Ten |
| `/tmp/refs/owasp-k8s-cheatsheet.md` | OWASP Kubernetes Security Cheat Sheet (single file) |
| `/tmp/refs/falco-rules/rules/` | Falco default ruleset — `falco_rules.yaml` |
| `/tmp/refs/kyverno-policies/` | Kyverno policy library — one `.yaml` per policy |
| `/tmp/refs/gatekeeper-library/library/` | OPA/Gatekeeper policy library |
| `/tmp/refs/eks-best-practices/content/` | AWS EKS Best Practices — markdown per topic |
| `/tmp/refs/learnk8s-best-practices/` | learnk8s Kubernetes Production Best Practices |

---

## Item schema (required format)

Every new item **must** follow this exact schema or the builder will reject it:

```yaml
id: CLD-021
title: Restrict public API server access        # provider-agnostic — no AWS/GCP/Azure in title
description: |
  Explanation of the risk and what to verify.

  **What to check:**
  ```sh
  kubectl get svc -n kube-system
  ```
mitigations:
  - |
    Remediation prose. Include a concrete snippet where applicable:
    ```yaml
    apiVersion: networking.k8s.io/v1
    kind: NetworkPolicy
    metadata:
      name: deny-external-api
    spec:
      podSelector: {}
      policyTypes: [Ingress]
    ```
tags:
  - network
  - api-server
tools:
  - title: kube-bench
    url: https://github.com/aquasecurity/kube-bench
references:
  - title: CIS Kubernetes Benchmark
    url: https://www.cisecurity.org/benchmark/kubernetes
```

**Required fields:** `id`, `title`, `description`, `tags`, `references` (at least one entry with `title` + `url`).
**Optional fields:** `mitigations` (array of strings), `tools` (array of objects with `title` + `url`).

---

## ID assignment rule

Before creating a new item, scan **all** existing files in the target `items/{category}/` directory and find the highest numeric suffix currently in use. Use that number + 1 as the new ID.

Example: if the highest existing Cloud item is `CLD-020`, the next new Cloud item is `CLD-021`.

Gaps in the numbering sequence are intentional — never reuse an existing ID.

---

## For each gap found in the references

1. Check whether an existing item already covers this risk. If it does, enrich that item's `description` and `mitigations` instead of creating a new one.
2. If no existing item covers it, create a new YAML file in the appropriate `items/{category}/` directory.
3. The `description` must include a "What to check:" section with a `kubectl` or CLI command.
4. Add a `mitigations` entry with a concrete remediation snippet (manifest, command, or policy excerpt).
5. Add a `tools` entry referencing the tool whose rule/policy surfaced this gap.
6. Add a `references` entry linking back to the specific rule, policy, or technique.
7. Add the new item to the appropriate config(s) in `items/config/`.

**Rules:**
- Keep titles provider-agnostic. AWS/GCP/Azure specifics go in the description body only.
- Do not duplicate an existing item.
- Never reuse an existing ID.

---

## Validation (required before committing)

Run the following from the repo root before making any commit:

```sh
node builder/build.js
```

If the command exits with errors, fix the YAML issues and re-run. **Do not commit if the builder fails.**

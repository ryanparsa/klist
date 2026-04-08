# klist

**Interactive Kubernetes operational checklist.**

klist helps platform and DevOps teams verify that a Kubernetes cluster is correctly configured, hardened, and operationally ready for production. It is not a pure security scanner :  it covers the full spectrum of what makes a cluster stable, compliant, and maintainable in the long run.

Checks are organised around the **4C model** (Cloud, Cluster, Container, Code) and can be filtered by environment, provider, architecture, and compliance framework. Item priorities adjust dynamically based on your selected configurations.

**Live:** [ryanparsa.github.io/klist](https://ryanparsa.github.io/klist/)

---

## Features

- **Dynamic priorities** :  select your configs (EKS, SOC 2, production…) and items are automatically promoted to Required, Suggested, or Optional
- **Per-section scoring** :  track progress across Cloud, Cluster, Container, and Code layers
- **Tri-state items** :  mark each item as Passed, N/A, or leave it unchecked
- **Search and tag filter** :  quickly find relevant items across all categories
- **Shareable URL** :  active config selections live in the query string (`?configs=baseline,eks`)
- **Export / Import** :  save and restore a full session as JSON
- **PDF export** :  clean print view via `window.print()`
- **No backend** :  fully static, runs in the browser

---

## Running locally

```bash
git clone https://github.com/ryanparsa/klist.git
cd klist
npm install
node builder/build.js   # generates public/checklist.json
npm run dev             # starts Vite dev server
```

The app is available at `http://localhost:5173/klist/`.

---

## Project structure

```
klist/
├── items/
│   ├── cloud/          # CLD-xxx.yaml
│   ├── cluster/        # CLT-xxx.yaml
│   ├── container/      # CNT-xxx.yaml
│   ├── code/           # CODE-xxx.yaml
│   └── config/         # one .yaml per config (baseline, eks, soc2, …)
│
├── builder/
│   ├── build.js        # YAML → public/checklist.json
│   └── validate.js     # schema and reference validation
│
├── public/
│   └── checklist.json  # generated. do not edit manually
│
└── src/                # React application
    ├── hooks/
    └── components/
```


---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

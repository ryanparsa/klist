import type { Config, Practice } from "@/.velite"

interface FooterProps {
  practices: Practice[]
  configs: Config[]
}

const CATEGORIES = [
  {
    key: "cloud",
    label: "Cloud",
    icon: "☁",
    desc: "Infrastructure outside the cluster — cloud provider controls, networking, and IAM.",
  },
  {
    key: "cluster",
    label: "Cluster",
    icon: "⚙",
    desc: "Kubernetes control plane, RBAC, network policies, and audit logging.",
  },
  {
    key: "container",
    label: "Container",
    icon: "📦",
    desc: "Container security, image hygiene, runtime profiles, and resource limits.",
  },
  {
    key: "code",
    label: "Code",
    icon: "💻",
    desc: "Application-level security — secrets management, dependency scanning, and SAST.",
  },
]

export function Footer({ practices, configs }: FooterProps) {
  const tags = new Set<string>()
  practices.forEach((p) => p.tags.forEach((t) => tags.add(t)))

  return (
    <footer className="border-t border-border bg-muted/30 px-8 py-12 text-sm text-muted-foreground">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Project description */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">
            <span className="text-primary">k</span>list
          </h2>
          <p className="leading-relaxed">
            An open-source interactive checklist of Kubernetes security and
            operational best practices, organized around the 4C security model.
            Use it to audit your cluster, onboard engineers, or prepare for
            compliance reviews.
          </p>
          <div className="flex gap-4 pt-1">
            <a
              href="https://github.com/ryanparsa/klist"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              GitHub
            </a>
            <a
              href="https://github.com/ryanparsa/klist/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Contributing
            </a>
          </div>
        </div>

        {/* 4C model */}
        <div>
          <h3 className="mb-4 text-xs font-semibold tracking-widest text-foreground uppercase">
            The 4C Security Model
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {CATEGORIES.map((c) => {
              const count = practices.filter((p) => p.category === c.key).length
              return (
                <div
                  key={c.key}
                  className="rounded border border-border bg-background p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-lg">{c.icon}</span>
                    <span className="font-medium text-foreground">
                      {c.label}
                    </span>
                    <span className="ml-auto text-xs">{count}</span>
                  </div>
                  <p className="text-xs leading-relaxed">{c.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom line */}
        <div className="flex items-center justify-between border-t border-border pt-6 text-xs">
          <span>
            Built with{" "}
            <a
              href="https://velite.js.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Velite
            </a>
            ,{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Next.js
            </a>{" "}
            &amp; deployed on GitHub Pages.
          </span>
          <span>Open source · MIT License</span>
        </div>
      </div>
    </footer>
  )
}

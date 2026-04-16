import type { Metadata } from "next"
import { practices, configs } from "@/.velite"
import { Dashboard } from "@/components/Dashboard"

export const metadata: Metadata = {
  title: "klist — Kubernetes Operational Checklist",
  description:
    "An interactive checklist of 121+ Kubernetes security and operational practices organized around the 4C model: Cloud, Cluster, Container, and Code.",
  keywords: [
    "Kubernetes",
    "security",
    "checklist",
    "k8s",
    "DevSecOps",
    "CIS Benchmark",
    "cloud native",
  ],
  openGraph: {
    title: "klist — Kubernetes Operational Checklist",
    description:
      "Interactive checklist of 121+ Kubernetes security and operational practices organized by the 4C model.",
    type: "website",
  },
}

export default function Page() {
  return <Dashboard practices={practices} configs={configs} />
}

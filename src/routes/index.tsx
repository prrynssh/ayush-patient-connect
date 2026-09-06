import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, Pill, ShieldCheck, Stethoscope, UserRound } from "lucide-react";

import { Logo } from "@/components/app/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AYUSH Care — Patient Case-Taking & Consultation System" },
      {
        name: "description",
        content:
          "Hospital information system prototype for AYUSH case-taking, consultations and prescriptions with patient, doctor and pharmacist workspaces.",
      },
      { property: "og:title", content: "AYUSH Care — Patient Case-Taking & Consultation System" },
      {
        property: "og:description",
        content:
          "Role-based AYUSH consultation workflow: patient case history, doctor assessment and prescriptions, pharmacist verification.",
      },
    ],
  }),
  component: Landing,
});

const roles = [
  {
    icon: UserRound,
    title: "Patient",
    text: "Register with ABHA, record your general history and AYUSH assessment, and track consultations and prescriptions.",
  },
  {
    icon: Stethoscope,
    title: "Doctor",
    text: "Look up patients by Patient ID, review case history, record assessments and issue prescriptions.",
  },
  {
    icon: Pill,
    title: "Pharmacist",
    text: "Verify prescriptions against a Patient ID and view dispensing details in read-only mode.",
  },
];

function Landing() {
  return (
    <div className="hero-gradient min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <Logo className="size-9" />
          <div>
            <p className="text-sm font-bold leading-tight">AYUSH Care</p>
            <p className="text-[11px] text-muted-foreground">Consultation System</p>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Register</Link>
          </Button>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-10 md:pt-20">
        <Badge variant="teal" className="mb-4">
          SIH Prototype · Sandbox verification
        </Badge>
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl">
          Patient case-taking and consultation, built for AYUSH practice.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          A hospital information system connecting patients, doctors and pharmacists with unique
          IDs, structured AYUSH assessments, consultations and tamper-proof prescriptions.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/register">
              Create an account <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/auth">I already have an account</Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {roles.map((r) => (
            <div key={r.title} className="card-elevated p-6">
              <div className="flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <r.icon className="size-5" />
              </div>
              <h2 className="mt-4 text-lg font-bold">{r.title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{r.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, label: "ABHA / NMC / PCI", value: "Sandbox verified identities" },
            { icon: ClipboardList, label: "Structured records", value: "Cases · Assessments · Rx" },
            { icon: Stethoscope, label: "Role-based access", value: "Enforced on the server" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-3 rounded-lg border bg-surface/70 px-4 py-3">
              <f.icon className="size-5 text-primary" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {f.label}
                </p>
                <p className="text-sm font-semibold">{f.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

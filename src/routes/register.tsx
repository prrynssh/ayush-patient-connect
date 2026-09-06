import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { CheckCircle2, Pill, Stethoscope, UserRound } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { ROLE_HOME, type AppRole } from "@/lib/auth";
import { registerUser, registrationSchema } from "@/lib/registration.functions";
import {
  GENDERS,
  SPECIALIZATIONS,
  STATE_MEDICAL_COUNCILS,
  STATE_PHARMACY_COUNCILS,
} from "@/lib/constants";
import { Logo } from "@/components/app/Logo";
import { Field } from "@/components/app/FormField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — AYUSH Care" },
      {
        name: "description",
        content: "Create a patient, doctor or pharmacist account with sandbox ABHA / NMC / PCI verification.",
      },
      { property: "og:title", content: "Register — AYUSH Care" },
      { property: "og:description", content: "Join the AYUSH consultation system." },
    ],
  }),
  component: RegisterPage,
});

const ROLE_CARDS: { role: AppRole; icon: typeof UserRound; title: string; text: string }[] = [
  { role: "patient", icon: UserRound, title: "Patient", text: "ABHA-linked health record" },
  { role: "doctor", icon: Stethoscope, title: "Doctor", text: "Registered AYUSH practitioner" },
  { role: "pharmacist", icon: Pill, title: "Pharmacist", text: "Registered pharmacy" },
];

type Errors = Record<string, string>;

function RegisterPage() {
  const navigate = useNavigate();
  const register = useServerFn(registerUser);
  const [role, setRole] = useState<AppRole>("patient");
  const [form, setForm] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ id: string; role: AppRole } | null>(null);

  const set = (k: string) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const input = (k: string) => ({
    id: k,
    value: form[k] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(k)(e.target.value),
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    const parsed = registrationSchema.safeParse({ ...form, role });
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] = issue.message;
      setErrors(errs);
      toast.error("Please fix the highlighted fields");
      return;
    }
    setLoading(true);
    try {
      const result = await register({ data: parsed.data });
      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      if (error) throw error;
      setDone({ id: result.generatedId, role: result.role });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    const idLabel = { patient: "Patient ID", doctor: "Doctor ID", pharmacist: "Pharmacist ID" }[done.role];
    const registry = { patient: "ABHA (ABDM)", doctor: "NMC / State Council", pharmacist: "PCI / State Council" }[done.role];
    return (
      <div className="hero-gradient flex min-h-screen items-center justify-center px-4">
        <div className="card-elevated w-full max-w-md p-8 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="size-8" />
          </div>
          <h1 className="mt-4 text-xl font-bold">Registration complete</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your unique identifier has been generated.</p>
          <div className="mt-6 rounded-lg border bg-muted/40 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{idLabel}</p>
            <p className="mt-1 font-mono text-2xl font-bold tracking-wide text-primary">{done.id}</p>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">{registry}:</span>
            <Badge variant="success">Sandbox Verified</Badge>
          </div>
          <Button className="mt-6 w-full" onClick={() => navigate({ to: ROLE_HOME[done.role] })}>
            Go to my dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-gradient min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2.5">
          <Logo className="size-10" />
          <div>
            <p className="text-base font-bold leading-tight">AYUSH Care</p>
            <p className="text-xs text-muted-foreground">Consultation System</p>
          </div>
        </Link>

        <div className="card-elevated p-6 sm:p-8">
          <h1 className="text-xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Choose your role to see the right registration form.</p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {ROLE_CARDS.map((c) => (
              <button
                key={c.role}
                type="button"
                onClick={() => {
                  setRole(c.role);
                  setErrors({});
                }}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors",
                  role === c.role
                    ? "border-primary bg-accent text-accent-foreground ring-1 ring-primary"
                    : "hover:bg-muted",
                )}
              >
                <c.icon className="size-5" />
                <span className="text-sm font-semibold">{c.title}</span>
                <span className="hidden text-xs text-muted-foreground sm:block">{c.text}</span>
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground">Basic details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" htmlFor="full_name" error={errors.full_name} className="sm:col-span-2">
                  <Input {...input("full_name")} autoComplete="name" />
                </Field>
                <Field label="Mobile number" htmlFor="mobile" error={errors.mobile}>
                  <Input {...input("mobile")} inputMode="tel" placeholder="10-digit mobile" />
                </Field>
                <Field label="Email" htmlFor="email" error={errors.email}>
                  <Input {...input("email")} type="email" autoComplete="email" />
                </Field>
              </div>
            </section>

            {role === "patient" && (
              <section className="space-y-4">
                <h2 className="text-sm font-semibold text-muted-foreground">Patient details</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Date of birth" htmlFor="date_of_birth" error={errors.date_of_birth}>
                    <Input {...input("date_of_birth")} type="date" />
                  </Field>
                  <Field label="Gender" error={errors.gender}>
                    <Select value={form.gender ?? ""} onValueChange={set("gender")}>
                      <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                      <SelectContent>
                        {GENDERS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Address" htmlFor="address" error={errors.address} className="sm:col-span-2">
                    <Textarea {...input("address")} rows={2} />
                  </Field>
                  <Field
                    label="ABHA number"
                    htmlFor="abha_number"
                    error={errors.abha_number}
                    hint="14-digit Ayushman Bharat Health Account number (sandbox — any number accepted)"
                    className="sm:col-span-2"
                  >
                    <Input {...input("abha_number")} placeholder="91-XXXX-XXXX-XXXX" className="font-mono" />
                  </Field>
                </div>
              </section>
            )}

            {role === "doctor" && (
              <section className="space-y-4">
                <h2 className="text-sm font-semibold text-muted-foreground">Professional details</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="State Medical Council" error={errors.state_medical_council} className="sm:col-span-2">
                    <Select value={form.state_medical_council ?? ""} onValueChange={set("state_medical_council")}>
                      <SelectTrigger><SelectValue placeholder="Select council" /></SelectTrigger>
                      <SelectContent>
                        {STATE_MEDICAL_COUNCILS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Medical Registration Number" htmlFor="registration_number" error={errors.registration_number}>
                    <Input {...input("registration_number")} className="font-mono" />
                  </Field>
                  <Field label="Years of experience" htmlFor="years_experience" error={errors.years_experience}>
                    <Input {...input("years_experience")} type="number" min={0} max={70} />
                  </Field>
                  <Field label="Specialization" error={errors.specialization}>
                    <Select value={form.specialization ?? ""} onValueChange={set("specialization")}>
                      <SelectTrigger><SelectValue placeholder="Select specialization" /></SelectTrigger>
                      <SelectContent>
                        {SPECIALIZATIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Hospital / Clinic" htmlFor="hospital_clinic" error={errors.hospital_clinic}>
                    <Input {...input("hospital_clinic")} />
                  </Field>
                </div>
              </section>
            )}

            {role === "pharmacist" && (
              <section className="space-y-4">
                <h2 className="text-sm font-semibold text-muted-foreground">Pharmacy details</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Pharmacist Registration Number" htmlFor="registration_number" error={errors.registration_number}>
                    <Input {...input("registration_number")} className="font-mono" />
                  </Field>
                  <Field label="State Pharmacy Council" error={errors.state_pharmacy_council}>
                    <Select value={form.state_pharmacy_council ?? ""} onValueChange={set("state_pharmacy_council")}>
                      <SelectTrigger><SelectValue placeholder="Select council" /></SelectTrigger>
                      <SelectContent>
                        {STATE_PHARMACY_COUNCILS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Pharmacy name" htmlFor="pharmacy_name" error={errors.pharmacy_name} className="sm:col-span-2">
                    <Input {...input("pharmacy_name")} />
                  </Field>
                  <Field label="Pharmacy address" htmlFor="pharmacy_address" error={errors.pharmacy_address} className="sm:col-span-2">
                    <Textarea {...input("pharmacy_address")} rows={2} />
                  </Field>
                </div>
              </section>
            )}

            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground">Security</h2>
              <Field label="Password" htmlFor="password" error={errors.password} hint="At least 6 characters">
                <Input {...input("password")} type="password" autoComplete="new-password" />
              </Field>
            </section>

            <div className="rounded-lg border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
              Prototype mode: identity is checked against a sandbox registry and marked{" "}
              <span className="font-semibold text-success">Sandbox Verified</span>. No real ABDM, NMC or PCI
              APIs are called.
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account…" : `Register as ${ROLE_CARDS.find((c) => c.role === role)!.title}`}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Link to="/auth" className="font-semibold text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// keep zod referenced for type inference in this module
export type { z };

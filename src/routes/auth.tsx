import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { fetchUserRole, ROLE_HOME } from "@/lib/auth";
import { Logo } from "@/components/app/Logo";
import { Field } from "@/components/app/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — AYUSH Care" },
      { name: "description", content: "Sign in to your patient, doctor or pharmacist workspace." },
      { property: "og:title", content: "Sign in — AYUSH Care" },
      { property: "og:description", content: "Access the AYUSH consultation system." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      setLoading(false);
      toast.error(error?.message ?? "Sign in failed");
      return;
    }
    const role = await fetchUserRole(data.user.id);
    setLoading(false);
    if (!role) {
      toast.error("No role found for this account. Please register again.");
      await supabase.auth.signOut();
      return;
    }
    navigate({ to: ROLE_HOME[role], replace: true });
  }

  return (
    <div className="hero-gradient flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2.5">
          <Logo className="size-10" />
          <div>
            <p className="text-base font-bold leading-tight">AYUSH Care</p>
            <p className="text-xs text-muted-foreground">Consultation System</p>
          </div>
        </Link>
        <div className="card-elevated p-6 sm:p-8">
          <h1 className="text-xl font-bold">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the email and password you registered with.
          </p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Field label="Email" htmlFor="email">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Password" htmlFor="password">
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Register as patient, doctor or pharmacist
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

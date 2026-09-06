import { createFileRoute, redirect } from "@tanstack/react-router";
import { ROLE_HOME } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  beforeLoad: ({ context }) => {
    throw redirect({ to: ROLE_HOME[context.role], replace: true });
  },
  component: () => null,
});

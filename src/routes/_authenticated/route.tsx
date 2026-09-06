import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { fetchUserRole } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    const role = await fetchUserRole(data.user.id);
    if (!role) throw redirect({ to: "/auth" });
    return { user: data.user, role };
  },
  component: () => <Outlet />,
});

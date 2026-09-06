import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];

export const ROLE_HOME: Record<AppRole, "/patient" | "/doctor" | "/pharmacist"> = {
  patient: "/patient",
  doctor: "/doctor",
  pharmacist: "/pharmacist",
};

export const ROLE_LABEL: Record<AppRole, string> = {
  patient: "Patient",
  doctor: "Doctor",
  pharmacist: "Pharmacist",
};

export async function fetchUserRole(userId: string): Promise<AppRole | null> {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.role ?? null;
}

export async function getSessionWithRole() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { user: null, role: null } as const;
  const role = await fetchUserRole(data.user.id);
  return { user: data.user, role } as const;
}

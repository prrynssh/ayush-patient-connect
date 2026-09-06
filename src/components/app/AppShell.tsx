import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";
import { ROLE_LABEL, type AppRole } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "./Logo";

export type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  exact?: boolean;
};

type Props = {
  role: AppRole;
  displayName: string;
  displayId: string;
  subtitle?: string;
  nav: NavItem[];
  children: ReactNode;
};

export function AppShell({ role, displayName, displayId, subtitle, nav, children }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r-0">
        <SidebarHeader className="px-3 py-4">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <Logo className="size-8 shrink-0" />
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-bold leading-tight">AYUSH Care</p>
              <p className="truncate text-[11px] text-sidebar-foreground/60">Consultation System</p>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{ROLE_LABEL[role]} workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((item) => {
                  const active = item.exact
                    ? pathname === item.to
                    : pathname === item.to || pathname.startsWith(item.to + "/");
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                        <Link to={item.to}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-3">
          <div className="rounded-lg bg-sidebar-accent/60 p-3 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold">{displayName}</p>
            <p className="mt-0.5 truncate font-mono text-[11px] text-sidebar-foreground/70">
              {displayId}
            </p>
            {subtitle && (
              <p className="mt-0.5 truncate text-[11px] text-sidebar-foreground/60">{subtitle}</p>
            )}
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={signOut} tooltip="Sign out">
                <LogOut />
                <span>Sign out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-surface/85 px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {ROLE_LABEL[role]}
            </Badge>
            <span className="id-chip truncate">{displayId}</span>
          </div>
          <Badge variant="success" className="hidden md:inline-flex">
            Sandbox environment
          </Badge>
          <Button variant="ghost" size="sm" onClick={signOut} className="hidden sm:inline-flex">
            <LogOut /> Sign out
          </Button>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

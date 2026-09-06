import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

export function VerifiedBadge({ label = "Sandbox Verified" }: { label?: string }) {
  return (
    <Badge variant="success" className="gap-1">
      <ShieldCheck className="size-3" /> {label}
    </Badge>
  );
}

const CASE_STATUS: Record<string, { label: string; variant: "info" | "warning" | "success" | "secondary" }> = {
  open: { label: "Open", variant: "info" },
  under_treatment: { label: "Under treatment", variant: "warning" },
  closed: { label: "Closed", variant: "secondary" },
  completed: { label: "Completed", variant: "success" },
  active: { label: "Active", variant: "success" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = CASE_STATUS[status] ?? { label: status, variant: "secondary" as const };
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

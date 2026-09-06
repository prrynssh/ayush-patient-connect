import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DetailItem = { label: string; value: ReactNode; wide?: boolean };

export function DetailList({ items, className }: { items: DetailItem[]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2", className)}>
      {items.map((it) => (
        <div key={it.label} className={cn(it.wide && "sm:col-span-2")}>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {it.label}
          </dt>
          <dd className="mt-1 whitespace-pre-wrap text-sm text-foreground">
            {it.value === "" || it.value == null ? (
              <span className="text-muted-foreground">—</span>
            ) : (
              it.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "brand-gradient flex items-center justify-center rounded-lg text-primary-foreground shadow-sm",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-[60%]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21c-4.5-3.2-7-6.4-7-10a7 7 0 0 1 14 0c0 3.6-2.5 6.8-7 10Z" />
        <path d="M12 7v6M9 10h6" />
      </svg>
    </div>
  );
}

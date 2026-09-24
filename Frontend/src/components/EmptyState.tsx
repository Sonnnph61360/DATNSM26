import { ArrowRight, CalendarDays, ClipboardList, Search, Ticket, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  icon?: "search" | "booking" | "ticket" | "trophy";
  compact?: boolean;
};

const icons = { search: Search, booking: CalendarDays, ticket: Ticket, trophy: Trophy };

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  icon = "search",
  compact = false,
}: EmptyStateProps) {
  const Icon = icons[icon];
  const action = actionLabel && (actionTo ? (
    <Link to={actionTo} className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-extrabold shadow-lg shadow-slate-900/10">
      {actionLabel}<ArrowRight className="h-4 w-4" />
    </Link>
  ) : (
    <button type="button" onClick={onAction} className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-extrabold shadow-lg shadow-slate-900/10">
      {actionLabel}<ArrowRight className="h-4 w-4" />
    </button>
  ));

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-white text-center shadow-sm ${compact ? "px-5 py-10" : "px-6 py-16"}`}>
      <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-amber-100/70 blur-3xl" />
      <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-600 shadow-inner">
        <Icon className="h-8 w-8" strokeWidth={1.8} />
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-white" />
      </div>
      <h3 className="relative mt-5 text-xl font-extrabold text-slate-950">{title}</h3>
      <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      {action && <div className="relative mt-6">{action}</div>}
    </div>
  );
}

export function AdminEmptyState({ title, description, actionLabel, actionTo, icon = "booking" }: Omit<EmptyStateProps, "compact">) {
  return <EmptyState title={title} description={description} actionLabel={actionLabel} actionTo={actionTo} icon={icon} compact />;
}

export function EmptyTableIllustration({ label }: { label: string }) {
  return <div className="py-10"><ClipboardList className="mx-auto mb-3 h-10 w-10 text-amber-400" /><p className="font-semibold text-slate-500">{label}</p></div>;
}

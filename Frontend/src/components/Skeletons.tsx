type SkeletonProps = { className?: string };

function Skeleton({ className = "" }: SkeletonProps) {
  return <div aria-hidden="true" className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`} />;
}

export function FieldCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <Skeleton className="h-56 rounded-none" />
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-6 w-3/5" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-4 w-11/12" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-28" />
        </div>
        <div className="flex items-end justify-between border-t border-slate-100 pt-5">
          <div className="space-y-2"><Skeleton className="h-3 w-12" /><Skeleton className="h-6 w-28" /></div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function FieldGridSkeleton({ count = 6 }: { count?: number }) {
  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: count }, (_, index) => <FieldCardSkeleton key={index} />)}</div>;
}

export function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#f7f8f6]">
      <Skeleton className="h-80 rounded-none md:h-[500px]" />
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8"><Skeleton className="mb-8 h-24 w-full" /><Skeleton className="h-7 w-48" /><Skeleton className="mt-4 h-20 w-full" /></div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8"><Skeleton className="h-7 w-52" /><div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3"><Skeleton className="aspect-[4/3]" /><Skeleton className="aspect-[4/3]" /><Skeleton className="aspect-[4/3]" /></div></div>
          </div>
          <div className="h-80 rounded-3xl border border-slate-200 bg-white p-6"><Skeleton className="h-7 w-40" /><Skeleton className="mt-6 h-12 w-full" /><Skeleton className="mt-3 h-12 w-full" /><Skeleton className="mt-8 h-12 w-full" /></div>
        </div>
      </div>
    </div>
  );
}

export function BookingListSkeleton({ dark = false }: { dark?: boolean }) {
  const base = dark ? "bg-zinc-800" : "bg-slate-200/80";
  return <div className="space-y-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className={`rounded-3xl border p-5 ${dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-white"}`}><div className="flex items-center justify-between gap-4"><Skeleton className={`h-6 w-40 ${base}`} /><Skeleton className={`h-8 w-24 ${base}`} /></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><Skeleton className={`h-4 w-full ${base}`} /><Skeleton className={`h-4 w-full ${base}`} /><Skeleton className={`h-4 w-2/3 ${base}`} /></div></div>)}</div>;
}

export function AdminTableSkeleton({ dark = false }: { dark?: boolean }) {
  const base = dark ? "bg-zinc-800" : "bg-slate-200/80";
  return <div className={`overflow-hidden rounded-2xl border p-5 ${dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-white"}`}><div className="space-y-5">{Array.from({ length: 8 }, (_, index) => <div key={index} className="flex items-center gap-4"><Skeleton className={`h-4 w-10 ${base}`} /><Skeleton className={`h-4 flex-1 ${base}`} /><Skeleton className={`h-4 w-28 ${base}`} /><Skeleton className={`h-8 w-20 ${base}`} /></div>)}</div></div>;
}

export function DashboardSkeleton() {
  return <div className="space-y-8"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-32 rounded-3xl border border-zinc-800 bg-zinc-900 p-6"><Skeleton className="h-4 w-24 bg-zinc-800" /><Skeleton className="mt-5 h-8 w-32 bg-zinc-800" /></div>)}</div><div className="grid gap-6 lg:grid-cols-2"><div className="h-80 rounded-3xl border border-zinc-800 bg-zinc-900 p-6"><Skeleton className="h-6 w-48 bg-zinc-800" /><Skeleton className="mt-8 h-56 w-full bg-zinc-800" /></div><div className="h-80 rounded-3xl border border-zinc-800 bg-zinc-900 p-6"><Skeleton className="h-6 w-48 bg-zinc-800" /><div className="mt-8 space-y-5">{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-5 w-full bg-zinc-800" />)}</div></div></div></div>;
}

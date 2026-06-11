import { cn } from "@/lib/utils";

function Shimmer({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-muted", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border bg-card">
      <Shimmer className="aspect-[4/3] rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <Shimmer className="h-4 w-1/3" />
        <Shimmer className="h-5 w-3/4" />
        <Shimmer className="h-4 w-1/4" />
        <Shimmer className="h-10 w-full mt-1" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategoryGridSkeleton() {
  return (
    <section className="bg-champanhe py-20 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col items-center gap-3">
          <Shimmer className="h-3 w-24" />
          <Shimmer className="h-9 w-56" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Shimmer key={i} className="aspect-square" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function AdminStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl border bg-card p-5 flex flex-col gap-3">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

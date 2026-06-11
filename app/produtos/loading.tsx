import { ProductGridSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16 bg-white border-b" />
      <div className="bg-[#2a2018] py-14 px-6">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="h-9 w-64 animate-pulse rounded-xl bg-white/10" />
          <div className="h-4 w-32 animate-pulse rounded-xl bg-white/10" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-10 w-full flex flex-col lg:flex-row gap-8">
        <div className="lg:w-56 shrink-0 flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
        <div className="flex-1">
          <ProductGridSkeleton count={9} />
        </div>
      </div>
    </div>
  );
}

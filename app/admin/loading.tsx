import { AdminStatsSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <div className="h-7 w-40 animate-pulse rounded-xl bg-muted" />
      <AdminStatsSkeleton />
      <div className="h-80 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}

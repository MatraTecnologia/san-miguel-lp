export default function Loading() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-3 w-20 rounded bg-[#e8ddd0]" />
          <div className="h-8 w-40 rounded-xl bg-[#e8ddd0]" />
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#e8ddd0] p-5 flex flex-col gap-4">
            <div className="w-9 h-9 rounded-xl bg-[#f0e8da]" />
            <div className="flex flex-col gap-2">
              <div className="h-8 w-16 rounded bg-[#f0e8da]" />
              <div className="h-3 w-24 rounded bg-[#f0e8da]" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e8ddd0] p-6 h-72" />
        <div className="bg-white rounded-2xl border border-[#e8ddd0] p-6 h-72" />
      </div>
    </div>
  );
}

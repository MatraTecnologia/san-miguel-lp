import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import AdminSidebar from "./_components/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session.user as any).role !== "admin") redirect("/");

  return (
    <div className="flex min-h-screen w-full bg-[#f5f0e8]">
      <AdminSidebar user={session.user} />
      <main className="flex-1 min-w-0 p-6 lg:p-8 overflow-auto">{children}</main>
    </div>
  );
}

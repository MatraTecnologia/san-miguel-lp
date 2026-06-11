import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default async function ContaLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/entrar");

  return (
    <div className="flex flex-col min-h-screen bg-marfim">
      <Navbar />
      <div className="pt-16 flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}

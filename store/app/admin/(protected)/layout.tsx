import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <AdminSidebar />

      <div className="min-h-screen lg:pl-[250px]">
        <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#050505]/90 px-5 py-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#FFEA00]">
                BL MANTOS
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                Painel administrativo
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.14em] text-white/30 sm:block">
                Administrador
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FFEA00]/20 bg-[#FFEA00]/10 text-xs font-black text-[#FFEA00]">
                A
              </div>
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}

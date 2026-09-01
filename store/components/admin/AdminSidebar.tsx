import Link from "next/link";
import {
  BarChart3,
  ChevronRight,
  CircleDollarSign,
  Image as ImageIcon,
  LayoutDashboard,
  Megaphone,
  Package,
  Percent,
  Settings,
  ShoppingBag,
  TicketPercent,
  Users,
} from "lucide-react";

const menu = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/promocoes", label: "Promoções", icon: Megaphone },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/cupons", label: "Cupons", icon: TicketPercent },
  { href: "/admin/conteudo", label: "Conteúdo", icon: ImageIcon },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export default function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] border-r border-white/[0.07] bg-[#090909] lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-white/[0.07] px-6 py-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFEA00]">
            BL Mantos
          </p>
          <h1 className="mt-2 text-xl font-black tracking-tight text-white">
            Administração
          </h1>
          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/30">
            Painel comercial
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/50 transition hover:bg-white/[0.05] hover:text-white"
              >
                <Icon className="h-[17px] w-[17px] transition group-hover:text-[#FFEA00]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/[0.07] p-4">
          <div className="rounded-xl border border-[#FFEA00]/15 bg-[#FFEA00]/[0.04] p-4">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFEA00]">
              Site
            </p>
            <Link
              href="/"
              className="mt-2 flex items-center justify-between text-xs font-semibold text-white/60 transition hover:text-white"
            >
              <span>Ver loja</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

import {
  BarChart3,
  CircleDollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

const stats = [
  { label: "Vendas hoje", value: "R$ 0,00", icon: CircleDollarSign },
  { label: "Pedidos hoje", value: "0", icon: ShoppingBag },
  { label: "Produtos em estoque", value: "—", icon: Package },
  { label: "Ticket médio", value: "R$ 0,00", icon: TrendingUp },
];

export default function AdminPage() {
  return (
    <div className="px-5 py-7 sm:px-8 sm:py-9">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#FFEA00]">
              Visão geral
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Dashboard
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
              Central de operação comercial da BL Mantos.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
              Status
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#00FF66] shadow-[0_0_12px_rgba(0,255,102,0.65)]" />

              <span className="text-xs font-semibold text-white/70">
                Sistema operacional
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
                    {stat.label}
                  </span>

                  <Icon className="h-4 w-4 text-[#FFEA00]" />
                </div>

                <p className="mt-4 text-2xl font-black tracking-tight text-white">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFEA00]">
                  Vendas
                </p>

                <h3 className="mt-2 text-lg font-black text-white">
                  Desempenho comercial
                </h3>
              </div>

              <BarChart3 className="h-5 w-5 text-white/25" />
            </div>

            <div className="mt-8 flex h-[280px] items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-black/20">
              <div className="text-center">
                <p className="text-sm font-semibold text-white/45">
                  Gráfico de vendas
                </p>

                <p className="mt-1 text-xs text-white/20">
                  Será conectado ao banco de pedidos.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFEA00]">
              Operação
            </p>

            <h3 className="mt-2 text-lg font-black text-white">
              Próximas ações
            </h3>

            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
                <p className="text-xs font-bold text-white/75">
                  Produtos e preços
                </p>

                <p className="mt-1 text-[11px] leading-5 text-white/35">
                  Criar a camada comercial independente do ERPNext.
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
                <p className="text-xs font-bold text-white/75">
                  Promoções
                </p>

                <p className="mt-1 text-[11px] leading-5 text-white/35">
                  Selecionar produtos específicos, times e categorias.
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
                <p className="text-xs font-bold text-white/75">
                  Pedidos e entrega
                </p>

                <p className="mt-1 text-[11px] leading-5 text-white/35">
                  Integrar status, motoboy e acompanhamento.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
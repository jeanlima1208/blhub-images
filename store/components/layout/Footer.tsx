import Link from "next/link";

export default function Footer() {
return ( <footer className="border-t border-white/[0.07] bg-[#050505]">
{/* Linha de destaque */} <div className="h-px w-full bg-gradient-to-r from-transparent via-[#FFEA00]/40 to-transparent" />

  <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">

    <div className="grid gap-12 md:grid-cols-4">

      {/* MARCA */}
      <div className="md:col-span-1">

        <p className="text-2xl font-black tracking-tight text-white">
          BL{" "}
          <span className="text-[#FFEA00]">
            MANTOS
          </span>
        </p>

        <p className="mt-3 max-w-xs text-[10px] font-medium uppercase leading-relaxed tracking-[0.18em] text-white/50">
          Orgulho de vestir o que nos move.
        </p>

        <div className="mt-6 h-px w-12 bg-[#FFEA00]" />

        <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
          Qualidade Premium
        </p>

      </div>

      {/* NAVEGAÇÃO */}
      <div>

        <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-white">
          Loja
        </h3>

        <div className="mt-5 flex flex-col gap-3">

          <Link
            href="/"
            className="text-[10px] font-medium tracking-[0.08em] text-[#A1A1AA] transition-colors duration-200 hover:text-[#FFEA00]"
          >
            Início
          </Link>

          <Link
            href="/"
            className="text-[10px] font-medium tracking-[0.08em] text-[#A1A1AA] transition-colors duration-200 hover:text-[#FFEA00]"
          >
            Camisas
          </Link>

          <Link
            href="/"
            className="text-[10px] font-medium tracking-[0.08em] text-[#A1A1AA] transition-colors duration-200 hover:text-[#FFEA00]"
          >
            Lançamentos
          </Link>

          <Link
            href="/"
            className="text-[10px] font-medium tracking-[0.08em] text-[#A1A1AA] transition-colors duration-200 hover:text-[#FFEA00]"
          >
            Promoções
          </Link>

        </div>

      </div>

      {/* ATENDIMENTO */}
      <div>

        <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-white">
          Atendimento
        </h3>

        <div className="mt-5 flex flex-col gap-4">

          <a
            href="https://wa.me/5542999249903"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0 text-white/45 transition-colors duration-200 group-hover:text-[#FFEA00]"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.48 0 .14 5.34.14 11.9c0 2.1.55 4.15 1.6 5.96L.04 24l6.28-1.65a11.87 11.87 0 0 0 5.71 1.46h.01c6.55 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.42-8.43ZM12.04 21.8h-.01a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.73.98.99-3.64-.23-.37a9.87 9.87 0 1 1 8.38 4.62Zm5.42-7.39c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.64-.93-2.25-.25-.6-.5-.52-.68-.53h-.58c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.07-.13-.27-.2-.57-.35Z" />
            </svg>

            <span className="text-[10px] font-bold tracking-[0.06em] text-[#A1A1AA] transition-colors duration-200 group-hover:text-[#FFEA00]">
              (42) 99924-9903
            </span>
          </a>

          <a
            href="https://instagram.com/blmantos2"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0 text-white/45 transition-colors duration-200 group-hover:text-[#FFEA00]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>

            <span className="text-[10px] font-bold tracking-[0.06em] text-[#A1A1AA] transition-colors duration-200 group-hover:text-[#FFEA00]">
              @blmantos2
            </span>
          </a>

        </div>

      </div>

      {/* SEGURANÇA */}
      <div>

        <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-white">
          Segurança
        </h3>

        <div className="mt-5 flex flex-col gap-4">

          {/* PAGAMENTO */}
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/35">
              Pagamento
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2">

              {/* PIX */}
              <span className="flex h-7 items-center rounded-md border border-white/[0.08] bg-white/[0.035] px-2.5 text-[8px] font-black uppercase tracking-wide text-white/65">
                Pix
              </span>

              {/* CARTÃO */}
              <span className="flex h-7 items-center rounded-md border border-white/[0.08] bg-white/[0.035] px-2.5 text-[8px] font-black uppercase tracking-wide text-white/65">
                Cartão
              </span>

            </div>
          </div>

          {/* COMPRA SEGURA */}
          <div className="flex items-center gap-3">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#00FF66]/15 bg-[#00FF66]/[0.05]">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-[#00FF66]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <rect x="5" y="10" width="14" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/75">
                Compra 100% Segura
              </p>

              <p className="mt-1 text-[8px] tracking-[0.05em] text-white/35">
                Ambiente protegido
              </p>
            </div>

          </div>

          <Link
            href="/trocas-e-devolucoes"
            className="text-[10px] font-medium tracking-[0.06em] text-[#A1A1AA] transition-colors duration-200 hover:text-[#FFEA00]"
          >
            Trocas e devoluções
          </Link>

          <Link
            href="/politica-de-privacidade"
            className="text-[10px] font-medium tracking-[0.06em] text-[#A1A1AA] transition-colors duration-200 hover:text-[#FFEA00]"
          >
            Política de privacidade
          </Link>

        </div>

      </div>

    </div>

    {/* DIVISOR */}
    <div className="my-10 h-px bg-white/[0.07]" />

    {/* RODAPÉ INFERIOR */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <p className="text-[8px] font-medium uppercase tracking-[0.16em] text-white/40">
        © 2026 BL Mantos. Todos os direitos reservados.
      </p>

      <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/30">
        Qualidade Premium
      </p>

    </div>

  </div>
</footer>

);
}

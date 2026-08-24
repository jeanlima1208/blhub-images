import Link from "next/link";

function PixIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7.1 7.1 10 4.2a2.8 2.8 0 0 1 4 0l2.9 2.9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="m16.9 16.9-2.9 2.9a2.8 2.8 0 0 1-4 0l-2.9-2.9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="m4.4 10.4 2.7-2.7 3.7 3.7a1.7 1.7 0 0 0 2.4 0l3.7-3.7 2.7 2.7a2.2 2.2 0 0 1 0 3.2l-2.7 2.7-3.7-3.7a1.7 1.7 0 0 0-2.4 0l-3.7 3.7-2.7-2.7a2.2 2.2 0 0 1 0-3.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MastercardIcon() {
  return (
    <svg
      viewBox="0 0 36 24"
      className="h-[18px] w-[27px]"
      aria-hidden="true"
    >
      <circle
        cx="13"
        cy="12"
        r="7"
        fill="currentColor"
        opacity="0.9"
      />
      <circle
        cx="23"
        cy="12"
        r="7"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>
  );
}

function VisaIcon() {
  return (
    <svg
      viewBox="0 0 48 24"
      className="h-[16px] w-[32px]"
      aria-hidden="true"
    >
      <text
        x="1"
        y="17"
        fill="currentColor"
        fontSize="16"
        fontWeight="900"
        fontStyle="italic"
        fontFamily="Arial, sans-serif"
      >
        VISA
      </text>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.48 0 .14 5.34.14 11.9c0 2.1.55 4.15 1.6 5.96L.04 24l6.28-1.65a11.87 11.87 0 0 0 5.71 1.46h.01c6.55 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.42-8.43ZM12.04 21.8h-.01a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.73.98.99-3.64-.23-.37a9.87 9.87 0 1 1 8.38 4.62Zm5.42-7.39c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.64-.93-2.25-.25-.6-.5-.52-.68-.53h-.58c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
      />
      <circle
        cx="17.5"
        cy="6.5"
        r="1"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-[#00FF66]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="11"
        rx="2"
      />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#050505]">

      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#FFEA00]/40 to-transparent" />

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

            <p className="mt-3 max-w-xs text-[12px] font-medium uppercase leading-relaxed tracking-[0.18em] text-white/50">
              Orgulho de vestir o que nos move.
            </p>

            <div className="mt-6 h-px w-12 bg-[#FFEA00]" />

            <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
              Qualidade Premium
            </p>

          </div>

          {/* LOJA */}
          <div>

            <h3 className="text-[12px] font-black uppercase tracking-[0.22em] text-white">
              Loja
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <Link
                href="/"
                className="text-[12px] font-medium tracking-[0.08em] text-[#A1A1AA] transition-colors duration-200 hover:text-[#FFEA00]"
              >
                Início
              </Link>

              <Link
                href="/produtos?tipo=CAMISAS"
                className="text-[12px] font-medium tracking-[0.08em] text-[#A1A1AA] transition-colors duration-200 hover:text-[#FFEA00]"
              >
                Camisas
              </Link>

              <Link
                href="/produtos?ordem=LANCAMENTOS"
                className="text-[12px] font-medium tracking-[0.08em] text-[#A1A1AA] transition-colors duration-200 hover:text-[#FFEA00]"
              >
                Lançamentos
              </Link>

              <Link
                href="/produtos?promocao=1"
                className="text-[12px] font-medium tracking-[0.08em] text-[#A1A1AA] transition-colors duration-200 hover:text-[#FFEA00]"
              >
                Promoções
              </Link>

            </div>

          </div>

          {/* ATENDIMENTO */}
          <div>

            <h3 className="text-[12px] font-black uppercase tracking-[0.22em] text-white">
              Atendimento
            </h3>

            <div className="mt-5 flex flex-col gap-4">

              <a
                href="https://wa.me/5542999249903"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#00FF66]/20 bg-[#00FF66]/[0.06] transition group-hover:border-[#00FF66]/40 group-hover:bg-[#00FF66]/[0.10]">
                  <span className="text-[#00FF66]">
                    <WhatsAppIcon />
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#00FF66]">
                    Atendimento
                  </p>

                  <span className="text-[12px] font-bold tracking-[0.06em] text-white/80 transition-colors duration-200 group-hover:text-white">
                    (42) 99924-9903
                  </span>
                </div>
              </a>

              <a
                href="https://instagram.com/blmantos2"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E1306C]/25 bg-[#E1306C]/[0.07] text-[#E1306C] transition group-hover:border-[#E1306C]/45 group-hover:bg-[#E1306C]/[0.12]">
                  <InstagramIcon />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#E1306C]">
                    Instagram
                  </p>

                  <span className="text-[12px] font-bold tracking-[0.06em] text-white/80 transition-colors duration-200 group-hover:text-white">
                    @blmantos2
                  </span>
                </div>
              </a>

            </div>

          </div>

          {/* SEGURANÇA */}
          <div>

            <h3 className="text-[12px] font-black uppercase tracking-[0.22em] text-white">
              Segurança
            </h3>

            <div className="mt-5 flex flex-col gap-4">

              {/* PAGAMENTO */}
              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
                  Pagamento
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">

                  <span className="flex h-8 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 text-white/75 transition-colors duration-200 hover:border-white/[0.16]">

                    <span className="text-[#32BCAD]">
                      <PixIcon />
                    </span>

                    <span className="text-[10px] font-black uppercase tracking-[0.08em]">
                      PIX
                    </span>

                  </span>

                  <span className="flex h-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 text-white/75 transition-colors duration-200 hover:border-white/[0.16]">
                    <VisaIcon />
                  </span>

                  <span className="flex h-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035] px-2.5 text-white/75 transition-colors duration-200 hover:border-white/[0.16]">
                    <MastercardIcon />
                  </span>

                </div>

              </div>

              {/* COMPRA SEGURA */}
              <div className="flex items-center gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#00FF66]/15 bg-[#00FF66]/[0.05]">
                  <LockIcon />
                </div>

                <div>

                  <p className="text-[11px] font-black uppercase tracking-[0.12em] text-white/75">
                    Compra 100% Segura
                  </p>

                  <p className="mt-1 text-[10px] tracking-[0.05em] text-white/35">
                    Ambiente protegido
                  </p>

                </div>

              </div>

              <Link
                href="/trocas-e-devolucoes"
                className="text-[12px] font-medium tracking-[0.06em] text-white/70 transition-colors duration-200 hover:text-[#FFEA00]"
              >
                Trocas e devoluções
              </Link>

              <Link
                href="/politica-de-privacidade"
                className="text-[12px] font-medium tracking-[0.06em] text-white/70 transition-colors duration-200 hover:text-[#FFEA00]"
              >
                Política de privacidade
              </Link>

            </div>

          </div>

        </div>

        <div className="my-10 h-px bg-white/[0.07]" />

        <div className="flex flex-col gap-5 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/50">
              © 2026 BL Mantos. Todos os direitos reservados.
            </p>

            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
              Ponta Grossa - PR
            </p>

          </div>

          <div className="text-left sm:text-right">

            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/55">
              Atendimento 100% Humano
            </p>

            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#00FF66]">
              Envio para todo o Brasil
            </p>

          </div>

        </div>

      </div>

    </footer>
  );
}
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative min-h-[680px] overflow-hidden bg-[#050505]">

      {/* =====================================================
          IMAGEM PRINCIPAL
      ====================================================== */}

      <div className="absolute inset-0">

        <img
          src="/images/hero-bl-mantos.png"
          alt="Coleção de camisas BL Mantos"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            object-[58%_center]
          "
        />

        {/* Escurece o lado esquerdo para o texto */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-[#050505]
            via-[#050505]/80
            via-[42%]
            to-transparent
          "
        />

        {/* Escurecimento inferior */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-48
            bg-gradient-to-t
            from-[#050505]
            to-transparent
          "
        />

        {/* Leve tom da identidade BL Mantos */}
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_70%_50%,rgba(255,234,0,0.06),transparent_38%)]
          "
        />

      </div>


      {/* =====================================================
          CONTEÚDO
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[680px]
          max-w-7xl
          items-center
          px-6
          pb-16
          pt-28
        "
      >

        <div className="max-w-[510px]">

          {/* Categoria */}

          <div className="mb-6 flex items-center gap-3">

            <span className="h-[2px] w-10 bg-[#FFEA00]" />

            <span
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.3em]
                text-[#FFEA00]
              "
            >
              Nova coleção
            </span>

          </div>


          {/* Título */}

          <h1
            className="
              text-6xl
              font-black
              uppercase
              leading-[0.82]
              tracking-[-0.06em]
              text-white
              sm:text-7xl
              md:text-[88px]
            "
          >
            Vista
            <br />

            <span className="text-[#FFEA00]">
              o jogo.
            </span>
          </h1>


          {/* Descrição */}

          <p
            className="
              mt-8
              max-w-[390px]
              text-base
              leading-relaxed
              text-white/65
              md:text-lg
            "
          >
            Camisas premium para quem vive futebol.
            Encontre seu próximo manto na BL Mantos.
          </p>


          {/* CTA */}

          <div className="mt-9">
            <Button>
              Ver camisas
            </Button>
          </div>


          {/* =====================================================
    ASSINATURA BL MANTOS
====================================================== */}

<div
  className="
    absolute
    bottom-0
    left-0
    right-0
    z-20
    border-t
    border-white/10
    bg-[#050505]/75
    backdrop-blur-md
  "
>
  <div
    className="
      mx-auto
      flex
      max-w-7xl
      items-center
      justify-between
      px-6
      py-4
    "
  >

    <div className="flex items-center gap-3">

      <span
        className="
          h-2
          w-2
          animate-pulse
          rounded-full
          bg-[#00FF66]
          shadow-[0_0_10px_#00FF66]
        "
      />

      <span
        className="
          text-[10px]
          font-bold
          uppercase
          tracking-[0.25em]
          text-white/60
        "
      >
        Coleção disponível
      </span>

    </div>


    <p
      className="
        text-xs
        font-bold
        tracking-[0.08em]
        text-white
        sm:text-sm
      "
    >
      Orgulho de vestir
      <span className="ml-1 text-[#FFEA00]">
        o que nos move.
      </span>
    </p>

  </div>
</div>

        </div>

      </div>


      {/* =====================================================
          MARCADOR INFERIOR
      ====================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          z-20
          border-t
          border-white/10
          bg-[#050505]/50
          backdrop-blur-sm
        "
      >

        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            px-6
            py-3
          "
        >

          <div className="flex items-center gap-3">

            <span className="h-2 w-2 animate-pulse rounded-full bg-[#00FF66] shadow-[0_0_10px_#00FF66]" />

            <span
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.25em]
                text-white/50
              "
            >
              Coleção disponível
            </span>

          </div>


          <span
            className="
              hidden
              text-[9px]
              font-bold
              uppercase
              tracking-[0.25em]
              text-white/30
              sm:block
            "
          >
            Orgulho de vestir o que nos move.
          </span>

        </div>

      </div>

    </section>
  );
}
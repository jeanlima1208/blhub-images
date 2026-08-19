import Image from "next/image";

const categories = [
  {
    title: "Times",
    subtitle: "Clubes que você veste.",
    image: "/images/categories/times.png",
    action: "Ver camisas",
  },
  {
    title: "Seleções",
    subtitle: "Vista seu país.",
    image: "/images/categories/selecoes.png",
    action: "Ver camisas",
  },
  {
    title: "Lançamentos",
    subtitle: "Os novos mantos chegaram.",
    image: "/images/categories/lancamentos.png",
    action: "Ver lançamentos",
  },
  {
    title: "Promoções",
    subtitle: "Mantos selecionados com preço especial.",
    image: "/images/categories/promocoes.png",
    action: "Ver ofertas",
    highlight: true,
  },
];

export default function Categories() {
  return (
    <section className="bg-[#050505] px-6 py-24">
      <div className="mx-auto max-w-7xl">

        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-10 bg-[#FFEA00]" />

            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#FFEA00]">
              Categorias
            </span>
          </div>

          <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-white md:text-6xl">
            Encontre seu
            <br />
            <span className="text-[#FFEA00]">
              próximo manto.
            </span>
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              {...category}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

function CategoryCard({
  title,
  subtitle,
  image,
  action,
  highlight,
}: {
  title: string;
  subtitle: string;
  image: string;
  action: string;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      className={`
        group
        relative
        h-[340px]
        w-full
        overflow-hidden
        border
        text-left
        transition-all
        duration-500
        ${
          highlight
            ? "border-[#FFEA00]/30 bg-[#11100a]"
            : "border-white/10 bg-[#101010]"
        }
        hover:border-[#FFEA00]/50
      `}
    >
      {/* Iluminação */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_75%_45%,rgba(255,234,0,.13),transparent_42%)]
          opacity-60
          transition
          duration-500
          group-hover:opacity-100
        "
      />

      {/* Imagem */}
      <div
        className="
          absolute
          right-[-35px]
          top-1/2
          h-[330px]
          w-[68%]
          -translate-y-1/2
          transition-all
          duration-700
          group-hover:scale-105
          group-hover:translate-x-[-8px]
        "
      >
        <Image
          src={image}
          alt={`${title} - BL Mantos`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="
            object-contain
            object-right
            drop-shadow-[0_25px_35px_rgba(0,0,0,0.55)]
          "
        />
      </div>

      {/* Degradê */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-r
          from-[#101010]
          via-[#101010]/90
          to-transparent
        "
      />

      {/* Conteúdo */}
      <div
        className="
          relative
          z-10
          flex
          h-full
          max-w-[58%]
          flex-col
          justify-between
          p-8
        "
      >
        <div>
          <p
            className={`
              mb-3
              text-[10px]
              font-black
              uppercase
              tracking-[0.25em]
              ${
                highlight
                  ? "text-[#FFEA00]"
                  : "text-white/35"
              }
            `}
          >
            Categoria
          </p>

          <h3
            className="
              text-4xl
              font-black
              uppercase
              leading-[0.9]
              tracking-[-0.05em]
              text-white
              md:text-5xl
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-4
              max-w-[230px]
              text-sm
              leading-relaxed
              text-white/45
            "
          >
            {subtitle}
          </p>
        </div>

        {/* CTA */}
        <div
          className="
            flex
            items-center
            gap-3
            text-xs
            font-black
            uppercase
            tracking-[0.16em]
            text-white
            transition-colors
            duration-300
            group-hover:text-[#FFEA00]
          "
        >
          <span>{action}</span>

          <span
            className="
              transition-transform
              duration-300
              group-hover:translate-x-2
            "
          >
            →
          </span>
        </div>
      </div>

      {/* Linha inferior */}
      <div
        className="
          absolute
          bottom-0
          left-0
          h-[2px]
          w-0
          bg-[#FFEA00]
          shadow-[0_0_12px_#FFEA00]
          transition-all
          duration-500
          group-hover:w-full
        "
      />
    </button>
  );
}
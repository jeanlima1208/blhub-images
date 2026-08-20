import Link from "next/link";

const categories = [
  {
    title: "Times Nacionais",
    subtitle: "Os maiores clubes do Brasil.",
    image: "/images/categories/times-nacionais.png",
    action: "Ver camisas",
    href: "/produtos?categoria=Brasileiros",
  },
  {
    title: "Times Europeus",
    subtitle: "Os grandes clubes da Europa.",
    image: "/images/categories/times-europeus.png",
    action: "Ver camisas",
    href: "/produtos?categoria=Europeus",
  },
  {
    title: "Seleções",
    subtitle: "Vista seu país.",
    image: "/images/categories/selecoes.png",
    action: "Ver camisas",
    href: "/produtos?categoria=Seleções",
  },
  {
    title: "Outros Continentes",
    subtitle: "Mantos de clubes de todo o mundo.",
    image: "/images/categories/outros-continentes.png",
    action: "Ver camisas",
    href: "/produtos?categoria=Outros",
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
  href,
  highlight,
}: {
  title: string;
  subtitle: string;
  image: string;
  action: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        group
        relative
        block
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
      {/* Imagem de fundo */}
      <div
        className="
          absolute
          inset-0
          bg-cover
          bg-center
          bg-no-repeat
          transition-transform
          duration-700
          group-hover:scale-[1.03]
        "
        style={{
          backgroundImage: `url("${image}")`,
        }}
        aria-hidden="true"
      />

      {/* Escurecimento geral */}
      <div className="pointer-events-none absolute inset-0 bg-black/15" />

      {/* Degradê para leitura do texto */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-r
          from-[#050505]/95
          via-[#050505]/55
          to-transparent
        "
      />

      {/* Iluminação */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_80%_45%,rgba(255,234,0,.10),transparent_38%)]
          opacity-70
          transition
          duration-500
          group-hover:opacity-100
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
                  : "text-white/50"
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
              text-white/60
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
    </Link>
  );
}
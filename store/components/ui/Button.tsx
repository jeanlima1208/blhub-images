type Props = {
  children: React.ReactNode;
};

export default function Button({ children }: Props) {
  return (
    <button
      className="
        group
        relative
        inline-flex
        items-center
        gap-6
        overflow-hidden
        bg-[#FFEA00]
        px-7
        py-4
        text-sm
        font-black
        uppercase
        tracking-[0.14em]
        text-black
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_15px_45px_rgba(255,234,0,0.28)]
      "
    >

      {/* brilho passando */}

      <span
        className="
          absolute
          inset-y-0
          -left-10
          w-8
          rotate-[20deg]
          bg-white/50
          blur-sm
          transition-all
          duration-700
          group-hover:left-[120%]
        "
      />

      {/* texto */}

      <span className="relative z-10">
        {children}
      </span>

      {/* seta */}

      <span
        className="
          relative
          z-10
          flex
          h-7
          w-7
          items-center
          justify-center
          border
          border-black/20
          transition-transform
          duration-300
          group-hover:translate-x-1
        "
      >
        →
      </span>

    </button>
  );
}
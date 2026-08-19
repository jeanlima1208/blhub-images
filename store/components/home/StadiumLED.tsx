"use client";

import { useEffect, useState } from "react";

const messages = [
  "ENTREGA RÁPIDA EM PG",
  "ENVIO PARA TODO O BRASIL",
  "QUALIDADE PREMIUM",
];

export default function StadiumLED() {
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((value) => !value);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const blinkClass = blink ? "opacity-100" : "opacity-40";

  return (
    <div className="relative h-[38px] w-full overflow-hidden border-t border-white/[0.04] bg-[#050600]">

      {/* TEXTURA LED */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,234,0,0.9) 1px, transparent 1px)",
          backgroundSize: "5px 5px",
        }}
      />

      {/* BRILHO CENTRAL */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,234,0,.07),transparent_65%)]" />

      {/* IDENTIDADE */}
      <div className="absolute left-0 top-0 z-20 flex h-full items-center bg-[#050600] pl-5 pr-7 sm:pl-8">
        <div className="flex items-center gap-2.5">
          <span
            className={
              "h-[5px] w-[5px] rounded-full bg-[#FFEA00] shadow-[0_0_8px_#FFEA00] transition-opacity duration-300 " +
              blinkClass
            }
          />

          <span className="text-[7px] font-black uppercase tracking-[0.28em] text-[#FFEA00]/65">
            BL Mantos
          </span>
        </div>
      </div>

      {/* MENSAGENS */}
      <div className="absolute inset-0 flex items-center">
        <div
          className="
            flex
            w-max
            items-center
            whitespace-nowrap
            pl-36
            animate-[ledScroll_42s_linear_infinite]
            hover:[animation-play-state:paused]
          "
        >
          {[...messages, ...messages].map((message, index) => (
            <div
              key={`${message}-${index}`}
              className="flex items-center"
            >
              <span className="mx-7 text-[8px] font-bold uppercase tracking-[0.24em] text-[#FFEA00]/75 sm:text-[9px]">
                {message}
              </span>

              <span className="text-[5px] text-[#FFEA00]/30">
                ◆
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MÁSCARAS */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#050600] via-[#050600]/90 to-transparent" />

      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#050600] to-transparent" />
    </div>
  );
}

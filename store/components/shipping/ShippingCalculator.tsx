"use client";

import { useState } from "react";

type ShippingOption = {
  id: string;
  service_id: string;
  name: string;
  company: string;
  company_id?: number | null;
  price: number;
  delivery_time: number;
  delivery_range?: {
    min?: number;
    max?: number;
  } | null;
  type: "LOCAL" | "MELHOR_ENVIO";
};

type ShippingCalculatorProps = {
  itemCode: string;
  price: number;
};

export default function ShippingCalculator({
  itemCode,
  price,
}: ShippingCalculatorProps) {
  const [postalCode, setPostalCode] = useState("");
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function formatCep(value: string) {
    const numbers = value
      .replace(/\D/g, "")
      .slice(0, 8);

    if (numbers.length <= 5) {
      return numbers;
    }

    return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
  }

  function handleCepChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setPostalCode(
      formatCep(event.target.value)
    );

    setOptions([]);
    setError("");
  }

  async function calculateShipping() {
    const cep = postalCode.replace(/\D/g, "");

    if (cep.length !== 8) {
      setError("Digite um CEP válido.");
      setOptions([]);
      return;
    }

    setLoading(true);
    setError("");
    setOptions([]);

    try {
      const response = await fetch(
        "/api/shipping/calculate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postal_code: cep,
            items: [
              {
                item_code: itemCode,
                price,
                quantity: 1,
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.error ||
            "Não foi possível calcular o frete."
        );
      }

      if (
        !data?.success ||
        !Array.isArray(data?.options)
      ) {
        throw new Error(
          "Nenhuma opção de frete encontrada."
        );
      }

      if (data.options.length === 0) {
        throw new Error(
          "Nenhuma opção de frete disponível para este CEP."
        );
      }

      setOptions(data.options);
    } catch (error) {
      console.error(
        "Erro ao calcular frete:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível calcular o frete."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatPrice(value: number) {
    return value
      .toFixed(2)
      .replace(".", ",");
  }

  function formatDelivery(
    option: ShippingOption
  ) {
    const min =
      option.delivery_range?.min;

    const max =
      option.delivery_range?.max;

    if (
      typeof min === "number" &&
      typeof max === "number"
    ) {
      if (min === max) {
        return `${min} dia${
          min === 1 ? "" : "s"
        }`;
      }

      return `${min}–${max} dias`;
    }

    if (option.delivery_time > 0) {
      return `${option.delivery_time} dia${
        option.delivery_time === 1
          ? ""
          : "s"
      }`;
    }

    return "Prazo não informado";
  }

  return (
    <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-5">

      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/70">
            Calcule o frete
          </p>

          <p className="mt-1 text-[10px] text-white/40">
            Consulte o prazo e as opções de entrega para seu CEP.
          </p>
        </div>

        <span className="text-[9px] font-black uppercase tracking-wider text-[#00FF66]">
          Envio nacional
        </span>

      </div>

      <div className="mt-4 flex gap-2">

        <input
          type="text"
          inputMode="numeric"
          value={postalCode}
          onChange={handleCepChange}
          maxLength={9}
          placeholder="00000-000"
          aria-label="CEP"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              calculateShipping();
            }
          }}
          className="h-11 min-w-0 flex-1 rounded-lg border border-white/[0.10] bg-[#111111] px-4 text-xs font-bold text-white outline-none placeholder:text-white/25 focus:border-[#FFEA00]/60"
        />

        <button
          type="button"
          onClick={calculateShipping}
          disabled={loading}
          className="h-11 rounded-lg border border-[#FFEA00]/40 bg-[#FFEA00]/[0.08] px-5 text-[9px] font-black uppercase tracking-[0.16em] text-[#FFEA00] transition hover:border-[#FFEA00] hover:bg-[#FFEA00] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Calculando..."
            : "Calcular"}
        </button>

      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-400/15 bg-red-400/[0.04] px-4 py-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-red-300">
            {error}
          </p>
        </div>
      )}

      {options.length > 0 && (
        <div className="mt-4 space-y-2">

          <p className="mb-2 text-[8px] font-black uppercase tracking-[0.18em] text-white/35">
            Opções de entrega
          </p>

          {options.map((option) => (
            <div
              key={`${option.id}-${option.company}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3"
            >

              <div className="min-w-0">

                <p className="truncate text-[10px] font-black uppercase tracking-[0.08em] text-white">
                  {option.company}
                </p>

                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.08em] text-white/40">
                  {option.name}
                  {" · "}
                  {formatDelivery(option)}
                </p>

              </div>

              <p className="shrink-0 text-sm font-black text-white">
                R$ {formatPrice(option.price)}
              </p>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
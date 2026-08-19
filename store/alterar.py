from pathlib import Path
import re

p = Path(r"app\produto\[codigo]\page.tsx")
s = p.read_text(encoding="utf-8")

s = s.replace(
"""const availableSizes =
product.availableSizes?.filter(
(size) => !size.includes("|ZERADO")
) ?? [];""",
"""const availableSizes =
product.availableSizes ?? [];""",
1)

pattern = re.compile(
r"""\{availableSizes\.map\(\(size\) => \(
.*?
\{size\}
.*?
\)\)\}""",
re.S
)

replacement = """{availableSizes.map((sizeData) => {
                  const [size, quantityText] = sizeData.split("|");
                  const quantity = Number(quantityText ?? 0);
                  const available = quantity > 0;

                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!available}
                      className={`min-w-[64px] rounded-lg border px-3 py-2 text-center transition ${
                        available
                          ? "border-white/10 bg-[#0A0A0A] hover:border-[#FFEA00] hover:bg-[#FFEA00] hover:text-black"
                          : "cursor-not-allowed border-white/[0.05] bg-white/[0.02] opacity-40"
                      }`}
                    >
                      <span className="block text-[10px] font-black uppercase">
                        {size}
                      </span>

                      <span
                        className={`mt-1 block text-[8px] font-bold uppercase tracking-wider ${
                          available
                            ? "text-[#00FF66]"
                            : "text-red-400"
                        }`}
                      >
                        {available
                          ? `${quantity} ${
                              quantity === 1 ? "unidade" : "unidades"
                            }`
                          : "Esgotado"}
                      </span>
                    </button>
                  );
                })}"""

s, count = pattern.subn(replacement, s, count=1)

if count != 1:
    raise SystemExit("ERRO: bloco dos tamanhos nao encontrado")

p.write_text(s, encoding="utf-8")

print("OK - ProductPage atualizada")

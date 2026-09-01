import Link from "next/link";
import { getBestSellers } from "@/services/products";

function getEffectivePrice(product: any): number {
  const sitePrice =
    product?.site_price != null
      ? Number(product.site_price)
      : null;

  const promotionalPrice =
    product?.promotional_price != null
      ? Number(product.promotional_price)
      : null;

  if (
    product?.promotion_active === true &&
    promotionalPrice != null &&
    promotionalPrice > 0
  ) {
    return promotionalPrice;
  }

  if (sitePrice != null && sitePrice > 0) {
    return sitePrice;
  }

  return Number(product?.price ?? 0);
}

function hasActivePromotion(product: any): boolean {
  const sitePrice =
    product?.site_price != null
      ? Number(product.site_price)
      : Number(getEffectivePrice(product));

  const promotionalPrice =
    product?.promotional_price != null
      ? Number(product.promotional_price)
      : 0;

  return (
    product?.promotion_active === true &&
    promotionalPrice > 0 &&
    promotionalPrice < sitePrice
  );
}

const CUSTOMER_INSTALLMENT_RATE_3X = 0.11225;

export default async function FeaturedProducts() {
  const products = await getBestSellers();

  return (
    <section className="relative z-10 border-t border-white/[0.06] bg-[#050505] px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-7xl">

        {/* CABEÇALHO */}

        <div className="mb-10 flex items-end justify-between gap-6">

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#FFEA00]">
              Curadoria BL Mantos
            </p>

            <h2 className="text-3xl font-black uppercase text-white md:text-5xl">
              Mais vendidos
            </h2>

            <p className="mt-3 text-sm text-white/40">
              Os mantos que estão chamando atenção.
            </p>
          </div>

          <Link
            href="/produtos"
            className="hidden shrink-0 text-xs font-bold uppercase tracking-[0.2em] text-white/60 transition hover:text-[#FFEA00] md:block"
          >
            Ver todos →
          </Link>

        </div>

        {/* PRODUTOS */}

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">

          {products.slice(0, 4).map((product) => {

            const productPrice = Number(
              getEffectivePrice(product)
            );

            const installment3x =
              (
                (productPrice *
                  (1 +
                    CUSTOMER_INSTALLMENT_RATE_3X)) /
                3
              )
                .toFixed(2)
                .replace(".", ",");

            return (
              <Link
                key={product.item_code}
                href={`/produto/${product.item_code}`}
                className="group"
              >

                <article>

                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111] transition duration-300 group-hover:border-white/[0.18]">

                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.item_name}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                      />
                    ) : (
                      <div
                        className="
                          absolute
                          inset-0
                          flex
                          items-center
                          justify-center
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-[0.2em]
                          text-white/20
                        "
                      >
                        Sem imagem
                      </div>
                    )}

                    <span
                      className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        translate-y-full
                        bg-[#FFEA00]
                        px-4
                        py-4
                        text-center
                        text-xs
                        font-black
                        uppercase
                        tracking-[0.15em]
                        text-black
                        transition-transform
                        duration-300
                        group-hover:translate-y-0
                      "
                    >
                      Ver produto →
                    </span>

                  </div>

                  <div className="pt-4">

                    <h3 className="truncate text-sm font-bold uppercase text-white">
                      {product.item_name}
                    </h3>

                    <p className="mt-2 text-lg font-black text-white">
                      R${" "}
                      {productPrice
                        .toFixed(2)
                        .replace(".", ",")}
                    </p>

                    <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.14em] text-white/40">
                      3x de R$ {installment3x}
                    </p>

                  </div>

                </article>

              </Link>
            );
          })}

        </div>

        {/* BOTÃO MOBILE */}

        <div className="mt-10 flex justify-center md:hidden">

          <Link
            href="/produtos"
            className="rounded-lg border border-[#FFEA00]/40 bg-[#FFEA00]/[0.06] px-6 py-3 text-[9px] font-black uppercase tracking-[0.18em] text-[#FFEA00] transition hover:border-[#FFEA00] hover:bg-[#FFEA00] hover:text-black"
          >
            Ver todas as camisas →
          </Link>

        </div>

      </div>
    </section>
  );
}
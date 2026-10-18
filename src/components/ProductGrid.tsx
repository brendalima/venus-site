import type { Product } from "../types";
import { ProductCard } from "./ProductCard";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import "./ProductGrid.css";

/** Quantos cards carregam com prioridade (aproximadamente a primeira dobra). */
const PRIORITY_COUNT = 4;

export function ProductGrid({ products }: { products: Product[] }) {
  const { visible, hasMore, showMore, sentinelRef } = useInfiniteScroll(
    products.length,
    4,
  );

  const shown = products.slice(0, visible);

  return (
    <section className="page catalog" aria-labelledby="catalog-title">
      <div className="catalog__head">
        <h2 className="catalog__title" id="catalog-title">
          Coleção
        </h2>
        <span className="catalog__count">
          {visible} de {products.length}
        </span>
      </div>

      <div className="grid">
        {shown.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            index={i}
            priority={i < PRIORITY_COUNT}
          />
        ))}
      </div>

      {/* Anuncia a chegada de novos produtos para leitores de tela. */}
      <p aria-live="polite" className="visually-hidden">
        Mostrando {visible} de {products.length} produtos
      </p>

      {hasMore ? (
        <>
          <div ref={sentinelRef} aria-hidden="true" />
          <div className="catalog__more">
            <button type="button" className="catalog__button" onClick={showMore}>
              Ver mais peças
            </button>
          </div>
        </>
      ) : (
        <p className="catalog__end">Fim da coleção</p>
      )}
    </section>
  );
}

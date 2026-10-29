import type { Product } from "../types";
import { tituloDoCatalogo } from "../lib/colecao";
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

  // Pelo catálogo inteiro, e não pelos `shown`: assim a altura do card
  // não muda quando o scroll infinito traz a próxima leva, que seria
  // layout shift em cima do que já está na tela. Ver ProductCard.
  const reservas = {
    preco: products.some((p) => p.priceCents !== undefined),
    cores: products.some((p) => p.colours.length > 1),
  };

  const colecao = tituloDoCatalogo(products);

  // id="colecao" é a âncora do menu do cabeçalho e da volta na página da
  // peça.
  return (
    <section
      className="page catalog"
      id="colecao"
      aria-labelledby="catalog-title"
    >
      <div className="secao__cabeca">
        {/* Só o título vem da coleção: a grade continua sendo uma só,
            com as peças de todas. */}
        <h2 className="secao__titulo" id="catalog-title">
          {colecao}
        </h2>
        <div>
          <p className="secao__linha">
            Com modelagens marcantes, cores cuidadosamente selecionadas e
            detalhes que fazem a diferença valorizando a beleza natural e a
            singularidade de cada corpo.
          </p>
          <p className="secao__linha">
            Passe o dedo ou o mouse sobre a peça para ver os outros ângulos.
          </p>
        </div>
      </div>
      <div className="grid">
        {shown.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            index={i}
            priority={i < PRIORITY_COUNT}
            reservas={reservas}
          />
        ))}
      </div>
      <p aria-live="polite" className="visually-hidden">
        Mostrando {visible} de {products.length} produtos
      </p>
      {hasMore ? (
        <>
          <div ref={sentinelRef} aria-hidden="true" />
          <div className="catalog__more">
            <button
              type="button"
              className="catalog__button"
              onClick={showMore}
            >
              Ver mais peças
            </button>
          </div>
        </>
      ) : null}{" "}
    </section>
  );
}

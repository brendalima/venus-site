import { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../types";
import { formatBRL } from "../lib/format";
import { PlaceholderImage } from "./PlaceholderImage";
import "./ProductCard.css";

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "M15 5 8 12l7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

type Props = {
  product: Product;
  /** Posição no grid — usada pelo placeholder para variar a cor. */
  index: number;
  /** Primeiros cards do grid carregam com prioridade; o resto é lazy. */
  priority?: boolean;
};

export function ProductCard({ product, index, priority = false }: Props) {
  const { slug, name, priceCents, sizes, images, description, soldOut } = product;
  const [active, setActive] = useState(0);

  const href = `/produto/${slug}`;
  const current = images[active];

  return (
    <article className={soldOut ? "card card--esgotada" : "card"}>
      <div className="card__media">
        {/* O link envolve só a imagem. Os controles de perspectiva ficam
            como irmãos, nunca dentro da âncora: botão dentro de link é
            HTML inválido e confunde leitor de tela. */}
        <Link
          to={href}
          className="card__link"
          aria-label={soldOut ? `Ver ${name} — esgotado` : `Ver ${name}`}
        >
          {current ? (
            <img
              src={current.src}
              alt={`${name} — foto ${active + 1}`}
              width={784}
              height={1168}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={priority ? "high" : "auto"}
            />
          ) : (
            <PlaceholderImage slug={slug} name={name} index={index} />
          )}
        </Link>

        {/* Decoração pura: animação de onda no rodapé da foto, no hover.
            aria-hidden porque não carrega informação nenhuma. */}
        <span className="card__wave" aria-hidden="true">
          <span className="card__wave-layer card__wave-layer--back" />
          <span className="card__wave-layer card__wave-layer--front" />
        </span>

        {/* A peça esgotada continua clicável: catálogo pequeno, e quem
            chegou por link do Instagram ainda quer ver a peça e
            perguntar no WhatsApp se ela volta. O que muda é a foto
            esmaecida, a tarja e as setas desabilitadas. */}
        {soldOut && <span className="card__flag">Esgotado</span>}

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="card__nav card__nav--prev"
              aria-label={`${name}: foto anterior`}
              disabled={soldOut}
              onClick={() => setActive((i) => (i - 1 + images.length) % images.length)}
            >
              <Chevron direction="left" />
            </button>
            <button
              type="button"
              className="card__nav card__nav--next"
              aria-label={`${name}: próxima foto`}
              disabled={soldOut}
              onClick={() => setActive((i) => (i + 1) % images.length)}
            >
              <Chevron direction="right" />
            </button>

            {/* Sem isso, quem usa leitor de tela clica na seta e não recebe
                retorno nenhum de que a foto mudou. As fotos não têm mais
                rótulo de ângulo, então a posição é o que dá para anunciar. */}
            <p aria-live="polite" className="visually-hidden">
              Foto {active + 1} de {images.length}
            </p>
          </>
        )}
      </div>

      <div className="card__body">
        <h3 className="card__name">
          <Link to={href}>{name}</Link>
        </h3>

        {description && <p className="card__desc">{description}</p>}

        {/* Empurrado para a base para que preço e tamanhos fiquem
            alinhados entre cards de descrição com alturas diferentes. */}
        <div className="card__foot">
          {/* Peça ainda sem preço não mostra preço nenhum: as donas
              catalogam antes de precificar, e "R$ 0,00" seria mentira. */}
          {priceCents !== undefined && (
            <p className="card__price">{formatBRL(priceCents)}</p>
          )}

          <ul className="card__sizes" aria-label={`Tamanhos de ${name}`}>
            {sizes.map((size) => (
              <li key={size} className="card__size">
                {size}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

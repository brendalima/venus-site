import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { findProduct } from "../data/products";
import { formatBRL } from "../lib/format";
import { PlaceholderImage } from "./PlaceholderImage";
import { NotFound } from "./NotFound";
import { Logo } from "./Logo";
import "./ProductPage.css";

export function ProductPage() {
  const { slug } = useParams();
  const product = findProduct(slug);
  const [active, setActive] = useState(0);

  // Trocar de produto sem voltar ao topo deixa a pessoa no meio da página
  // nova, sem contexto do que está vendo.
  useEffect(() => {
    window.scrollTo(0, 0);
    setActive(0);
  }, [slug]);

  useEffect(() => {
    if (product) document.title = `${product.name} — Vênus Oasis`;
    return () => {
      document.title = "Vênus Oasis — Moda praia";
    };
  }, [product]);

  if (!product) return <NotFound />;

  const { name, priceCents, sizes, images, description, details, soldOut } = product;
  const current = images[active];

  return (
    <div className={`page product${soldOut ? " product--esgotada" : ""}`}>
      <nav className="product__top brand-rule brand-rule--bottom">
        <Link
          to="/"
          className="product__home"
          aria-label="Vênus Oasis — página inicial"
        >
          <Logo size="sm" alt="" />
        </Link>
        <Link to="/" className="product__back">
          ← Voltar para a coleção
        </Link>
      </nav>

      <div className="product__layout">
        <div className="product__gallery">
          <div className="product__stage">
            {current ? (
              <img
                src={current.srcGrande}
                alt={`${name} — foto ${active + 1}`}
                width={784}
                height={1168}
                decoding="async"
              />
            ) : (
              <PlaceholderImage slug={product.slug} name={name} index={0} />
            )}
            {soldOut && <span className="product__flag">Esgotado</span>}
          </div>

          {images.length > 1 && (
            <div
              className="product__thumbs"
              role="group"
              aria-label={`Fotos de ${name}`}
            >
              {images.map((image, i) => (
                <button
                  key={image.src}
                  type="button"
                  className={`product__thumb ${i === active ? "is-active" : ""}`}
                  aria-label={`Foto ${i + 1} de ${name}`}
                  aria-pressed={i === active}
                  disabled={soldOut}
                  onClick={() => setActive(i)}
                >
                  <img
                    src={image.src}
                    alt=""
                    width={784}
                    height={1168}
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product__info">
          <h1 className="product__name">{name}</h1>

          {description && <p className="product__desc">{description}</p>}

          {/* Sem preço, nada aqui — ver o comentário em ProductCard. */}
          {priceCents !== undefined && (
            <p className="product__price">{formatBRL(priceCents)}</p>
          )}

          <div className="product__block">
            <h2 className="product__label">Tamanhos</h2>
            <ul className="product__sizes">
              {sizes.map((size) => (
                <li key={size} className="product__size">
                  {size}
                </li>
              ))}
            </ul>
          </div>

          {details && details.length > 0 && (
            <div className="product__block">
              <h2 className="product__label">Detalhes</h2>
              <ul className="product__details">
                {details.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Sem condicional no preço: o convite a entrar em contato serve
              tanto para a peça precificada quanto para a que ainda não foi. */}
          <p className="product__note">
            {/* O aviso de esgotado vem antes e em contraste cheio: é o que
                muda a decisão de quem está lendo. */}
            {soldOut && (
              <strong className="product__esgotado">
                Esta peça está esgotada — fale com a gente para saber se
                volta.{" "}
              </strong>
            )}
            Catálogo para consulta — este site não realiza vendas. Entre em
            contato para se informar sobre preços e pagamento.
          </p>
        </div>
      </div>
    </div>
  );
}

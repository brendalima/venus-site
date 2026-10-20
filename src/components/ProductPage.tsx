import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { findProduct } from "../data/products";
import { formatBRL } from "../lib/format";
import { disponivel, quantidade } from "../lib/estoque";
import { PlaceholderImage } from "./PlaceholderImage";
import { NotFound } from "./NotFound";
import { Logo } from "./Logo";
import "./ProductPage.css";

export function ProductPage() {
  const { slug } = useParams();
  const product = findProduct(slug);
  const [cor, setCor] = useState(0);
  const [active, setActive] = useState(0);
  // Nenhum tamanho vem escolhido: a linha de disponibilidade só faz
  // sentido depois de alguém escolher, e um tamanho pré-selecionado
  // anunciaria um número que ninguém pediu.
  const [tamanho, setTamanho] = useState<string | null>(null);

  // Trocar de produto sem voltar ao topo deixa a pessoa no meio da página
  // nova, sem contexto do que está vendo.
  useEffect(() => {
    window.scrollTo(0, 0);
    setCor(0);
    setActive(0);
    setTamanho(null);
  }, [slug]);

  useEffect(() => {
    if (product) document.title = `${product.name} — Vênus Oasis`;
    return () => {
      document.title = "Vênus Oasis — Moda praia";
    };
  }, [product]);

  if (!product) return <NotFound />;

  const { name, priceCents, sizes, colours, description, details, soldOut } =
    product;

  // As fotos são da cor, não da peça: trocar a cor troca a galeria.
  const corAtual = colours[cor];
  const images = corAtual?.images ?? [];
  const current = images[active];

  function escolherCor(i: number) {
    setCor(i);
    // Outra cor, outras fotos — a de índice 3 da anterior não quer dizer
    // nada aqui. O tamanho escolhido fica: "será que o M tem no vinho?"
    // é exatamente a pergunta que o seletor existe para responder.
    setActive(0);
  }

  /**
   * A linha de disponibilidade, nas quatro situações que o dado permite.
   * Esgotado vence tudo: é chave manual das donas, por cima de qualquer
   * contagem.
   */
  function textoDisponibilidade(): string {
    if (soldOut) return "Esgotado";
    if (!corAtual || !tamanho) return "";

    const q = quantidade(corAtual, tamanho);
    // Cor que ninguém contou não vira "indisponível": a falta de
    // contagem não é falta de peça.
    if (q === undefined) return "";
    if (q === 0) return "Indisponível";
    return q === 1 ? "1 peça em estoque" : `${q} peças em estoque`;
  }

  const disponibilidade = textoDisponibilidade();

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
                alt={
                  colours.length > 1 && corAtual
                    ? `${name}, ${corAtual.name} — foto ${active + 1}`
                    : `${name} — foto ${active + 1}`
                }
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
                    className={i === active ? "brand-ring brand-ring--deep" : ""}
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

          {/* Cor antes de tamanho: é a ordem em que a escolha acontece —
              primeiro qual peça, depois se ela serve — e deixa os dois
              seletores um sobre o outro, em vez de um deles no alto da
              galeria. Quem troca a cor vê a galeria mudar ao lado (no
              desktop) ou logo acima (no celular).

              Peça de uma cor só não ganha seletor: não há escolha, e o
              backfill do admin chamou essas de "Única". */}
          {colours.length > 1 && (
            <div className="product__block">
              <h2 className="product__label">Cor</h2>
              <div
                className="product__cores"
                role="group"
                aria-label={`Cores de ${name}`}
              >
                {colours.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`product__cor ${i === cor ? "is-active brand-ring" : ""}`}
                    aria-pressed={i === cor}
                    disabled={soldOut}
                    onClick={() => escolherCor(i)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="product__block">
            <h2 className="product__label">Tamanhos</h2>
            {/* A grade inteira vira botão, inclusive o tamanho sem
                estoque: ele continua clicável de propósito, porque é
                clicando que a pessoa recebe o "Indisponível" escrito. */}
            <div className="product__sizes" role="group" aria-label="Tamanhos">
              {sizes.map((size) => {
                const tem = corAtual ? disponivel(corAtual, size) : true;
                return (
                  <button
                    key={size}
                    type="button"
                    className={`product__size ${
                      size === tamanho ? "is-active brand-ring" : ""
                    } ${tem ? "" : "product__size--fora"}`}
                    aria-pressed={size === tamanho}
                    disabled={soldOut}
                    onClick={() => setTamanho(size)}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {/* Altura reservada mesmo vazia: sem isso a linha aparece ao
                escolher um tamanho e empurra os detalhes para baixo —
                layout shift num clique, que é o pior tipo. */}
            <p className="product__disponibilidade" aria-live="polite">
              {disponibilidade}
            </p>
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
            {/* A baixa de estoque no admin não republica o site sozinha:
                entre a venda e a publicação o número aqui é o de antes.
                O aviso é a mitigação barata disso — mais honesto que
                fingir que a contagem é ao vivo. */}
            Catálogo para consulta — este site não realiza vendas.
            Quantidades e preço são informativos e podem mudar; confirme no
            WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}

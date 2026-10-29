import { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../types";
import { formatBRL } from "../lib/format";
import { disponivel } from "../lib/estoque";
import { linkWhatsApp, mensagemDaPeca } from "../lib/whatsapp";
import { useTrilhoFotos } from "../hooks/useTrilhoFotos";
import { useTransbordo } from "../hooks/useTransbordo";
import { PlaceholderImage } from "./PlaceholderImage";
import { SeletorCor } from "./SeletorCor";
import "./ProductCard.css";

type Props = {
  product: Product;
  /** Posição no grid — usada pelo placeholder para variar a cor. */
  index: number;
  /** Primeiros cards do grid carregam com prioridade; o resto é lazy. */
  priority?: boolean;
  /**
   * Linhas que o card reserva mesmo sem ter o que pôr nelas.
   *
   * Quem decide é o grid, olhando o catálogo inteiro: se **alguma** peça
   * tem preço, todo card guarda a altura da linha de preço, e o mesmo
   * para o seletor de cor. Sem isso a peça sem preço sobe a grade de
   * tamanhos e ela fica desencontrada da vizinha. Pelo catálogo e não
   * pelo card para a reserva não virar 50px de vazio em todo card quando
   * ninguém tem segunda cor.
   */
  reservas?: { preco: boolean; cores: boolean };
};

export function ProductCard({
  product,
  index,
  priority = false,
  reservas = { preco: false, cores: false },
}: Props) {
  const { slug, name, priceCents, sizes, colours, soldOut } = product;
  const [cor, setCor] = useState(0);

  const href = `/produto/${slug}`;
  // Um card por peça, não um por cor: é a cor escolhida que manda na
  // galeria.
  const corAtual = colours[cor];
  const images = corAtual?.images ?? [];

  // A chave é a cor: trocar de cor volta para a capa.
  const { trilhoRef, indice, aoRolar, aoMover, aoSair } = useTrilhoFotos(
    images.length,
    corAtual?.id ?? "",
  );

  // A grade rola na horizontal quando não cabe, para o card não crescer
  // uma fileira a mais que os vizinhos — ver useTransbordo.ts.
  const { ref: refTamanhos, transborda: tamanhosTransbordam } =
    useTransbordo<HTMLUListElement>();

  return (
    <article className={soldOut ? "card card--esgotada" : "card"}>
      <div className="card__media">
        {images.length > 0 ? (
          /* Cada foto é um link para a peça, mas fora do Tab: o nome
             embaixo já é o link do card, e quatro paradas idênticas por
             card entupiriam a navegação por teclado. Quem recebe as setas
             é o trilho. */
          <div
            className="card__trilho"
            ref={trilhoRef}
            tabIndex={0}
            role="group"
            aria-label={
              images.length > 1
                ? `Fotos de ${name} — deslize para ver as outras`
                : `Foto de ${name}`
            }
            onScroll={aoRolar}
            onPointerMove={aoMover}
            onPointerLeave={aoSair}
          >
            {images.map((image, i) => (
              <Link
                key={`${image.src}-${i}`}
                to={href}
                className="card__foto"
                tabIndex={-1}
              >
                <img
                  src={image.src}
                  alt={`${name} — foto ${i + 1}`}
                  width={784}
                  height={1168}
                  loading={priority && i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={priority && i === 0 ? "high" : "auto"}
                />
              </Link>
            ))}
          </div>
        ) : (
          <Link
            to={href}
            className="card__foto"
            aria-label={soldOut ? `Ver ${name} — esgotado` : `Ver ${name}`}
          >
            <PlaceholderImage slug={slug} name={name} index={index} />
          </Link>
        )}

        {/* A peça esgotada continua clicável, para quem ainda quer vê-la
            e perguntar se volta. O que muda é a foto esmaecida, a tarja e
            as bolinhas desabilitadas. */}
        {soldOut && <span className="card__flag">Esgotado</span>}

        {/* aria-hidden porque quem anuncia é a região viva abaixo. */}
        {images.length > 1 && (
          <div className="card__barra" aria-hidden="true">
            {images.map((image, i) => (
              <i
                key={`${image.src}-${i}`}
                className={i === indice ? "is-on" : ""}
              />
            ))}
          </div>
        )}

        {images.length > 1 && (
          <p aria-live="polite" className="visually-hidden">
            Foto {indice + 1} de {images.length}
          </p>
        )}
      </div>

      <div className="card__body">
        <h3 className="card__name">
          <Link to={href}>{name}</Link>
        </h3>

        {/* Sem linha de prosa: `description` é texto longo, e um trecho
            cortado em duas linhas de card não diz nada. */}

        {/* Empurrado para a base para preço, cores e tamanhos ficarem
            alinhados entre cards de nome com alturas diferentes. */}
        <div className="card__foot">
          {priceCents !== undefined ? (
            <p className="card__price">{formatBRL(priceCents)}</p>
          ) : (
            /* Vazia e aria-hidden: só guarda a linha para a de baixo não
               subir. */
            reservas.preco && (
              <p className="card__price card__reserva" aria-hidden="true" />
            )
          )}

          {/* O seletor fica no card__body, fora de qualquer <Link>: botão
              dentro de âncora é HTML inválido. A fileira rola na
              horizontal quando as cores não cabem, e aqui não precisa de
              tabindex porque as bolinhas já são botões. */}
          {colours.length === 1 && reservas.cores && (
            <div className="card__cores card__reserva" aria-hidden="true" />
          )}

          {colours.length > 1 && (
            <div className="card__cores">
              <SeletorCor
                colours={colours}
                escolhida={cor}
                onEscolher={setCor}
                label={`Cores de ${name}`}
                desabilitado={soldOut}
                delicada
              />
            </div>
          )}

          {/* Sem número, que é coisa da página da peça: aqui a cor só
              muda quais tamanhos estão apagados. */}
          <ul
            className="card__sizes"
            ref={refTamanhos}
            tabIndex={tamanhosTransbordam ? 0 : undefined}
            aria-label={
              corAtual && colours.length > 1
                ? `Tamanhos de ${name} em ${corAtual.name}`
                : `Tamanhos de ${name}`
            }
          >
            {sizes.map((size) => {
              const tem = corAtual ? disponivel(corAtual, size) : true;
              return (
                <li
                  key={size}
                  className={tem ? "card__size" : "card__size card__size--fora"}
                >
                  {size}
                  {/* O risco é pista visual e nada mais: sem isto, quem
                      usa leitor de tela ouve a mesma lista de sempre. */}
                  {!tem && (
                    <span className="visually-hidden"> indisponível</span>
                  )}
                </li>
              );
            })}
          </ul>

          <a
            className="botao botao--mini card__pedir"
            href={linkWhatsApp(mensagemDaPeca(name))}
            target="_blank"
            rel="noopener noreferrer"
          >
            Pedir no WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

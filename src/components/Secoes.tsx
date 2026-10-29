import { Link } from "react-router-dom";
import { products } from "../data/products";
import "./Secoes.css";

export function Faixa() {
  return (
    <section className="faixa" aria-label="O que define as peças">
      <div className="page faixa__inner">
        <div>
          <b>Qualidade premium</b>
          <span>Tecido duplo, toque macio e acabamento cuidadoso.</span>
        </div>
        <div>
          <b>Proteção UV</b>
          <span>Funcionalidade e estilo para acompanhar seus dias de sol.</span>
        </div>
        <div>
          <b>Edição limitada</b>
          <span>Cores e modelos selecionados em quantidades limitadas, pensados para tornar cada dia ainda mais especial.</span>
        </div>
        <div>
          <b>Atendimento pessoal</b>
          <span>Consulte tamanhos, cores e disponibilidade diretamente pelo WhatsApp.</span>
        </div>
      </div>
    </section>
  );
}

/**
 * A capa das duas primeiras peças que têm foto.
 *
 * Não são arquivos versionados, ao contrário das fotos de campanha do
 * hero: assim a seção acompanha a coleção sozinha e o repositório
 * continua sem guardar foto de produto.
 */
function fotosDoLookbook() {
  return products
    .flatMap((p) => {
      const cor = p.colours.find((c) => c.images.length > 0);
      return cor ? [{ foto: cor.images[0], nome: p.name, slug: p.slug }] : [];
    })
    .slice(0, 2);
}

export function Lookbook() {
  const fotos = fotosDoLookbook();

  return (
    <section className="lookbook" id="lookbook" aria-labelledby="lookbook-titulo">
      <div className="page lookbook__inner">
        <div className="lookbook__texto">
          <h2 className="secao__titulo" id="lookbook-titulo">
            Luz, pele e cor.
          </h2>
          <p>
            A Vênus Oasis nasce do encontro entre o brilho dourado do fim de
            tarde e o azul turquesa do mar. Cada peça é pensada para quem gosta
            de ser notada sem precisar pedir licença.
          </p>
          <p>
            Modelagem confortável, acabamento limpo e cores que conversam com
            todos os tons de pele.
          </p>
          <div>
            <Link className="botao botao--cheio" to="/#colecao">
              Escolher meu conjunto
            </Link>
          </div>
        </div>

        {/* Some quando o catálogo não tem foto nenhuma: meia seção vazia
            é pior que seção sem foto. */}
        {fotos.length > 0 && (
          <div className="lookbook__fotos">
            {fotos.map(({ foto, nome, slug }) => (
              <Link key={slug} to={`/produto/${slug}`}>
                <img
                  src={foto.srcGrande}
                  alt={nome}
                  width={784}
                  height={1168}
                  loading="lazy"
                  decoding="async"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function ComoComprar() {
  return (
    <section className="secao" id="comprar" aria-labelledby="comprar-titulo">
      <div className="page">
        <div className="secao__cabeca">
          <h2 className="secao__titulo" id="comprar-titulo">
            Comprar é simples
          </h2>
          <p className="secao__linha">
            Atendimento direto, sem carrinho complicado e sem surpresa no
            tamanho.
          </p>
        </div>

        {/* Lista ordenada de verdade, para quem usa leitor de tela ouvir
            "1 de 3". O numeral grande vem do contador do CSS. */}
        <ol className="passos">
          <li>
            <h3>Escolha a peça</h3>
            <p>Toque em "Pedir no WhatsApp" no modelo que você gostou.</p>
          </li>
          <li>
            <h3>Confirme tamanho e cor</h3>
            <p>
              Nossa equipe passa a tabela de medidas e confirma o estoque na
              hora.
            </p>
          </li>
          <li>
            <h3>Receba em casa</h3>
            <p>Pagamento por Pix ou cartão e envio com código de rastreio.</p>
          </li>
        </ol>
      </div>
    </section>
  );
}

export function Duvidas() {
  return (
    <section className="secao" id="duvidas" aria-labelledby="duvidas-titulo">
      <div className="page duvidas__inner">
        <h2 className="secao__titulo" id="duvidas-titulo">
          Dúvidas frequentes
        </h2>

        <div className="duvidas">
          <details className="acordeao">
            <summary>Como escolho meu tamanho?</summary>
            <p>
              Envie sua altura, peso e medida de quadril no WhatsApp. Indicamos
              o tamanho ideal para cada modelagem.
            </p>
          </details>

          <details className="acordeao">
            <summary>O tecido desbota com sol e cloro?</summary>
            <p>
              Para durar mais, lave à mão com sabão neutro e seque à sombra.
            </p>
          </details>

          <details className="acordeao">
            <summary>Posso trocar se não servir?</summary>
            <p>
              Por higiene, a troca vale apenas para peças sem uso e com
              etiqueta. Fale com a gente em até 7 dias após o recebimento.
            </p>
          </details>

          <details className="acordeao">
            <summary>Vocês enviam para todo o Brasil?</summary>
            <p>
              Sim. O frete é calculado pelo CEP e informado antes do pagamento.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}

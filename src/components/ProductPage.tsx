import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { findProduct } from "../data/products";
import { formatBRL } from "../lib/format";
import { disponivel, quantidade } from "../lib/estoque";
import { linkWhatsApp, mensagemDaPeca } from "../lib/whatsapp";
import { useTrilhoFotos } from "../hooks/useTrilhoFotos";
import { PlaceholderImage } from "./PlaceholderImage";
import { SeletorCor } from "./SeletorCor";
import { NotFound } from "./NotFound";
import "./ProductPage.css";

export function ProductPage() {
  const { slug } = useParams();
  const product = findProduct(slug);
  const [cor, setCor] = useState(0);
  // Nenhum tamanho vem escolhido: a linha de disponibilidade só faz
  // sentido depois de alguém escolher, e um tamanho pré-selecionado
  // anunciaria um número que ninguém pediu.
  const [tamanho, setTamanho] = useState<string | null>(null);

  // As fotos são da cor, não da peça: trocar a cor troca a galeria.
  const corAtual = product?.colours[cor];
  const images = corAtual?.images ?? [];

  // A chave do trilho é a identidade da galeria: muda com a cor e com a
  // peça, e é o que devolve o trilho à capa. Sem o slug, ir de uma peça
  // para outra pela mesma rota deixaria o trilho na posição anterior.
  const { trilhoRef, indice, aoRolar, aoMover, aoSair } = useTrilhoFotos(
    images.length,
    `${slug}-${corAtual?.id ?? ""}`,
  );

  // Trocar de produto sem voltar ao topo deixa a pessoa no meio da página
  // nova, sem contexto do que está vendo.
  useEffect(() => {
    window.scrollTo(0, 0);
    setCor(0);
    setTamanho(null);
  }, [slug]);

  useEffect(() => {
    if (product) document.title = `${product.name} — Vênus Oasis`;
    return () => {
      document.title = "Vênus Oasis — Moda praia";
    };
  }, [product]);

  // A descrição é um texto longo com parágrafos separados por linha em
  // branco. Os vazios saem: um \n\n\n a mais no admin não deve virar um
  // parágrafo em branco na página.
  const paragrafos = useMemo(
    () =>
      (product?.description ?? "")
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean),
    [product?.description],
  );

  if (!product) return <NotFound />;

  const { name, priceCents, sizes, colours, details, soldOut } = product;
  const varias = colours.length > 1;

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
    if (q === 0) return "Indisponível neste tamanho";
    return q === 1 ? "1 peça em estoque" : `${q} peças em estoque`;
  }

  const disponibilidade = textoDisponibilidade();

  return (
    <div className={`page produto${soldOut ? " produto--esgotada" : ""}`}>
      {/* A volta mora aqui, no corpo, e não no cabeçalho: o menu do
          cabeçalho some abaixo de 900px e levaria a volta junto,
          justamente no celular — que é de onde vem quase todo o tráfego,
          porque quase todo ele vem do Instagram. */}
      <p className="produto__migalha">
        <Link to="/#colecao">← Voltar para a coleção</Link>
      </p>

      <div className="produto__layout">
        <div className="produto__galeria">
          <figure className="palco">
            <div className="palco__moldura">
              {images.length > 0 ? (
                /* O trilho é tabindex="0" de propósito: é ele que mantém as
                   outras fotos alcançáveis por teclado agora que a tira de
                   miniaturas saiu. As setas rolam um contêiner focado
                   sozinhas, sem controle na tela. Não remova. */
                <div
                  className="palco__trilho"
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
                    <img
                      key={`${image.srcGrande}-${i}`}
                      src={image.srcGrande}
                      alt={
                        varias && corAtual
                          ? `${name}, ${corAtual.name} — foto ${i + 1}`
                          : `${name} — foto ${i + 1}`
                      }
                      width={784}
                      height={1168}
                      loading={i === 0 ? "eager" : "lazy"}
                      fetchPriority={i === 0 ? "high" : "auto"}
                      decoding="async"
                    />
                  ))}
                </div>
              ) : (
                <PlaceholderImage slug={product.slug} name={name} index={0} />
              )}

              {soldOut && <span className="palco__tarja">Esgotado</span>}

              {/* Indicador, não controle: quem navega é o dedo no trilho, o
                  ponteiro ou as setas. Diz quantas fotos existem e onde
                  você está, e por isso é aria-hidden e pointer-events:none
                  — o anúncio para leitor de tela é a região viva abaixo.
                  Cor chapada em --accent, nunca degradê: degradê aqui seria
                  um terceiro significado além de fronteira e escolha. */}
              {images.length > 1 && (
                <div className="palco__barra" aria-hidden="true">
                  {images.map((image, i) => (
                    <i
                      key={`${image.src}-${i}`}
                      className={i === indice ? "is-on" : ""}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* A plaquinha é o nome da cor escolhida em cima da foto — é o
                que impede o seletor de bolinhas de ser "só cor". Peça de
                uma cor só não tem escolha nenhuma, então não tem plaquinha. */}
            {varias && corAtual && (
              <figcaption className="palco__cor">{corAtual.name}</figcaption>
            )}
          </figure>

          {images.length > 1 && (
            <>
              <p className="palco__dica">
                Deslize o dedo, ou passe o mouse, para ver os outros ângulos.
              </p>
              {/* As fotos não têm rótulo de ângulo; a posição é o que dá
                  para anunciar. Sem isto, quem usa leitor de tela rola o
                  trilho e não recebe retorno nenhum. */}
              <p aria-live="polite" className="visually-hidden">
                Foto {indice + 1} de {images.length}
              </p>
            </>
          )}
        </div>

        <div className="produto__info">
          <div className="produto__cabeca">
            <h1 className="produto__nome">{name}</h1>
            {/* Sem preço, nada aqui: as donas catalogam antes de
                precificar, e nem "R$ 0,00" nem "Consulte" seriam verdade. */}
            {priceCents !== undefined && (
              <p className="produto__preco">{formatBRL(priceCents)}</p>
            )}
          </div>

          {/* Cor e tamanho vêm antes do texto longo. No celular "o meu
              tamanho existe nessa cor?" é a pergunta que decide, e
              enterrá-la sob dois parágrafos e cinco destaques custa um
              scroll inteiro. É uma ordem só, igual no desktop e no
              celular: ordem visual diferente da do DOM estraga a
              navegação por teclado.

              Peça de uma cor só não ganha seletor: não há escolha, e o
              backfill do admin chamou essas de "Única". */}
          {varias && (
            <div className="produto__bloco">
              <h2 className="produto__rotulo">Cor</h2>
              <SeletorCor
                colours={colours}
                escolhida={cor}
                onEscolher={setCor}
                label={`Cores de ${name}`}
                desabilitado={soldOut}
              />
              {/* O nome escrito, além da plaquinha sobre a foto: a bolinha
                  sozinha só informa quem distingue as cores na tela. */}
              {corAtual && (
                <p className="produto__cor-escolhida" aria-live="polite">
                  <b>{corAtual.name}</b>
                </p>
              )}
            </div>
          )}

          <div className="produto__bloco">
            <h2 className="produto__rotulo">Grade de tamanhos</h2>
            {/* A grade inteira vira botão, inclusive o tamanho sem estoque:
                ele continua clicável de propósito, porque é clicando que a
                pessoa recebe o "Indisponível" escrito. */}
            <div className="produto__tamanhos" role="group" aria-label="Tamanhos">
              {sizes.map((size) => {
                const tem = corAtual ? disponivel(corAtual, size) : true;
                return (
                  <button
                    key={size}
                    type="button"
                    className={[
                      "produto__tamanho",
                      size === tamanho ? "is-active brand-ring" : "",
                      tem ? "" : "produto__tamanho--fora",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-pressed={size === tamanho}
                    disabled={soldOut}
                    onClick={() => setTamanho(size)}
                  >
                    {size}
                    {/* O risco é pista visual e nada mais: sem isto quem usa
                        leitor de tela ouve a mesma grade de sempre. */}
                    {!tem && <span className="visually-hidden"> indisponível</span>}
                  </button>
                );
              })}
            </div>

            {/* Altura reservada mesmo vazia: sem isso a linha nasce ao
                escolher um tamanho e empurra o resto para baixo — layout
                shift disparado por clique, que é o pior tipo. */}
            <p className="produto__disponibilidade" aria-live="polite">
              {disponibilidade}
            </p>
          </div>

          {/* "Pedir no WhatsApp" apesar de o site não vender: foi decisão da
              dona, e a conversa é onde a venda acontece de verdade. A
              mensagem vai na voz de quem clicou, não na da marca — ela
              aparece no compositor da cliente. */}
          <a
            className="produto__cta"
            href={linkWhatsApp(mensagemDaPeca(name))}
            target="_blank"
            rel="noopener noreferrer"
          >
            Pedir no WhatsApp
          </a>

          {paragrafos.length > 0 && (
            <div className="produto__bloco">
              <h2 className="produto__rotulo">Descrição do modelo</h2>
              <div className="produto__prosa">
                {paragrafos.map((texto, i) => (
                  // A ordem é a identidade: o texto pode repetir, e o
                  // índice não muda sem a descrição mudar junto.
                  <p key={i}>{texto}</p>
                ))}
              </div>
            </div>
          )}

          {details && details.length > 0 && (
            <div className="produto__bloco">
              <h2 className="produto__rotulo">Destaques do modelo</h2>
              <ul className="produto__destaques">
                {details.map((linha, i) => (
                  <li key={i}>{linha}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Texto fixo, não dado do catálogo: vale para toda peça, e seria
              mais um campo para as donas repetirem em cada cadastro. */}
          <div className="produto__ajuda">
            <details className="acordeao">
              <summary>Como escolher o tamanho</summary>
              <p>
                Mande sua altura, peso e medida de quadril no WhatsApp. A gente
                indica o tamanho certo para esta modelagem.
              </p>
            </details>
            <details className="acordeao">
              <summary>Cuidados com a peça</summary>
              <p>
                Lave à mão com sabão neutro e seque à sombra. Cloro e sol forte
                desbotam a cor.
              </p>
            </details>
          </div>

          <p className="produto__nota">
            {/* O aviso de esgotado vem antes e em contraste cheio: é o que
                muda a decisão de quem está lendo. */}
            {soldOut && (
              <strong className="produto__esgotado">
                Esta peça está esgotada — fale com a gente para saber se volta.{" "}
              </strong>
            )}
            {/* A baixa de estoque no admin não republica o site sozinha:
                entre a venda e a publicação o número aqui é o de antes. O
                aviso é a mitigação barata disso — mais honesto que fingir
                que a contagem é ao vivo. Não tire. */}
            Catálogo para consulta — este site não realiza vendas. Quantidades e
            preço são informativos e podem mudar; confirme no WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}

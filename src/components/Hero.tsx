import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { linkWhatsApp, MENSAGEM_GERAL } from "../lib/whatsapp";
import "./Hero.css";

/**
 * O carrossel é a pasta `src/assets/campanha/`: toda imagem ali entra,
 * na ordem alfabética do nome do arquivo. Para trocar a campanha, basta
 * commitar os arquivos — não se mexe neste componente.
 *
 * São arquivos de marca, como a logo, e não fotos do catálogo, que vêm
 * do admin pelo R2. Ficam em `src/assets/` e não em `public/` por dois
 * motivos: o `glob` do Vite não enxerga `public/`, e daqui cada arquivo
 * sai do build com hash no nome, então foto nova nunca fica presa no
 * cache de quem já visitou.
 *
 * **Exporte em 2:3** (1000×1500 serve). É a proporção do quadro; quem
 * vier fora dela perde uma tira pelo `object-fit: cover`, centrada, sem
 * aviso. Era o que o `object-position` por foto tentava corrigir antes,
 * e não corrigia: ele só tem efeito no eixo que sobra, e nas três fotos
 * de então sobrava o outro.
 *
 * Numere com zero à esquerda (`campanha-01`, não `campanha-1`): a ordem
 * é a do nome, e sem o zero a décima foto cairia antes da segunda.
 */
const FOTOS = Object.entries(
  import.meta.glob<string>("../assets/campanha/*.{jpg,jpeg,png,webp}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url);

const INTERVALO_MS = 2800;

export function Hero() {
  const [atual, setAtual] = useState(0);
  // Pausa enquanto o ponteiro ou o foco estão dentro da figura.
  const [visitando, setVisitando] = useState(false);
  // Clicar numa bolinha para o carrossel de vez: é a parada definitiva
  // que conteúdo em movimento automático precisa ter, e que o hover não
  // dá, porque não existe no teclado nem no toque.
  const [assumido, setAssumido] = useState(false);
  const temporizador = useRef<number | undefined>(undefined);

  const proxima = useCallback(() => {
    setAtual((i) => (i + 1) % FOTOS.length);
  }, []);

  useEffect(() => {
    // Quem pediu menos movimento não leva um carrossel girando sozinho;
    // as bolinhas continuam trocando a foto no clique.
    const parado = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // Com uma foto só não há o que girar, e com nenhuma o resto da home
    // ainda tem que subir.
    if (FOTOS.length < 2 || parado || visitando || assumido) return;

    temporizador.current = window.setInterval(proxima, INTERVALO_MS);
    return () => window.clearInterval(temporizador.current);
  }, [visitando, assumido, proxima]);

  return (
    <section className="hero page" aria-label="Vênus Oasis">
      <div className="hero__texto">
        <h1 className="hero__titulo">
          Feito para ser <span className="texto-degrade">visto</span> no sol.
        </h1>

        <p className="hero__linha">
          Biquínis de modelagem marcante, regulagem lateral e cores em edição
          limitada. Peças que valorizam o corpo real e seguem a luz do verão.
        </p>

        <div className="hero__acoes">
          <Link className="botao botao--cheio" to="/#colecao">
            Ver a coleção
          </Link>
          <a
            className="botao"
            href={linkWhatsApp(MENSAGEM_GERAL)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>

      {FOTOS.length > 0 && (
        <figure
          className="hero__figura"
          onMouseEnter={() => setVisitando(true)}
          onMouseLeave={() => setVisitando(false)}
          onFocusCapture={() => setVisitando(true)}
          onBlurCapture={() => setVisitando(false)}
        >
          {/* Travessia por opacidade, e não o trilho que rola das galerias
            de peça: aqui não há foto para navegar, só a abertura
            passando sozinha. */}
          <div className="hero__slides">
            {FOTOS.map((src, i) => (
              <img
                key={src}
                className={i === atual ? "is-on" : ""}
                src={src}
                /* Sem rótulo por foto, como as fotos de peça: o que
                 importa é a ordem, e a pasta não sabe descrever o que
                 entrou nela. */
                alt={`Campanha Vênus Oasis — foto ${i + 1}`}
                width={1000}
                height={1500}
                /* A primeira é a maior imagem da primeira dobra; as outras
                 só aparecem depois do intervalo, com tempo de carregar. */
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                decoding="async"
              />
            ))}

            {/* Uma foto só não é escolha, então não leva bolinha — como o
              seletor de cor da peça de cor única. */}
            {FOTOS.length > 1 && (
              <div className="hero__bolinhas">
                {FOTOS.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className={`hero__bolinha ${i === atual ? "is-on" : ""}`}
                    aria-label={`Foto ${i + 1} de ${FOTOS.length}`}
                    aria-pressed={i === atual}
                    onClick={() => {
                      setAtual(i);
                      setAssumido(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <figcaption className="hero__legenda">Biquínis para o sol</figcaption>
        </figure>
      )}
    </section>
  );
}

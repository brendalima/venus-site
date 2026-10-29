import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { linkWhatsApp, MENSAGEM_GERAL } from "../lib/whatsapp";
import "./Hero.css";

/**
 * Arquivos de marca em `public/`, como a logo — e não fotos do catálogo,
 * que vêm do admin pelo R2.
 *
 * O `foco` é o `object-position`: as três foram cortadas em 2:3 e sem ele
 * o corte pega no lugar errado — em duas delas, no rosto.
 */
const FOTOS = [
  {
    src: "/campanha-1.jpg",
    alt: "Duas modelos na praia usando biquínis laranja e azul aço da Vênus Oasis",
    foco: "50% 40%",
  },
  {
    src: "/campanha-2.jpg",
    alt: "Modelo na praia usando conjunto azul claro com vivo branco",
    foco: "50% 25%",
  },
  {
    src: "/campanha-3.jpg",
    alt: "Modelo na praia usando conjunto vermelho texturizado com vivo branco",
    foco: "50% 32%",
  },
];

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
    const parado = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (parado || visitando || assumido) return;

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
          {FOTOS.map((foto, i) => (
            <img
              key={foto.src}
              className={i === atual ? "is-on" : ""}
              src={foto.src}
              alt={foto.alt}
              style={{ objectPosition: foto.foco }}
              width={1000}
              height={1500}
              /* A primeira é a maior imagem da primeira dobra; as outras
                 só aparecem depois do intervalo, com tempo de carregar. */
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              decoding="async"
            />
          ))}

          <div className="hero__bolinhas">
            {FOTOS.map((foto, i) => (
              <button
                key={foto.src}
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
        </div>

        <figcaption className="hero__legenda">Biquínis para o sol</figcaption>
      </figure>
    </section>
  );
}

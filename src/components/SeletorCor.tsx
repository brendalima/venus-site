import type { CSSProperties } from "react";
import type { ProductColour } from "../types";
import "./SeletorCor.css";

/**
 * O fundo da bolinha, a partir do hex da cor.
 *
 * Hex em estilo inline não fere a regra de tokens.css: a cor não é da
 * marca, é um dado do catálogo que a dona digitou no admin. O que não
 * pode é cor da identidade escrita em componente.
 *
 * As paradas são duplas de propósito — `A 0 50%, B 50% 100%`. Sem elas o
 * degradê interpola entre as duas metades, o corte sai esfumaçado e
 * parece defeito de renderização em vez de peça bicolor.
 */
function fundo(hex: string[]): CSSProperties {
  if (hex.length === 1) return { background: hex[0] };
  return {
    background: `linear-gradient(135deg, ${hex[0]} 0 50%, ${hex[1]} 50% 100%)`,
  };
}

type Props = {
  colours: ProductColour[];
  /** Índice da cor escolhida. */
  escolhida: number;
  onEscolher: (i: number) => void;
  /** Nome acessível do grupo, ex. "Cores de Biquíni Vega". */
  label: string;
  /** Peça esgotada: as opções ficam legíveis, mas não aceitam toque. */
  desabilitado?: boolean;
};

/**
 * Seletor de cor, o mesmo no card do grid e na página da peça.
 *
 * Cada cor é uma bolinha quando tem `hex`, e a ficha com o nome escrito
 * quando não tem. A escolha é no dado, como `images: []`: a cor vira
 * bolinha sozinha quando a dona preencher o hex no admin, sem flag e sem
 * código morto. Até lá as duas formas convivem na mesma fileira, e é
 * assim mesmo — uma fileira só de fichas seria o estado de hoje, e uma
 * fileira só de bolinhas o de depois.
 *
 * **Nunca só cor.** A bolinha leva o nome da cor em texto escondido, que
 * é o nome acessível do botão, e quem chama o seletor mostra o nome da
 * escolhida em algum lugar visível — a página da peça mostra na plaquinha
 * sobre a foto e na linha abaixo das bolinhas. Bolinha sozinha é
 * informação que só chega a quem distingue as cores na tela.
 *
 * Peça de uma cor só não ganha seletor nenhum: não há o que escolher, e
 * as peças anteriores às cores se chamam "Única", que não diz nada a
 * ninguém. Quem decide isso é quem chama.
 */
export function SeletorCor({
  colours,
  escolhida,
  onEscolher,
  label,
  desabilitado = false,
}: Props) {
  return (
    <div className="cores" role="group" aria-label={label}>
      {colours.map((c, i) => {
        const hex = c.hex ?? [];
        const ativa = i === escolhida;

        return (
          <button
            key={c.id}
            type="button"
            /* O anel em degradê marca a escolha, igual à ficha de tamanho:
               filete é fronteira, anel é escolha. A borda já existe
               transparente na classe base, então escolher não muda o
               tamanho do botão. */
            className={[
              "cor",
              hex.length > 0 ? "cor--bolinha" : "cor--ficha",
              ativa ? "is-active brand-ring" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-pressed={ativa}
            disabled={desabilitado}
            onClick={() => onEscolher(i)}
          >
            {hex.length > 0 ? (
              <>
                <span className="cor__disco" style={fundo(hex)} />
                <span className="visually-hidden">{c.name}</span>
              </>
            ) : (
              c.name
            )}
          </button>
        );
      })}
    </div>
  );
}

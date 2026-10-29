import type { CSSProperties } from "react";
import type { ProductColour } from "../types";
import "./SeletorCor.css";

/**
 * O fundo da bolinha, a partir do hex da cor. Hex em estilo inline não
 * fere a regra de tokens.css: é dado do catálogo, não cor da identidade.
 *
 * As paradas são duplas de propósito — `A 0 50%, B 50% 100%`. Sem elas o
 * degradê interpola entre as metades e o corte da peça bicolor sai
 * esfumaçado.
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
  /**
   * Bolinhas miúdas, para o card do grid. Muda só o **disco** (13px em
   * vez de 28px); o alvo continua com 44px, transparente ao redor.
   */
  delicada?: boolean;
};

/**
 * Seletor de cor, o mesmo no card do grid e na página da peça.
 *
 * Cada cor é uma bolinha quando tem `hex`, e a ficha com o nome escrito
 * quando não tem. As duas formas convivem na mesma fileira enquanto o
 * hex vai sendo preenchido.
 *
 * **Nunca só cor.** A bolinha leva o nome em texto escondido, que é o
 * nome acessível do botão, e quem chama o seletor mostra o nome da
 * escolhida em algum lugar visível — bolinha sozinha é informação que só
 * chega a quem distingue as cores na tela.
 *
 * Peça de uma cor só não ganha seletor nenhum, e quem decide isso é quem
 * chama.
 */
export function SeletorCor({
  colours,
  escolhida,
  onEscolher,
  label,
  desabilitado = false,
  delicada = false,
}: Props) {
  return (
    <div
      className={delicada ? "cores cores--delicada" : "cores"}
      role="group"
      aria-label={label}
    >
      {colours.map((c, i) => {
        const hex = c.hex ?? [];
        const ativa = i === escolhida;

        return (
          <button
            key={c.id}
            type="button"
            /* A borda já existe transparente na classe base, então
               escolher não muda o tamanho do botão.

               A bolinha miúda fica de fora: o anel precisa de uma borda
               para colorir, e num disco de 13px ela comeria o disco. Lá a
               escolha é um halo, desenhado no CSS a partir do
               `.is-active`. */
            className={[
              "cor",
              hex.length > 0 ? "cor--bolinha" : "cor--ficha",
              delicada ? "cor--delicada" : "",
              ativa ? "is-active" : "",
              ativa && !delicada ? "brand-ring" : "",
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

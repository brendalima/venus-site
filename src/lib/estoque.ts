import type { ProductColour } from "../types";

/**
 * Leitura do estoque de uma cor, nos três estados que o dado permite:
 * cor não contada (`tracksStock` falso), cor contada com quantidade, e
 * cor contada em zero.
 *
 * O erro fácil é tratar "não contada" como "zerada", que esgotaria no
 * site toda peça que ainda ninguém contou. É por isso que a tradução
 * mora aqui e não em cada componente.
 */

/** Quantas peças daquele tamanho, ou `undefined` se a cor não é contada. */
export function quantidade(
  cor: ProductColour,
  size: string,
): number | undefined {
  if (!cor.tracksStock) return undefined;
  return cor.stock.find((s) => s.size === size)?.quantity ?? 0;
}

/** Cor não contada conta como disponível: a falta de contagem não é falta de peça. */
export function disponivel(cor: ProductColour, size: string): boolean {
  const q = quantidade(cor, size);
  return q === undefined || q > 0;
}

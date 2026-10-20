import type { ProductColour } from "../types";

/**
 * Leitura do estoque de uma cor, no vocabulário do site.
 *
 * O modelo do admin é esparso de propósito, do jeito que as donas
 * anotam ("P 1x Bege, M 2x Bege, G indisponível"), e isso cria três
 * estados que não dá para confundir:
 *
 * - a cor **não é contada** (`tracksStock` falso): não se sabe nada, e o
 *   site não inventa — mostra os tamanhos sem número;
 * - a cor é contada e o tamanho tem quantidade: tem tantas peças;
 * - a cor é contada e o tamanho está em zero (ou nem foi lançado):
 *   indisponível.
 *
 * O erro fácil é tratar "não contada" como "zerada", que esgotaria no
 * site toda peça que ainda ninguém contou.
 */

/** Quantas peças daquele tamanho, ou `undefined` se a cor não é contada. */
export function quantidade(
  cor: ProductColour,
  size: string,
): number | undefined {
  if (!cor.tracksStock) return undefined;
  return cor.stock.find((s) => s.size === size)?.quantity ?? 0;
}

/**
 * Se dá para esperar que a peça exista naquela cor e tamanho.
 *
 * Cor não contada é disponível: a ausência de contagem não é ausência de
 * peça, e quem decide é o WhatsApp.
 */
export function disponivel(cor: ProductColour, size: string): boolean {
  const q = quantidade(cor, size);
  return q === undefined || q > 0;
}

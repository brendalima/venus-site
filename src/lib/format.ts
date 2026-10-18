const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Recebe centavos inteiros, devolve "R$ 1.234,56". */
export function formatBRL(cents: number): string {
  return brl.format(cents / 100);
}

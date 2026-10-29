import type { Product } from "../types";

/**
 * Qual coleção dá título ao catálogo.
 *
 * O admin registra as coleções à parte e cada peça aponta para uma (ou
 * para nenhuma). O site ainda não tem seção por coleção: a home é uma
 * grade só, e o que ela mostra é **o nome da coleção principal**, que é a
 * que tem mais peças.
 *
 * Por que a maior, e não a mais recente: o catálogo é pequeno e as donas
 * cadastram a coleção nova aos poucos, peça por peça. Pela data, o título
 * viraria a coleção nova na primeira peça publicada, com a grade ainda
 * cheia da anterior. Pela contagem, ele vira quando a maior parte do que
 * está à vista já é dela.
 */
export function colecaoPrincipal(products: Product[]): string | undefined {
  // Map preserva a ordem de inserção, que aqui é a ordem do catálogo — o
  // arranjo manual das donas. É o que torna o desempate determinístico.
  const contagem = new Map<string, { nome: string; pecas: number }>();

  for (const p of products) {
    if (!p.collection) continue;

    const atual = contagem.get(p.collection.id);
    if (atual) atual.pecas += 1;
    else contagem.set(p.collection.id, { nome: p.collection.name, pecas: 1 });
  }

  let principal: { nome: string; pecas: number } | undefined;
  for (const colecao of contagem.values()) {
    // `>` e não `>=`: no empate fica a primeira na ordem do catálogo, em
    // vez de a última a ser contada. Sem isso o título trocaria sozinho
    // ao reordenar peças no admin, sem nada ter mudado de verdade.
    if (!principal || colecao.pecas > principal.pecas) principal = colecao;
  }

  return principal?.nome;
}

/**
 * O título do catálogo: "Coleção" mais o nome da coleção principal.
 *
 * Sem coleção nenhuma no catálogo — peça que não está em nenhuma, ou
 * admin mais velho que o site —, fica só "Coleção", que é o que o
 * catálogo dizia antes de haver coleções.
 *
 * As donas cadastram o nome como dá, e parte delas já escreve a palavra
 * dentro do nome ("Coleção Miragem"). Prefixar sem olhar daria "Coleção
 * Coleção Miragem", então quem já começa com a palavra entra inteiro. A
 * comparação ignora acento e caixa porque o que chega do admin é o que
 * foi digitado — "colecao miragem" também é.
 */
export function tituloDoCatalogo(products: Product[]): string {
  const nome = colecaoPrincipal(products);
  if (!nome) return "Coleção";

  const semAcento = nome
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  return /^cole[cç]ao\b/u.test(semAcento) ? nome : `Coleção ${nome}`;
}

import type { Product } from "../types";

/**
 * A coleção que dá título ao catálogo: a que tem mais peças.
 *
 * Pela contagem, e não pela data, porque a coleção nova é cadastrada aos
 * poucos — pela data o título viraria a nova já na primeira peça
 * publicada, com a grade ainda cheia da anterior.
 */
export function colecaoPrincipal(products: Product[]): string | undefined {
  // Map preserva a ordem de inserção, que aqui é a ordem do catálogo. É
  // o que torna o desempate determinístico.
  const contagem = new Map<string, { nome: string; pecas: number }>();

  for (const p of products) {
    if (!p.collection) continue;

    const atual = contagem.get(p.collection.id);
    if (atual) atual.pecas += 1;
    else contagem.set(p.collection.id, { nome: p.collection.name, pecas: 1 });
  }

  let principal: { nome: string; pecas: number } | undefined;
  for (const colecao of contagem.values()) {
    // `>` e não `>=`: no empate fica a primeira na ordem do catálogo. Sem
    // isso o título trocaria sozinho ao reordenar peças no admin.
    if (!principal || colecao.pecas > principal.pecas) principal = colecao;
  }

  return principal?.nome;
}

/**
 * O título do catálogo: "Coleção" mais o nome da coleção principal, ou só
 * "Coleção" quando nenhuma peça está em alguma.
 *
 * Nome que já começa com a palavra entra inteiro, senão sairia "Coleção
 * Coleção Miragem". A comparação ignora acento e caixa porque o nome vem
 * do admin como foi digitado.
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

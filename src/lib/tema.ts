export type Tema = "escuro" | "claro";

/**
 * Chave no localStorage.
 *
 * A mesma string está escrita no script inline do index.html, que roda
 * antes da primeira pintura. Se mudar aqui, muda lá.
 */
const CHAVE = "venus-tema";

/** O escuro é a ausência do atributo, não um valor — ver tokens.css. */
export function temaAtual(): Tema {
  return document.documentElement.dataset.tema === "claro" ? "claro" : "escuro";
}

export function aplicaTema(tema: Tema): void {
  const raiz = document.documentElement;

  if (tema === "claro") {
    raiz.dataset.tema = "claro";
  } else {
    delete raiz.dataset.tema;
  }

  try {
    localStorage.setItem(CHAVE, tema);
  } catch {
    // Navegação privada ou armazenamento bloqueado. O tema vale para
    // esta sessão e volta ao escuro no próximo carregamento — melhor que
    // deixar o clique sem efeito nenhum.
  }

  sincronizaBarra();
}

/**
 * Põe a barra do navegador na cor do fundo da página.
 *
 * A maior parte do tráfego vem do Instagram, ou seja, celular, e barra
 * preta sobre página clara fica à mostra. O valor sai do --bg já
 * computado, para tokens.css continuar sendo o único lugar onde a cor
 * está escrita.
 *
 * Roda na troca e também na carga: o script do index.html define o tema
 * antes da primeira pintura, mas não tem o CSS para consultar ainda.
 */
export function sincronizaBarra(): void {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;

  const bg = getComputedStyle(document.documentElement)
    .getPropertyValue("--bg")
    .trim();
  if (bg) meta.setAttribute("content", bg);
}

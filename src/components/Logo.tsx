import "./Logo.css";

type Props = {
  /**
   * Lockup completo (monograma + nome) em vez de só o wordmark.
   *
   * O lockup é quase quadrado (760×704): numa fileira de 64px ele sairia
   * com 43px de largura e o nome dentro dele viraria um borrão. É por
   * isso que existem dois arquivos — o cabeçalho leva o wordmark e o
   * rodapé, onde há altura, leva o lockup.
   */
  lockup?: boolean;
  /**
   * Texto alternativo. Passe "" quando o elemento ao redor já nomeia a
   * marca (um link com aria-label, por exemplo) — senão o leitor de tela
   * anuncia "Vênus Oasis" duas vezes seguidas.
   */
  alt?: string;
};

/**
 * Logo da marca.
 *
 * Dois usos, e só dois: o wordmark no cabeçalho e o lockup no rodapé.
 * Não há prop de tamanho — havia três, das quais duas pararam de ser
 * usadas quando o hero deixou de abrir com a logo, e tamanho que ninguém
 * pede é tamanho que ninguém conferiu.
 *
 * As imagens têm fundo preto chapado e usam mix-blend-mode: screen —
 * ver a nota em Logo.css.
 */
export function Logo({ lockup = false, alt = "Vênus Oasis" }: Props) {
  return (
    <img
      className={lockup ? "logo logo--lockup" : "logo"}
      src={lockup ? "/logo.png" : "/logo-wordmark.png"}
      /* As dimensões reais dos arquivos. Erradas, elas reservariam a
         altura errada e devolveriam o layout shift que os atributos
         existem para evitar. */
      width={lockup ? 760 : 620}
      height={lockup ? 704 : 219}
      alt={alt}
      decoding="async"
      /* O cabeçalho aparece na primeira dobra de toda rota; o rodapé,
         nunca. */
      {...(lockup
        ? { loading: "lazy" as const }
        : { fetchPriority: "high" as const })}
    />
  );
}

import "./Logo.css";

type Props = {
  /**
   * Lockup completo (monograma + nome) em vez de só o wordmark.
   *
   * O lockup é quase quadrado (760×704): numa fileira de 64px ele sairia
   * com 43px de largura e o nome viraria um borrão. Daí os dois arquivos
   * — wordmark no cabeçalho, lockup no rodapé, onde há altura.
   */
  lockup?: boolean;
  /**
   * Passe "" quando o elemento ao redor já nomeia a marca (um link com
   * aria-label, por exemplo) — senão o leitor de tela anuncia "Vênus
   * Oasis" duas vezes seguidas.
   */
  alt?: string;
};

/**
 * As imagens têm fundo preto chapado e usam mix-blend-mode: screen — ver
 * a nota em Logo.css.
 */
export function Logo({ lockup = false, alt = "Vênus Oasis" }: Props) {
  return (
    <img
      className={lockup ? "logo logo--lockup" : "logo"}
      src={lockup ? "/logo.png" : "/logo-wordmark.png"}
      /* As dimensões reais dos arquivos: erradas, devolvem o layout
         shift que os atributos existem para evitar. */
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

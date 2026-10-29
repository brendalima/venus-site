import "./Logo.css";

type Props = {
  size?: "sm" | "md" | "lg";
  /**
   * Lockup completo (monograma + nome) em vez de só o wordmark.
   *
   * Independente do tamanho de propósito: o rodapé quer o lockup num
   * tamanho médio, e o cabeçalho quer o wordmark pequeno. Por padrão
   * acompanha o `lg`, que é o hero.
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
 * Duas versões do mesmo arquivo original: o lockup completo (monograma +
 * nome), e só o wordmark.
 *
 * **O lockup é quase quadrado (760×704)**, então num cabeçalho de 64px
 * ele sairia com uns 43px de largura e o nome dentro dele viraria um
 * borrão. É por isso que existem dois arquivos, e é por isso que o
 * cabeçalho usa o wordmark enquanto o hero e o rodapé usam o lockup.
 *
 * As imagens têm fundo preto chapado e usam mix-blend-mode: screen —
 * ver a nota em Logo.css.
 */
export function Logo({
  size = "md",
  lockup = size === "lg",
  alt = "Vênus Oasis",
}: Props) {
  return (
    <img
      className={`logo logo--${size}${lockup ? " logo--lockup" : ""}`}
      src={lockup ? "/logo.png" : "/logo-wordmark.png"}
      /* As dimensões reais dos arquivos. Erradas, elas reservariam a
         altura errada e devolveriam o layout shift que os atributos
         existem para evitar. */
      width={lockup ? 760 : 620}
      height={lockup ? 704 : 219}
      alt={alt}
      decoding="async"
      /* O hero e o cabeçalho aparecem na primeira dobra de toda rota; o
         rodapé, nunca. */
      {...(size === "lg" || !lockup
        ? { fetchPriority: "high" as const }
        : { loading: "lazy" as const })}
    />
  );
}

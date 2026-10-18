import "./Logo.css";

type Props = {
  size?: "sm" | "md" | "lg";
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
 * nome) no hero, e só o wordmark nos cabeçalhos, onde o lockup inteiro
 * ficaria alto demais e ilegível.
 *
 * As imagens têm fundo preto chapado e usam mix-blend-mode: screen —
 * ver a nota em Logo.css.
 */
export function Logo({ size = "md", alt = "Vênus Oasis" }: Props) {
  const full = size === "lg";

  return (
    <img
      className={`logo logo--${size}`}
      src={full ? "/logo.png" : "/logo-wordmark.png"}
      width={full ? 760 : 620}
      height={full ? 704 : 222}
      alt={alt}
      decoding="async"
      {...(full ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
    />
  );
}

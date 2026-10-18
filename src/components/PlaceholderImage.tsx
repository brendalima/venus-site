/**
 * Placeholder gerado para produto sem foto.
 *
 * Determinístico: o mesmo slug produz sempre o mesmo par de neons e o
 * mesmo ângulo, então o catálogo parece intencional em vez de aleatório,
 * e screenshots continuam comparáveis entre execuções.
 *
 * É de propósito que NÃO pareça uma foto. Placeholder que passa por
 * produto real é o tipo de coisa que chega em produção sem ninguém notar.
 */

/* Tons da logo, do lado quente ao frio. */
const BRAND = [
  "#8a6a30", // dourado profundo
  "#c9a44c", // dourado
  "#e8ce96", // champagne
  "#45a9aa", // turquesa
  "#1e6f72", // turquesa profundo
];

/** djb2 — pequeno, estável e suficiente para escolher cor. */
function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** Iniciais do produto: "Biquíni Aurora" -> "BA" */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

type Props = {
  slug: string;
  name: string;
  /** Posição no catálogo — define a cor base, ver nota abaixo. */
  index: number;
};

export function PlaceholderImage({ slug, name, index }: Props) {
  const h = hash(slug);

  // A cor base vem do índice, não do hash: hash puro colide e dois cards
  // vizinhos acabam com a mesma cor, o que parece defeito. Percorrer a
  // paleta garante que cards adjacentes nunca repitam. O hash ainda
  // define a segunda cor e o ângulo, então cada produto continua único.
  const from = BRAND[index % BRAND.length];
  const to = BRAND[(index + 1 + (h % 3)) % BRAND.length];
  const angle = h % 360;
  const gradientId = `ph-${slug}`;

  return (
    <svg
      className="placeholder"
      viewBox="0 0 300 400"
      role="img"
      aria-label={`${name} — foto ainda não disponível`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={gradientId} gradientTransform={`rotate(${angle} 0.5 0.5)`}>
          <stop offset="0%" stopColor={from} stopOpacity="0.5" />
          <stop offset="100%" stopColor={to} stopOpacity="0.12" />
        </linearGradient>

        {/* Escurece o rodapé para o rótulo ficar legível mesmo sobre
            gradientes claros, como o âmbar. */}
        <linearGradient id={`${gradientId}-scrim`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="60%" stopColor="#08090a" stopOpacity="0" />
          <stop offset="100%" stopColor="#08090a" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      <rect width="300" height="400" fill="#08090a" />
      <rect width="300" height="400" fill={`url(#${gradientId})`} />
      <rect width="300" height="400" fill={`url(#${gradientId}-scrim)`} />

      <text
        x="150"
        y="200"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#08090a"
        fillOpacity="0.45"
        fontSize="120"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        letterSpacing="4"
      >
        {initials(name)}
      </text>

      <text
        x="150"
        y="372"
        textAnchor="middle"
        fill="#f5f5f7"
        fillOpacity="0.62"
        fontSize="13"
        letterSpacing="2.5"
        fontFamily="ui-monospace, monospace"
      >
        FOTO EM BREVE
      </text>
    </svg>
  );
}

export type ProductImage = {
  src: string;
  /**
   * Perspectiva mostrada — "Frente", "Costas", "Perfil".
   * Vira o rótulo do controle de troca e entra no alt text, então
   * descreve o ângulo de verdade em vez de "imagem 2".
   */
  label: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Inteiro, em centavos, BRL. Nunca float: 29.90 * 3 dá 89.69999999999999. */
  priceCents: number;
  /** Tamanhos disponíveis, ex: ["P", "M", "G", "GG"] */
  sizes: string[];
  /** Primeira imagem é a capa. Array vazio cai no placeholder gerado. */
  images: ProductImage[];
  description?: string;
  /** Texto mais longo, só na página do produto. */
  details?: string[];
  soldOut?: boolean;
};

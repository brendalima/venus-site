export type ProductImage = {
  /** 600w — card do grid e miniatura. */
  src: string;
  /** 1200w — a foto grande na página da peça. */
  srcGrande: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  /**
   * Inteiro, em centavos, BRL. Nunca float: 29.90 * 3 dá 89.69999999999999.
   *
   * **Ausente quando a peça ainda não tem preço**, e as donas catalogam
   * antes de precificar. Nesse caso o site não mostra preço nenhum —
   * nem "R$ 0,00", nem "Consulte" — e a peça continua listada.
   */
  priceCents?: number;
  /** Tamanhos disponíveis, ex: ["P", "M", "G", "GG"] */
  sizes: string[];
  /** Primeira imagem é a capa. Array vazio cai no placeholder gerado. */
  images: ProductImage[];
  description?: string;
  /** Texto mais longo, só na página do produto. */
  details?: string[];
  soldOut?: boolean;
};

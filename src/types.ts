export type ProductImage = {
  /** 600w — card do grid e miniatura. */
  src: string;
  /** 1200w — a foto grande na página da peça. */
  srcGrande: string;
};

/** Quantas peças de um tamanho existem numa cor. */
export type ProductStock = {
  size: string;
  /** Inteiro ≥ 0. Zero é "indisponível", não "não contado". */
  quantity: number;
};

export type ProductColour = {
  id: string;
  /** O nome que as donas escreveram: "Bege", "Vinho". Não há valor de cor. */
  name: string;
  /** Fotos desta cor. Primeira é a capa. Array vazio cai no placeholder. */
  images: ProductImage[];
  /**
   * Se as quantidades desta cor estão sendo contadas.
   *
   * O admin deduz isso de haver algum lançamento: cor sem nenhum
   * lançamento é cor que ninguém contou, e aí o site mostra os tamanhos
   * sem número nenhum, em vez de dizer que estão todos indisponíveis.
   */
  tracksStock: boolean;
  /**
   * Um lançamento por tamanho da grade, zeros inclusive, quando
   * `tracksStock`. Vazio quando não.
   */
  stock: ProductStock[];
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
  /**
   * A grade da peça, ex: ["P", "M", "G", "GG"].
   *
   * É a grade, não o que tem em estoque: o seletor renderiza daqui para
   * um tamanho sem estoque ainda aparecer, apagado. Quem some da grade
   * é tamanho que a peça não tem, não tamanho que acabou.
   */
  sizes: string[];
  /**
   * As cores em que a peça sai, em ordem. Toda peça tem ao menos uma.
   * Trocar de cor troca a galeria: as fotos são da cor, não da peça.
   */
  colours: ProductColour[];
  description?: string;
  /** Texto mais longo, só na página do produto. */
  details?: string[];
  soldOut?: boolean;
};

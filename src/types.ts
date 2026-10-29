export type ProductImage = {
  /** 600w — card do grid. */
  src: string;
  /** 1200w — página da peça. */
  srcGrande: string;
};

export type ProductStock = {
  size: string;
  /** Inteiro ≥ 0. Zero é "indisponível", não "não contado". */
  quantity: number;
};

export type ProductColour = {
  id: string;
  name: string;
  /**
   * 1 ou 2 cores em "#rrggbb", para a bolinha do seletor. Duas sai
   * dividida na diagonal. Ausente enquanto o hex não foi preenchido, e aí
   * a cor cai na ficha de texto com o nome escrito.
   */
  hex?: string[];
  /** Fotos desta cor. A primeira é a capa. Lista vazia cai no placeholder. */
  images: ProductImage[];
  /**
   * Se as quantidades desta cor estão sendo contadas. Falso quer dizer
   * "ninguém contou", não "zerado": o site mostra os tamanhos sem número.
   */
  tracksStock: boolean;
  /**
   * Um lançamento por tamanho da grade, zeros inclusive, quando
   * `tracksStock`. Vazio quando não.
   */
  stock: ProductStock[];
};

export type ProductCollection = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  /**
   * Inteiro, em centavos, BRL. Nunca float: 29.90 * 3 dá 89.69999999999999.
   * Ausente enquanto a peça não foi precificada, e aí o site não mostra
   * preço nenhum — nem "R$ 0,00", nem "Consulte".
   */
  priceCents?: number;
  /**
   * A grade da peça, ex: ["P", "M", "G", "GG"] — não o que tem em
   * estoque. Tamanho que acabou continua aqui, apagado; quem não aparece
   * é tamanho que a peça não tem.
   */
  sizes: string[];
  /**
   * As cores em que a peça sai, em ordem. Toda peça tem ao menos uma.
   * Trocar de cor troca a galeria: as fotos são da cor, não da peça.
   */
  colours: ProductColour[];
  /** Texto longo: parágrafos separados por linha em branco. */
  description?: string;
  details?: string[];
  /** Ausente quando a peça não está em nenhuma coleção. */
  collection?: ProductCollection;
  soldOut?: boolean;
};

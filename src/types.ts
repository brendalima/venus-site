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
  /** O nome que as donas escreveram: "Bege", "Vinho". */
  name: string;
  /**
   * 1 ou 2 cores em "#rrggbb", para a bolinha do seletor. Duas é peça
   * bicolor, e a bolinha sai dividida na diagonal.
   *
   * **Ausente quando a dona ainda não preencheu**, e aí aquela cor cai na
   * ficha de texto com o nome escrito. A escolha é no dado, como
   * `images: []`: a cor vira bolinha sozinha quando o hex chegar, sem
   * flag e sem código morto. O build normaliza lista vazia para ausente,
   * para "não tem" ter um significado só.
   */
  hex?: string[];
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

/** A coleção a que uma peça pertence. O admin registra as coleções à parte. */
export type ProductCollection = {
  id: string;
  /** O nome que as donas escreveram: "Verão 2026", "Miragem". */
  name: string;
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
  /**
   * A descrição do modelo, em texto longo. Parágrafos separados por linha
   * em branco — a página da peça quebra em `/\n{2,}/`.
   *
   * Já foi a frase curta que o card mostrava; desde que virou texto longo
   * o card não mostra mais prosa nenhuma.
   */
  description?: string;
  /**
   * Os destaques do modelo: lista livre de quem cadastrou, uma frase
   * inteira por item.
   */
  details?: string[];
  /**
   * A coleção da peça. **Ausente quando a peça não está em nenhuma** — o
   * admin manda `collection: null` nesse caso, e o build omite o campo.
   *
   * O site não mostra a coleção peça a peça: usa o conjunto delas para
   * descobrir qual é a coleção principal e dar título ao catálogo. Ver
   * `src/lib/colecao.ts`.
   */
  collection?: ProductCollection;
  soldOut?: boolean;
};

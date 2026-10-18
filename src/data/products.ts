import type { Product } from "../types";

/**
 * Catálogo do site.
 *
 * As fotos são reais (protótipo). Nomes, preços e tamanhos ainda são
 * provisórios — substituir pelos definitivos quando forem definidos.
 *
 * Para adicionar um produto:
 *   1. crie public/produtos/<slug>/ e coloque as fotos lá
 *   2. adicione a entrada abaixo, com um `label` por perspectiva
 * Se `images` ficar vazio, o card usa o placeholder gerado.
 */
export const products: Product[] = [
  {
    id: "1",
    slug: "biquini-aurora",
    name: "Biquíni Aurora",
    priceCents: 18900,
    sizes: ["P", "M", "G"],
    images: [
      { src: "/produtos/biquini-aurora/frente.jpg", label: "Frente" },
      { src: "/produtos/biquini-aurora/costas.jpg", label: "Costas" },
    ],
    description: "Triângulo com amarração no pescoço e calcinha de laço lateral.",
    details: [
      "Verde esmeralda liso",
      "Top triângulo deslizante, ajusta no pescoço e nas costas",
      "Calcinha de amarrar dos dois lados",
      "Forro duplo na frente",
    ],
  },
  {
    id: "2",
    slug: "biquini-eclipse",
    name: "Biquíni Eclipse",
    priceCents: 17900,
    sizes: ["P", "M", "G", "GG"],
    images: [
      { src: "/produtos/biquini-eclipse/frente.jpg", label: "Frente" },
      { src: "/produtos/biquini-eclipse/perfil.jpg", label: "Perfil" },
    ],
    description: "Cortininha preta com calcinha asa delta de cavado alto.",
    details: [
      "Preto liso",
      "Top cortininha com alça fina regulável",
      "Calcinha asa delta, cavada",
      "Tecido com toque acetinado",
    ],
  },
  {
    id: "3",
    slug: "biquini-orion",
    name: "Biquíni Órion",
    priceCents: 21900,
    sizes: ["P", "M", "G"],
    images: [
      { src: "/produtos/biquini-orion/frente.jpg", label: "Frente" },
      { src: "/produtos/biquini-orion/corpo-inteiro.jpg", label: "Corpo inteiro" },
    ],
    description: "Azul marinho com viés branco contrastante e alça fina.",
    details: [
      "Azul marinho com acabamento em viés branco",
      "Top triângulo fixo, alça fina regulável",
      "Calcinha de cintura média",
      "Forro duplo",
    ],
  },
  {
    id: "4",
    slug: "biquini-vega",
    name: "Biquíni Vega",
    priceCents: 22900,
    sizes: ["P", "M", "G", "GG"],
    images: [
      { src: "/produtos/biquini-vega/frente.jpg", label: "Frente" },
      { src: "/produtos/biquini-vega/perfil.jpg", label: "Perfil" },
    ],
    description: "Coral com argola dourada no top e na lateral da calcinha.",
    details: [
      "Coral liso",
      "Argola metálica dourada no centro do top",
      "Calcinha com detalhe de argola nas laterais",
      "Top triângulo com amarração no pescoço",
    ],
  },
  {
    id: "5",
    slug: "biquini-lyra",
    name: "Biquíni Lyra",
    priceCents: 19900,
    sizes: ["P", "M", "G"],
    images: [
      { src: "/produtos/biquini-lyra/frente.jpg", label: "Frente" },
      { src: "/produtos/biquini-lyra/perfil.jpg", label: "Perfil" },
    ],
    description: "Lilás com franzido no top e na lateral da calcinha.",
    details: [
      "Lilás liso",
      "Top triângulo franzido no centro, alça fina",
      "Calcinha com franzido lateral",
      "Modelagem de cobertura média",
    ],
  },
  {
    id: "6",
    slug: "biquini-nova",
    name: "Biquíni Nova",
    priceCents: 23900,
    sizes: ["P", "M", "G", "GG"],
    images: [
      { src: "/produtos/biquini-nova/frente.jpg", label: "Frente" },
      { src: "/produtos/biquini-nova/costas.jpg", label: "Costas" },
    ],
    description: "Tomara que caia canelado com calcinha de cintura alta.",
    details: [
      "Off-white em malha canelada",
      "Top tomara que caia com silicone antideslizante",
      "Calcinha de cintura alta, cobertura média",
      "Tecido encorpado, não transparenta",
    ],
  },
];

export function findProduct(slug: string | undefined): Product | undefined {
  return products.find((p) => p.slug === slug);
}

import type { Product } from "../types";
import catalogo from "./catalogo.json";

/**
 * Catálogo do site.
 *
 * `catalogo.json` é **gerado**: `scripts/catalogo.mjs` o reescreve a
 * partir de `GET /api/products` do admin (`../venus-admin`) antes de cada
 * build. Não edite à mão — a próxima publicação desfaz.
 *
 * A cópia que está no repositório existe para `npm run dev` funcionar sem
 * o admin de pé. Para desenvolver contra o catálogo de verdade, exporte
 * ADMIN_API_URL e API_TOKEN e rode `npm run catalogo`.
 */
export const products: Product[] = catalogo;

export function findProduct(slug: string | undefined): Product | undefined {
  return products.find((p) => p.slug === slug);
}

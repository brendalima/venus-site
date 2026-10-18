#!/usr/bin/env node
// Busca o catálogo no admin e escreve src/data/catalogo.json, que é o que
// o site compila. Roda antes do build (`prebuild` no package.json).
//
// O site é estático: isto acontece UMA VEZ, no build, nunca no
// carregamento da página. É o que faz o admin dormindo, caído ou em
// deploy não derrubar a loja.
//
// Sem ADMIN_API_URL/API_TOKEN o script não faz nada e mantém o
// catalogo.json que está no repositório — é assim que `npm run dev`
// funciona sem o admin de pé. No build da Cloudflare as duas variáveis
// são obrigatórias, senão a loja republicaria com o catálogo de ontem
// sem ninguém perceber.

import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const DESTINO = fileURLToPath(new URL("../src/data/catalogo.json", import.meta.url));

// A máquina do admin no Fly dorme quando ociosa e o Postgres do Neon
// também suspende; os dois acordam na primeira requisição, que por isso
// pode demorar ou falhar. Daí as tentativas com espera crescente.
const TENTATIVAS = 5;
const ESPERA_INICIAL_MS = 2000;
const TIMEOUT_MS = 30000;

/** True quando rodando no build da Cloudflare Pages. */
const noBuildDaCloudflare = Boolean(process.env.CF_PAGES);

function erro(mensagem) {
  return new Error(mensagem);
}

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function buscar(url, token) {
  let ultimoErro;

  for (let tentativa = 1; tentativa <= TENTATIVAS; tentativa++) {
    try {
      const resposta = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      // 401/403 é token errado: tentar de novo só gasta tempo.
      if (resposta.status === 401 || resposta.status === 403) {
        throw erro(
          `${url} respondeu ${resposta.status}: o API_TOKEN não confere com o do admin`,
        );
      }
      if (!resposta.ok) {
        throw erro(`${url} respondeu ${resposta.status}`);
      }
      return await resposta.json();
    } catch (e) {
      if (e instanceof Error && /API_TOKEN não confere/.test(e.message)) throw e;

      ultimoErro = e;
      if (tentativa === TENTATIVAS) break;

      const pausa = ESPERA_INICIAL_MS * 2 ** (tentativa - 1);
      console.warn(
        `[catálogo] tentativa ${tentativa}/${TENTATIVAS} falhou (${e.message}); nova tentativa em ${pausa / 1000}s`,
      );
      await espera(pausa);
    }
  }

  throw erro(`não consegui ler ${url} em ${TENTATIVAS} tentativas: ${ultimoErro?.message}`);
}

/**
 * Converte a resposta do admin (snake_case) para o tipo do site.
 *
 * Duas diferenças que importam:
 * - `price_cents` vem ausente quando a peça ainda não tem preço
 *   (o admin usa `omitzero`). Ausente aqui vira ausente lá, e o site
 *   simplesmente não mostra preço — nunca "R$ 0,00".
 * - cada foto vem como url_600/url_1200, sem rótulo de ângulo. A ordem
 *   é que importa, e a primeira é a capa.
 */
function converter(recebido) {
  if (!Array.isArray(recebido)) {
    throw erro(`esperava uma lista de produtos, veio ${typeof recebido}`);
  }

  return recebido.map((p, i) => {
    const onde = `produto ${i + 1}${p?.slug ? ` (${p.slug})` : ""}`;

    for (const campo of ["id", "slug", "name"]) {
      if (typeof p?.[campo] !== "string" || p[campo] === "") {
        throw erro(`${onde}: falta "${campo}"`);
      }
    }
    if (!Array.isArray(p.sizes)) throw erro(`${onde}: "sizes" não é uma lista`);
    if (!Array.isArray(p.images)) throw erro(`${onde}: "images" não é uma lista`);
    if (p.price_cents !== undefined && !Number.isInteger(p.price_cents)) {
      throw erro(`${onde}: "price_cents" não é inteiro (${p.price_cents})`);
    }

    const produto = {
      id: p.id,
      slug: p.slug,
      name: p.name,
      sizes: p.sizes,
      images: p.images.map((img, j) => {
        for (const campo of ["url_600", "url_1200"]) {
          if (typeof img?.[campo] !== "string" || img[campo] === "") {
            throw erro(`${onde}, foto ${j + 1}: falta "${campo}"`);
          }
        }
        return { src: img.url_600, srcGrande: img.url_1200 };
      }),
      soldOut: Boolean(p.sold_out),
    };

    // Opcionais entram só quando existem, para o JSON não encher de
    // campos vazios e o diff entre publicações ficar legível.
    if (p.price_cents) produto.priceCents = p.price_cents;
    if (p.description) produto.description = p.description;
    if (Array.isArray(p.details) && p.details.length > 0) produto.details = p.details;

    return produto;
  });
}

async function main() {
  const base = process.env.ADMIN_API_URL?.trim();
  const token = process.env.API_TOKEN?.trim();

  if (!base || !token) {
    const faltando = [!base && "ADMIN_API_URL", !token && "API_TOKEN"]
      .filter(Boolean)
      .join(" e ");

    if (noBuildDaCloudflare) {
      throw erro(
        `faltam ${faltando} nas variáveis do projeto na Cloudflare. ` +
          `Sem elas o site republicaria com o catálogo antigo sem avisar ninguém.`,
      );
    }

    const atual = JSON.parse(await readFile(DESTINO, "utf8"));
    console.warn(
      `[catálogo] sem ${faltando}: usando os ${atual.length} produtos de src/data/catalogo.json`,
    );
    return;
  }

  const url = new URL("/api/products", base).toString();
  console.log(`[catálogo] lendo ${url}`);

  const produtos = converter(await buscar(url, token));
  await writeFile(DESTINO, `${JSON.stringify(produtos, null, 2)}\n`, "utf8");

  const semPreco = produtos.filter((p) => p.priceCents === undefined).length;
  const semFoto = produtos.filter((p) => p.images.length === 0).length;
  console.log(
    `[catálogo] ${produtos.length} produtos gravados` +
      (semPreco ? `, ${semPreco} sem preço` : "") +
      (semFoto ? `, ${semFoto} sem foto` : ""),
  );
}

main().catch((e) => {
  console.error(`[catálogo] ${e.message}`);
  // Sai diferente de zero de propósito: o build morre aqui e a Cloudflare
  // mantém no ar o deploy anterior. O site continua de pé com o catálogo
  // bom, e o aviso "Há alterações não publicadas" do admin continua
  // aceso, que é o sinal honesto de que a publicação não foi.
  process.exit(1);
});

#!/usr/bin/env node
// Busca o catálogo no admin e escreve src/data/catalogo.json, que é o que
// o site compila. Roda antes do build (`prebuild` no package.json).
//
// O site é estático: isto acontece UMA VEZ, no build, nunca no
// carregamento da página. É o que faz o admin dormindo, caído ou em
// deploy não derrubar a loja.
//
// Sem ADMIN_API_URL/API_TOKEN o script não faz nada e mantém o
// catalogo.json versionado — é assim que `npm run dev` funciona sem o
// admin de pé. No build da Cloudflare as duas são obrigatórias, senão a
// loja republicaria com o catálogo de ontem sem ninguém perceber.

import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const DESTINO = fileURLToPath(new URL("../src/data/catalogo.json", import.meta.url));

// A máquina do admin no Fly dorme quando ociosa e o Postgres do Neon
// também suspende; os dois acordam na primeira requisição, que por isso
// pode demorar ou falhar. Daí as tentativas com espera crescente.
const TENTATIVAS = 5;
const ESPERA_INICIAL_MS = 2000;
const TIMEOUT_MS = 30000;

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

/** Hex de 6 dígitos, minúsculo — o formato que o admin valida. */
const HEX = /^#[0-9a-f]{6}$/;

/**
 * Tira os marcadores de item que vêm colados no texto quando a descrição
 * é copiada e colada no admin.
 *
 * Na conversão, e não no componente: o site não deve ter código que sabe
 * de um detalhe de como o texto foi digitado.
 */
function limparTexto(texto) {
  return texto
    .split("\n")
    .map((linha) => linha.replace(/\u{1F4CD}/gu, " ").replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .trim();
}

/**
 * Palavras que ficam minúsculas no meio de um título, em português:
 * "Coleção de Verão", e não "Coleção De Verão". A primeira palavra é
 * exceção e sobe sempre, mesmo sendo uma destas.
 */
const ATONAS = new Set([
  "a", "as", "ao", "aos", "com", "da", "das", "de", "do", "dos", "e", "em",
  "na", "nas", "no", "nos", "o", "os", "para", "por", "um", "uma",
]);

/**
 * Põe um nome em caixa de título — o da coleção e o da peça. Na
 * conversão, e não no componente, como a limpeza dos marcadores.
 *
 * Baixa tudo antes de subir a inicial, que é o que conserta o nome
 * cadastrado em CAIXA ALTA. O preço é que uma sigla perde a caixa
 * ("Coleção SP" vira "Coleção Sp"); é raro o bastante para não valer uma
 * regra adivinhando siglas, que erraria em cima de nome comum curto.
 */
function caixaDeTitulo(nome) {
  return nome
    .trim()
    .split(/\s+/)
    .map((palavra, i) => {
      const baixa = palavra.toLocaleLowerCase("pt-BR");
      if (i > 0 && ATONAS.has(baixa)) return baixa;
      // charAt/slice e não [0]: um nome que comece com emoji ou acento
      // composto não pode ser cortado no meio do caractere.
      return baixa.charAt(0).toLocaleUpperCase("pt-BR") + baixa.slice(1);
    })
    .join(" ");
}

/**
 * Converte a resposta do admin (snake_case) para o tipo do site.
 *
 * As diferenças que importam:
 * - `price_cents` vem ausente quando a peça ainda não tem preço. Ausente
 *   aqui vira ausente lá, e o site não mostra preço nenhum.
 * - cada foto vem como url_600/url_1200, sem rótulo de ângulo: a ordem é
 *   que importa, e a primeira é a capa.
 * - `collection` vem como objeto ou como null, nunca ausente. Null vira
 *   campo omitido, para "não tem coleção" ter um significado só.
 * - as fotos e o estoque são **da cor**, não da peça.
 *
 * Tudo que não bater com isso derruba o build de propósito: é melhor a
 * Cloudflare manter o deploy anterior do que publicar um catálogo torto.
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
    if (p.price_cents !== undefined && !Number.isInteger(p.price_cents)) {
      throw erro(`${onde}: "price_cents" não é inteiro (${p.price_cents})`);
    }

    // A resposta antiga, de antes das cores, tinha "images" no topo e
    // nada mais. Vale um erro com nome próprio: sem ele o build morre
    // dizendo só que falta um campo, e a causa — admin mais velho que o
    // site — leva meia hora para aparecer.
    if (p.colours === undefined && Array.isArray(p.images)) {
      throw erro(
        `${onde}: a resposta não tem "colours", só o "images" antigo. ` +
          `O admin está mais velho que o site: suba a versão do admin com ` +
          `cores em /api/products antes de publicar.`,
      );
    }
    if (!Array.isArray(p.colours)) throw erro(`${onde}: "colours" não é uma lista`);
    // Lista vazia passa de propósito: é o mesmo caso de uma peça sem
    // foto, que o placeholder já resolve, e não vale derrubar a
    // publicação inteira.

    const produto = {
      id: p.id,
      slug: p.slug,
      name: caixaDeTitulo(p.name),
      sizes: p.sizes,
      colours: converterCores(p.colours, p.sizes, onde),
      soldOut: Boolean(p.sold_out),
    };

    // Opcionais entram só quando existem, para o diff entre publicações
    // ficar legível.
    if (p.price_cents) produto.priceCents = p.price_cents;

    // A limpeza pode esvaziar o texto, e aí o campo não entra: o site
    // trata ausente como "não tem descrição", não como string vazia.
    const descricao = p.description ? limparTexto(p.description) : "";
    if (descricao) produto.description = descricao;

    if (p.collection !== undefined && p.collection !== null) {
      for (const campo of ["id", "name"]) {
        if (typeof p.collection[campo] !== "string" || p.collection[campo] === "") {
          throw erro(`${onde}: "collection" sem "${campo}"`);
        }
      }
      const nome = caixaDeTitulo(p.collection.name);
      // Só espaço no campo: melhor a peça ficar sem coleção do que o
      // catálogo ganhar um título em branco.
      if (nome) produto.collection = { id: p.collection.id, name: nome };
    }

    if (Array.isArray(p.details)) {
      const details = p.details
        .filter((d) => typeof d === "string")
        .map(limparTexto)
        .filter(Boolean);
      if (details.length > 0) produto.details = details;
    }

    return produto;
  });
}

function converterCores(cores, sizes, onde) {
  const nomes = new Set();

  return cores.map((c, j) => {
    const ondeCor = `${onde}, cor ${j + 1}${typeof c?.name === "string" && c.name ? ` (${c.name})` : ""}`;

    for (const campo of ["id", "name"]) {
      if (typeof c?.[campo] !== "string" || c[campo] === "") {
        throw erro(`${ondeCor}: falta "${campo}"`);
      }
    }
    // Duas cores de mesmo nome dariam duas fichas idênticas no seletor,
    // sem jeito de saber qual é qual.
    const nome = c.name.trim().toLowerCase();
    if (nomes.has(nome)) throw erro(`${ondeCor}: nome de cor repetido na peça`);
    nomes.add(nome);

    if (!Array.isArray(c.images)) throw erro(`${ondeCor}: "images" não é uma lista`);
    if (typeof c.tracks_stock !== "boolean") {
      throw erro(`${ondeCor}: "tracks_stock" não é booleano (${c.tracks_stock})`);
    }
    if (!Array.isArray(c.stock)) throw erro(`${ondeCor}: "stock" não é uma lista`);
    // Cor não contada com lançamento é contradição: o site mostraria os
    // tamanhos sem número e jogaria a quantidade fora em silêncio.
    if (!c.tracks_stock && c.stock.length > 0) {
      throw erro(`${ondeCor}: "tracks_stock" é falso mas vieram ${c.stock.length} lançamentos`);
    }

    // O hex é opcional, e sem ele a cor cai na ficha de texto. Mas hex
    // torto derruba o build: melhor manter o deploy anterior do que
    // publicar uma bolinha preta onde era coral.
    let hex;
    if (c.hex !== undefined) {
      if (!Array.isArray(c.hex)) throw erro(`${ondeCor}: "hex" não é uma lista`);
      if (c.hex.length > 2) {
        throw erro(`${ondeCor}: "hex" tem ${c.hex.length} cores, o máximo é 2`);
      }
      for (const valor of c.hex) {
        if (typeof valor !== "string" || !HEX.test(valor)) {
          throw erro(`${ondeCor}: "hex" inválido (${valor}) — esperava #rrggbb minúsculo`);
        }
      }
      // Lista vazia vira ausente, para "não tem hex" ter um significado
      // só.
      if (c.hex.length > 0) hex = c.hex;
    }

    const tamanhos = new Set();
    const stock = c.stock.map((s) => {
      if (!sizes.includes(s?.size)) {
        throw erro(`${ondeCor}: tamanho "${s?.size}" fora da grade da peça (${sizes.join(", ")})`);
      }
      if (tamanhos.has(s.size)) throw erro(`${ondeCor}: tamanho "${s.size}" lançado duas vezes`);
      tamanhos.add(s.size);
      // Zero é "indisponível" e tem de sobreviver à viagem: um zero
      // sumido vira "não contado", que é o oposto.
      if (!Number.isInteger(s.quantity) || s.quantity < 0) {
        throw erro(`${ondeCor}, tamanho ${s.size}: "quantity" não é inteiro não-negativo (${s.quantity})`);
      }
      return { size: s.size, quantity: s.quantity };
    });

    const cor = {
      id: c.id,
      name: c.name,
      images: c.images.map((img, k) => {
        for (const campo of ["url_600", "url_1200"]) {
          if (typeof img?.[campo] !== "string" || img[campo] === "") {
            throw erro(`${ondeCor}, foto ${k + 1}: falta "${campo}"`);
          }
        }
        return { src: img.url_600, srcGrande: img.url_1200 };
      }),
      tracksStock: c.tracks_stock,
      stock,
    };

    if (hex) cor.hex = hex;

    return cor;
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
  const semFoto = produtos.filter((p) =>
    p.colours.every((c) => c.images.length === 0),
  ).length;
  const cores = produtos.reduce((n, p) => n + p.colours.length, 0);
  const comHex = produtos.reduce(
    (n, p) => n + p.colours.filter((c) => c.hex !== undefined).length,
    0,
  );
  const colecoes = new Set(
    produtos.flatMap((p) => (p.collection ? [p.collection.name] : [])),
  );
  console.log(
    `[catálogo] ${produtos.length} produtos gravados, ${cores} cores` +
      `, ${comHex} com hex` +
      (colecoes.size ? `, coleções: ${[...colecoes].join(", ")}` : "") +
      (semPreco ? `, ${semPreco} sem preço` : "") +
      (semFoto ? `, ${semFoto} sem foto` : ""),
  );
}

main().catch((e) => {
  console.error(`[catálogo] ${e.message}`);
  // Sai diferente de zero de propósito: o build morre aqui e a
  // Cloudflare mantém no ar o deploy anterior, com o aviso "Há alterações
  // não publicadas" do admin aceso.
  process.exit(1);
});

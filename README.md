# Vênus Oasis — catálogo

Site institucional da Vênus Oasis, moda praia. **Catálogo somente leitura** — não vende, não tem carrinho nem backend. Serve para dar credibilidade à marca enquanto a venda acontece por indicação e WhatsApp.

Domínio: **venusoasis.com.br**

## Rodando

```bash
npm install
npm run dev
```

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Typecheck + build de produção em `dist/` |
| `npm run preview` | Serve o build local, igual à produção |
| `npm run lint` | oxlint |

## Páginas

| Rota | O que é |
|---|---|
| `/` | Hero + catálogo, com troca de ângulo no card e scroll infinito |
| `/produto/:slug` | Página da peça: galeria, preço, tamanhos, detalhes |

O roteamento é no cliente. O arquivo [`public/_redirects`](public/_redirects) faz o servidor devolver o `index.html` em qualquer caminho — **sem ele, abrir `/produto/...` direto ou dar F5 retorna 404** no Cloudflare Pages.

## Mexendo no catálogo

Tudo vive em [`src/data/products.ts`](src/data/products.ts). Não há banco nem painel: editar o arquivo e dar push já publica.

```ts
{
  id: "7",
  slug: "biquini-lua",          // único; nomeia a pasta das fotos
  name: "Biquíni Lua",
  priceCents: 18900,            // R$ 189,00 — centavos inteiros, nunca 189.00
  sizes: ["P", "M", "G"],
  images: [
    { src: "/produtos/biquini-lua/frente.jpg", label: "Frente" },
    { src: "/produtos/biquini-lua/costas.jpg", label: "Costas" },
  ],
  description: "Texto curto.",  // cortado em 2 linhas no card
  details: ["Uma linha", "por característica"],  // só na página da peça
  soldOut: false,               // opcional, mostra a tarja "Esgotado"
}
```

**Preço é sempre em centavos inteiros.** Float quebra: `29.90 * 3` em JavaScript dá `89.69999999999999`. O `formatBRL()` cuida da exibição.

### Fotos

Uma pasta por peça em `public/produtos/<slug>/`. Cada entrada em `images` precisa de um `label` dizendo o ângulo — ele vira o botão de troca no card, o rótulo da miniatura e o alt text da imagem. Por isso vale escrever "Costas" ou "Perfil", e não "Imagem 2".

A primeira imagem é a capa do card. Recorte **2:3 (retrato)**; outras proporções funcionam mas são cortadas.

Se `images` ficar vazio, a peça cai num placeholder gerado — gradiente determinístico com as iniciais e o rótulo "foto em breve". Não é uma flag: assim que o array tiver conteúdo, aquele produto passa a mostrar a foto sozinho.

### Logo

Todos os arquivos saíram do mesmo original (`1254×1254`, JPEG) e vivem em `public/`:

| Arquivo | Onde aparece |
|---|---|
| `logo.png` | Lockup completo — monograma + nome. Só no hero. |
| `logo-wordmark.png` | Só "VÊNUS OASIS". Cabeçalho das páginas de peça e rodapé. |
| `og-image.jpg` | Preview de link (1200×630). |
| `favicon-32.png`, `favicon-180.png` | Aba do navegador e ícone no celular. |

São duas versões porque o lockup inteiro fica alto demais num cabeçalho: encolhido para caber, o monograma vira um borrão.

**Sobre o fundo preto.** Os arquivos têm fundo preto chapado, e o site usa `#08090a` — coladas cruas, apareceria um retângulo levemente diferente ao redor da marca. [`Logo.css`](src/components/Logo.css) resolve com `mix-blend-mode: screen`: *screen* com preto devolve exatamente o pixel de baixo, então o fundo some e a arte continua idêntica. Também funciona por cima do brilho do hero, onde um recorte com transparência mostraria borda dura.

O efeito colateral é que **a logo só funciona sobre fundo escuro**. Se algum dia houver uma seção clara, aí sim vale gerar um PNG com transparência de verdade.

Para regerar os recortes a partir de um original novo, o script está em [`scripts/logo.py`](scripts/logo.py).

`Logo.tsx` aceita `alt=""` — use quando o elemento ao redor já nomear a marca (um link com `aria-label`), senão o leitor de tela anuncia "Vênus Oasis" duas vezes.

### Cores e tipografia

Tudo em [`src/styles/tokens.css`](src/styles/tokens.css). É o único arquivo a mexer para ajustar a identidade.

A paleta sai da logo — dourado champagne de um lado, turquesa do outro, sobre preto. O token `--brand-gradient` reproduz essa transição e é usado nos filetes e no wordmark.

O dourado e o turquesa entram **só em detalhe**: preço, foco, borda ativa, filetes, brilho do hero. Texto corrido fica sempre em `--text`, um off-white levemente quente — cor saturada sobre preto puro vibra e cansa a leitura.

### O filete da marca

A classe `.brand-rule` (em [`global.css`](src/styles/global.css)) desenha um filete de 2px com o degradê `--brand-rule`, apagando nas pontas para não bater seco na borda da tela. Use com `.brand-rule--bottom` ou `.brand-rule--top`.

Ele é reservado às **fronteiras estruturais** — cabeçalho/corpo e corpo/rodapé. Divisões internas (entre seções, entre blocos de texto) continuam com linha lisa em `--line`. A regra existe para o degradê significar "aqui muda de contexto": se todas as linhas virassem degradê, ele deixaria de dizer qualquer coisa e viraria enfeite.

É pseudo-elemento porque `border` não aceita gradiente.

### A onda nos cards

No hover de um card, uma onda animada sobe no rodapé da foto ([`ProductCard.css`](src/components/ProductCard.css)). São duas camadas em velocidades e alturas diferentes — uma onda só lê como faixa deslizando; duas em ritmos distintos dão sensação de água. O formato vem de uma máscara SVG e a cor vem de `--brand-gradient-deep`, então a onda é a paleta da marca recortada em onda.

Três decisões que valem preservar se alguém mexer:

- Usa `--brand-gradient-deep`, não `--brand-gradient`. O degradê normal passa por um champagne quase branco que sumiria sobre o rodapé branco das fotos.
- **A animação desloca a máscara, não o elemento.** Como a máscara é `repeat-x`, deslocá-la exatamente um ladrilho (`--tile`) fecha o ciclo em qualquer largura de card. Mover o elemento só fecharia se a largura fosse múltiplo do ladrilho — impossível de garantir num grid responsivo — e ainda arrastaria o degradê junto, que voltaria ao lugar de repente no fim do ciclo.
- A animação fica `paused` e só roda no hover. Seis cards animando o tempo todo gastam bateria à toa.

Sobre o desenho: um comprimento de onda inteiro por ladrilho, amplitude baixa, ladrilhos largos (165px e 240px). Onda curta e alta lê como desenho infantil; aberta e rasa lê como maresia. As duas camadas têm períodos que não são múltiplos um do outro (9s e 14s), então o conjunto demora a se repetir.

Com `prefers-reduced-motion` a onda continua aparecendo, parada.

**A onda é só desktop** — depende de hover, e em tela de toque não existe. Como a maior parte do tráfego vem do Instagram, ou seja, celular, é um detalhe que a maioria não vai ver. Se quiser presença no mobile, o caminho é mostrar a onda parada (sem animação) dentro de `@media (hover: none)`.

A fonte de display é uma serifada de alto contraste (Didot → Bodoni MT → Georgia). **Sem webfont**: uma requisição a menos e zero risco de piscar a fonte errada no carregamento. Em máquinas sem Didot nem Bodoni o fallback é Georgia, que é mais suave mas mantém o caráter serifado.

## Publicando

Estático, sem servidor. No Cloudflare Pages:

- Build: `npm run build`
- Diretório de saída: `dist`

Cada push na branch principal republica sozinho.

## Ainda falta

- **Otimizar as fotos.** Hoje são JPEGs originais, ~2,1 MB no total, e é de longe o maior peso da página. Converter para WebP em duas larguras (uma para card, uma para a página da peça) corta uns 60% — é o maior ganho de performance disponível, e vale fazer antes de o catálogo crescer.
- Nomes, preços e tamanhos são provisórios. As fotos são do protótipo.

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
| `npm run catalogo` | Rebusca o catálogo no admin (roda sozinho antes do build) |
| `npm run build` | Typecheck + build de produção em `dist/` |
| `npm run preview` | Serve o build local, igual à produção |
| `npm run lint` | oxlint |

## Páginas

| Rota | O que é |
|---|---|
| `/` | Hero, catálogo (`#colecao`) e as três seções de texto: `#lookbook`, `#comprar`, `#duvidas` |
| `/produto/:slug` | Página da peça: trilho de fotos, seletor de cor, preço, grade de tamanhos com disponibilidade, descrição, destaques e acordeões |

O **cabeçalho** é o mesmo em todas as rotas, grudado no alto, com o menu
apontando para as âncoras da home. Abaixo de 900px o menu some — é por
isso que a volta para a coleção, na página da peça, mora no corpo.

As três seções de texto existem porque o menu aponta para elas. O que
veio do protótipo foi ajustado numa coisa: **o site não vende.** O
protótipo prometia pagamento, frete e troca em 7 dias; aqui esses
detalhes são remetidos ao WhatsApp, que é onde alguém pode cumpri-los. A
"Lista VIP" do protótipo ficou de fora pelo mesmo motivo.

O roteamento é no cliente. O arquivo [`public/_redirects`](public/_redirects) faz o servidor devolver o `index.html` em qualquer caminho — **sem ele, abrir `/produto/...` direto ou dar F5 retorna 404** no Cloudflare Pages.

## Mexendo no catálogo

**O catálogo não se edita aqui.** Quem mexe nele é o admin
(`../venus-admin`), que as donas da marca usam sozinhas, e as peças
chegam na hora do build:

```
admin salva → dona clica "Publicar"
   → deploy hook da Cloudflare
   → scripts/catalogo.mjs lê GET /api/products
   → src/data/catalogo.json → vite build → site no ar (~1 min)
```

O site continua **estático**: isso acontece uma vez, no build, nunca no
carregamento da página. Admin dormindo, caído ou em deploy não derruba a
loja.

[`src/data/catalogo.json`](src/data/catalogo.json) é **gerado** — editar à
mão não adianta, a próxima publicação desfaz. A cópia que está no
repositório existe para `npm run dev` rodar sem o admin de pé.

### Variáveis

| Variável | Para quê |
|---|---|
| `ADMIN_API_URL` | Endereço do admin, ex. `https://admin.venusoasis.com.br` |
| `API_TOKEN` | O mesmo valor do `API_TOKEN` no `fly secrets` do admin |

As duas ficam nas *environment variables* do projeto na Cloudflare
(`API_TOKEN` como **secret**). Localmente:

```bash
ADMIN_API_URL=http://localhost:8080 API_TOKEN=… npm run catalogo
```

Sem elas o script não faz nada e mantém o catálogo versionado — é o que
permite desenvolver offline. **No build da Cloudflare (`CF_PAGES`) as
duas são obrigatórias**, senão a loja republicaria com o catálogo de
ontem sem ninguém perceber.

### Quando a API não responde

O script tenta 5 vezes, com espera dobrando a cada tentativa (2s, 4s, 8s,
16s): a máquina do admin no Fly dorme quando ociosa e o Postgres do Neon
suspende, e os dois acordam na primeira requisição.

Se ainda assim não responder, **o build falha de propósito** e a
Cloudflare mantém o deploy anterior no ar. A loja fica de pé com o
catálogo bom e o aviso "Há alterações não publicadas" continua aceso no
admin — o sinal honesto de que a publicação não foi. A alternativa,
publicar o catálogo antigo e dizer que deu certo, esconde a falha.

### Preço

**Sempre em centavos inteiros.** Float quebra: `29.90 * 3` em JavaScript
dá `89.69999999999999`. O `formatBRL()` cuida da exibição.

Peça ainda sem preço vem **sem `priceCents`** (o admin omite o campo
enquanto ninguém precificou) e o site **não mostra preço nenhum**: nem
"R$ 0,00", nem "Consulte". A peça continua listada, só sem a linha de
preço, e a nota "Preço informativo" some junto na página da peça.

### Cores, tamanhos e estoque

Uma peça sai em uma ou mais **cores**, e é a cor que tem as fotos e as
quantidades — não a peça. Trocar de cor no site troca a galeria.

O catálogo chega com três estados que não podem ser confundidos, e
[`src/lib/estoque.ts`](src/lib/estoque.ts) é o único lugar que os traduz:

| No dado | No site |
|---|---|
| `tracksStock: false` | Tamanhos sem número nenhum. **Ninguém contou** essa cor — não quer dizer que acabou. |
| `quantity` ≥ 1 | "3 peças em estoque" na página da peça |
| `quantity` 0, ou tamanho sem lançamento | "Indisponível", e o tamanho sai riscado |
| `soldOut` | Vence tudo: é a chave manual das donas, por cima de qualquer contagem |

O erro fácil é ler "não contada" como "zerada", que esgotaria no site
toda peça que as donas ainda não contaram — elas catalogam antes de
contar, como catalogam antes de precificar.

`sizes` é a **grade da peça**, não o que tem em estoque: o seletor
renderiza dela, e o tamanho que acabou aparece riscado em vez de sumir.
Sumindo, ninguém saberia se o tamanho nunca existiu ou se esgotou.

Na página da peça cor e tamanho vêm **antes do texto longo**, e o
seletor de cor fica acima do de tamanho: é a ordem em que a escolha
acontece, e no celular "o meu tamanho existe nessa cor?" é a pergunta
que decide. Enterrá-la sob dois parágrafos custaria um scroll inteiro. É
**uma ordem só**, igual no desktop e no celular — ordem visual diferente
da do DOM estraga a navegação por teclado.

A opção escolhida — cor, tamanho — leva o anel com o degradê da marca
(`.brand-ring`, em [`global.css`](src/styles/global.css)), e o tamanho
que acabou leva um traço atravessando o botão inteiro.

**No card** a cor troca a galeria e apaga os tamanhos que faltam, mas
**não** mostra número — número só na página da peça, onde há espaço para
o aviso de que ele pode estar velho. É um card por peça, com seletor,
não um card por cor.

**Peça de uma cor só não ganha seletor.** Não há o que escolher, e as
peças que existiam antes das cores foram batizadas de "Única" pelo
admin, que não diz nada a ninguém.

### A bolinha de cor

O seletor é o mesmo componente no card e na página da peça
([`SeletorCor.tsx`](src/components/SeletorCor.tsx)):

| No dado | No site |
|---|---|
| `hex: ["#f4785c"]` | Bolinha chapada |
| `hex: ["#f4785c", "#f4efe6"]` | Peça bicolor: bolinha dividida na diagonal |
| sem `hex` | A ficha de texto com o nome escrito |

A parada do degradê é **dura** (`A 0 50%, B 50% 100%`): sem as paradas
duplas o corte sai esfumaçado e parece defeito de renderização.

A escolha é **no dado**, como `images: []` — cada cor vira bolinha
sozinha quando a dona preencher o hex no admin, sem flag e sem código
morto. Até lá as duas formas convivem na mesma fileira, e tudo bem.

Disco de **28px dentro de um alvo de 44px**: os 11px do protótipo não
comportam diagonal legível nem toque de polegar, e quase todo o tráfego
vem do Instagram, ou seja, de celular. O contorno interno
(`box-shadow: inset`) é **obrigatório** — sem ele "Off-white" some no
tema claro e "Preto" some no escuro, e existem peças com as duas.

E **nunca só cor**: a bolinha leva o nome no nome acessível do botão, e
o nome da escolhida aparece visível em dois lugares na página da peça —
a plaquinha sobre a foto e a linha abaixo das bolinhas.

O admin precisa mandar `hex` como lista de **0 a 2** strings `#rrggbb`
minúsculas. Hex torto derruba o build de propósito, como os outros
campos. Lista vazia é normalizada para campo ausente, para "não tem" ter
um significado só.

**O número pode estar velho.** Dar baixa no estoque pelo admin só acende
o aviso "Há alterações não publicadas" — não republica sozinho. Entre a
venda e a publicação o site mostra o número de antes, e é por isso que a
nota da página da peça diz que quantidades e preço são informativos e
pede confirmação no WhatsApp.

### Fotos

As fotos são enviadas pelo admin e ficam no R2, servidas por `fotos.venusoasis.com.br`. Cada uma chega em duas larguras: `src` (600w) no card, `srcGrande` (1200w) na página da peça. **As fotos são da cor**, não da peça: cada cor tem a sua lista, e a primeira da cor é a capa.

**Não há rótulo de ângulo.** O que importa é a ordem — a primeira é a capa — e o alt text é "<nome> — foto N".

### O trilho de fotos

As fotos ficam lado a lado num contêiner que rola com encaixe
(`scroll-snap`), não empilhadas com uma visível por vez. É o mesmo
mecanismo no card e na página da peça, num hook só
([`useTrilhoFotos.ts`](src/hooks/useTrilhoFotos.ts)) — ele substituiu a
tira de miniaturas e os chevrons.

| Quem | Como navega |
|---|---|
| Dedo | Desliza, com a inércia do sistema |
| Mouse | Passar por cima mapeia a posição X para o índice |
| Teclado | As setas rolam o trilho, que é `tabindex="0"` |

Três coisas que vale preservar:

- **Quem manda no índice é a posição do trilho**, lida no evento
  `scroll`. Assim o dedo, as setas e a roda horizontal do mouse
  atualizam o indicador sem um ramo de código para cada um.
- O mouse só escreve o `scrollLeft` **quando o índice muda**. Escrever a
  cada pixel de movimento briga com a animação de encaixe e a foto fica
  tremendo.
- **O `tabindex="0"` é o que mantém as outras fotos alcançáveis** agora
  que não há miniaturas. Não tire.

O indicador de segmentos no rodapé da foto é `aria-hidden` e
`pointer-events: none` — é indicador, não controle. Quem anuncia para
leitor de tela é a região viva com "Foto 2 de 4". Ele leva cor chapada
em `--accent` sobre um véu `--scrim-strong`: degradê ali seria um
terceiro significado além de fronteira e escolha, e sem o véu os
segmentos sumiam no rodapé branco das fotos de produto (medido: 1,60:1
sem véu, 3,02:1 com).

Trocar de cor troca a galeria e **volta para a capa**: a foto de índice 3
da cor anterior não quer dizer nada na nova.

**O repositório não guarda foto de produto.** As do protótipo saíram quando o admin entrou no ar — eram 2,1 MB de JPEG para avaliar o design antes de haver catálogo de verdade. A cópia versionada de `catalogo.json` aponta para duas fotos do **bucket de desenvolvimento** (`venusoasis-fotos-dev`), para `npm run dev` continuar parecido com produção sem peso nenhum no repositório. Se alguém apagar aquelas peças no admin de dev, as URLs quebram: é só rodar `npm run catalogo` de novo contra o admin.

A primeira imagem é a capa do card. Recorte **2:3 (retrato)**; outras proporções funcionam mas são cortadas.

Se a cor escolhida ficar sem fotos, ela cai num placeholder gerado — gradiente determinístico com as iniciais e o rótulo "foto em breve". Não é uma flag: assim que a cor tiver foto, ela passa a mostrá-la sozinha.

### Logo

Todos os arquivos saíram do mesmo original (`1254×1254`, JPEG) e vivem em `public/`:

| Arquivo | Onde aparece |
|---|---|
| `logo.png` | Lockup completo — monograma + nome. Hero e rodapé. |
| `logo-wordmark.png` | Só "VÊNUS OASIS". Cabeçalho de todas as rotas. |
| `og-image.jpg` | Preview de link (1200×630). |
| `favicon-32.png`, `favicon-180.png` | Aba do navegador e ícone no celular. |

São duas versões porque o lockup inteiro fica alto demais num cabeçalho: ele é quase quadrado (760×704), e numa fileira de 64px sairia com 43px de largura — o nome dentro dele viraria um borrão. O handoff do redesign pedia o lockup a 40px de altura no cabeçalho; esta é a divergência, e o motivo é este.

`Logo.tsx` separa o arquivo (`lockup`) do tamanho (`size`) justamente por isso: o rodapé quer o lockup num tamanho médio, o cabeçalho quer o wordmark pequeno. Nas classes do lockup quem manda é a **altura**, porque numa fileira é a vertical que importa; no wordmark, a largura.

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

Estático, sem servidor, no **Cloudflare Pages** (projeto `venus-site`,
ligado a `brendalima/venus-site`):

- Build: `npm run build`
- Diretório de saída: `dist`
- Variáveis: `ADMIN_API_URL` e `API_TOKEN` (ver acima)

Cada push na branch principal republica sozinho. O admin republica pelo
botão "Publicar alterações", que faz POST num **deploy hook** criado em
*Settings > Builds > Deploy hooks*; a URL vai para o Fly em
`DEPLOY_HOOK_URL`.

Como é o build que busca o catálogo, publicar pelo admin e publicar por
push fazem exatamente a mesma coisa.

## Ainda falta

- **WebP.** As fotos já vêm do admin redimensionadas em 600w e 1200w (o 600w pesa uns 45 KB, contra 250 KB dos JPEGs do protótipo), então o problema encolheu bastante. WebP ainda cortaria uns 60% em cima disso, mas o trabalho agora é no admin (`../venus-admin`, processamento em Go puro), não aqui.
- Nomes, preços e tamanhos são provisórios. As fotos são do protótipo.

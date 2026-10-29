# Regras de trabalho — site da Vênus Oasis

Convenções duráveis deste repositório.

---

## O que este site é

Catálogo institucional de uma marca de moda praia. **Somente leitura**:
não vende, não tem carrinho, não tem backend. Existe para dar
credibilidade à marca enquanto a venda acontece por indicação e WhatsApp.

## A invariante

O site é **estático** e não depende de backend em tempo de requisição.

Os produtos vêm da API do admin (`../venus-admin`) **no build**, não no
carregamento da página: `scripts/catalogo.mjs` reescreve
`src/data/catalogo.json` antes de cada `vite build`. O que isso compra:
backend dormindo, caído ou em deploy não derruba a loja.

Se a API não responder, **o build falha de propósito** e a Cloudflare
mantém o deploy anterior no ar. Publicar o catálogo de ontem dizendo que
deu certo é pior do que não publicar: o aviso "Há alterações não
publicadas" no admin continua aceso e denuncia a falha.

Qualquer proposta de buscar dados em tempo de execução quebra essa
propriedade. Pode vir a ser a decisão certa — mas diga isso em voz alta,
não deixe acontecer de lado.

## Idioma

**Português em tudo**: código, comentários, nomes, README, textos de
interface.

O repositório irmão `../venus-admin` é em **inglês** no código, de
propósito. Não tente uniformizar os dois.

## Identidade visual

A paleta sai da logo: dourado champagne de um lado, turquesa do outro,
sobre preto.

**`src/styles/tokens.css` é o único lugar onde cor e tipografia são
definidas.** Nada de hex solto em componente.

- Dourado e turquesa entram **só em detalhe**: preço, foco, borda ativa,
  filete, bolinha do carrossel. Texto corrido é sempre `--text`. Cor
  saturada
  sobre preto puro vibra e cansa a leitura.
- O filete com degradê (`.brand-rule`) marca **fronteiras estruturais** —
  cabeçalho/corpo, corpo/rodapé. Divisões internas usam linha lisa. Se
  tudo virar degradê, ele deixa de significar "aqui muda de contexto".
- O anel com degradê (`.brand-ring`) marca **a opção escolhida** —
  bolinha de cor, botão de tamanho. É o segundo e último uso
  do degradê: filete é fronteira, anel é escolha. Borda com degradê em
  elemento que não foi escolhido tira o sentido dos dois. Decidido com a
  dona do projeto, que pediu o degradê no lugar do dourado chapado.
  `border` não aceita gradiente, então o anel é feito de fundo em duas
  camadas (padding-box por cima de border-box) — a espessura continua
  sendo a do `border` do componente.
- `--brand-gradient-deep` existe para fundo claro: o degradê normal passa
  por um champagne quase branco que some sobre as fotos.
- A fonte de display é serifada sem webfont. Sem requisição externa e sem
  risco de piscar a fonte errada.

## A home

A home é o protótipo da dona, portado: hero com carrossel de campanha,
faixa de quatro atributos, catálogo, lookbook, "comprar é simples" e
dúvidas. Os textos são os dela — **não suavize**. Já houve uma rodada em
que "troca em até 7 dias" e "Pix ou cartão" foram abrandados em nome de
"o site não vende", e ela pediu de volta: a decisão de o que o site
promete é dela, não do código.

Duas coisas ficaram de fora do protótipo de propósito: a **Lista VIP**
(captura de nome que ninguém receberia, já que não há backend) e a
**linha de descrição abaixo do nome no card**.

**O título do catálogo é o nome da coleção principal**, que é a que tem
mais peças (`src/lib/colecao.ts`). O admin registra as coleções à parte e
cada peça aponta para uma, ou para nenhuma (`collection: null`).

O nome sai do build **em caixa de título** — as donas cadastram como dá,
e o nome vai para o título em corpo grande. A normalização é na
conversão, não no componente, igual aos 📍 da descrição. Átonas ficam
minúsculas no meio ("Coleção de Verão", não "Coleção De Verão").

Pela contagem, e não pela data: o catálogo é pequeno e as donas cadastram
a coleção nova aos poucos, peça por peça. Pela data o título viraria a
coleção nova já na primeira peça publicada, com a grade ainda cheia da
anterior.

Por ora é **só o título** — a grade continua sendo uma só, com as peças
de todas as coleções. Daí a frase ao lado do título não nomear nem
descrever a coleção: ela mentiria assim que a principal virasse outra.

## Cabeçalho e rodapé

As duas faixas (`.faixa-escura`) ficam **pretas nos dois temas**, e o
corpo da página é que clareia. Não é esquecimento: a logo tem fundo preto
chapado e vive de `mix-blend-mode: screen`, que só faz o preto sumir
sobre fundo escuro. O protótipo clareia as faixas e inverte a logo com
`filter`; aqui não, e a divergência foi decidida com a dona do projeto.
Alguém vai tentar "consertar" — é isto.

O menu do cabeçalho some abaixo de 900px. É por isso que a volta para a
coleção, na página da peça, mora no corpo e não no cabeçalho: ali ela
desapareceria junto, justamente no celular.

O lockup é quase quadrado (760×704), então **o cabeçalho usa o
wordmark**. Encolhido para caber numa fileira de 64px, o lockup sairia
com 43px de largura e o nome dentro dele viraria um borrão. O lockup
completo fica no rodapé, onde há altura para ele.

## Logo

Os arquivos em `public/` têm fundo preto chapado e usam
`mix-blend-mode: screen`, que faz o preto desaparecer sem recorte.

**Consequência: a logo só funciona sobre fundo escuro.** Se um dia
houver seção clara, aí sim gere um PNG com transparência de verdade.

Para regerar os recortes a partir de um original novo:
`python scripts/logo.py <arquivo>`.

## Fotos de campanha

As três do carrossel do hero vivem em `public/` (`campanha-*.jpg`), como
a logo: **são arquivos de marca, não peças do catálogo.** A distinção é a
regra toda — foto de peça vem do admin pelo R2 e muda quando as donas
publicam; estas só mudam por decisão de quem desenha a página.

O lookbook ("Luz, pele e cor") não tem foto própria: pega a capa das duas
primeiras peças com foto no catálogo. Assim ele acompanha a coleção
sozinho e o repositório continua sem guardar foto de produto.

## Imagens

- Proporção **2:3**, que é o formato das fotos. Usar 3:4 corta cabeça e
  pés no `object-fit: cover`.
- Sempre `width` e `height` no `<img>`, contra layout shift.
- **Com esses atributos presentes, `aspect-ratio` é ignorado** enquanto
  `height` tiver valor concreto. Use `height: auto` junto. Isso já causou
  miniatura de 1168px de altura.
- `loading="lazy"` em tudo, menos na primeira foto do carrossel e nos
  primeiros cards.
- Produto sem foto cai num placeholder gerado. A escolha é **no dado**
  (`images: []`), não numa flag — assim some sozinho quando a foto
  chegar, sem código morto.
- **O repositório não guarda foto de produto.** Elas vêm do R2 pelo
  catálogo. A cópia versionada de `catalogo.json` aponta para o bucket de
  dev só para o `npm run dev` não ficar sem imagem.

## Dados dos produtos

`src/data/catalogo.json` é **gerado** pelo build a partir de
`GET /api/products`. Não edite à mão. A cópia versionada existe só para
`npm run dev` rodar sem o admin de pé; `src/data/products.ts` apenas a
tipa como `Product[]`, e o `tsc` reprova um JSON fora do tipo (verificado
plantando um campo errado).

**Preço em centavos inteiros**, nunca float: `29.90 * 3` dá
`89.69999999999999`.

**Peça sem preço não mostra preço nenhum.** O admin omite `price_cents`
enquanto a peça não foi precificada — as donas catalogam antes de
precificar. Nada de "R$ 0,00" nem "Consulte": a peça fica listada, sem a
linha de preço. Decidido com a dona do projeto.

**A cor vira bolinha quando tem `hex`** (1 hex chapado, 2 hex divididos
na diagonal com parada dura — sem as paradas duplas o corte sai
esfumaçado). Sem `hex`, ela cai na ficha de texto com o nome escrito: a
escolha é no dado, como `images: []`, e cada cor vira bolinha sozinha
quando a dona preencher. Disco de 28px dentro de alvo de 44px, com
contorno interno obrigatório — sem ele "Off-white" some no tema claro e
"Preto" some no escuro. E **nunca só cor**: o nome vai no nome acessível
do botão e aparece visível na plaquinha sobre a foto e abaixo das
bolinhas.

**Cor é dona das fotos e do estoque**, não a peça. Trocar a cor no site
troca a galeria, e o seletor some quando a peça tem uma cor só — não há
o que escolher, e as peças anteriores às cores se chamam "Única".

**"Não contada" não é "zerada".** `tracksStock` falso quer dizer que
ninguém contou aquela cor: mostre os tamanhos sem número. Zero, ou
tamanho sem lançamento numa cor contada, é "Indisponível". `soldOut`
vence tudo. A tradução dos três estados mora em `src/lib/estoque.ts` e
só deveria existir lá — ler `stock.length` solto num componente é como o
erro volta.

**`sizes` é a grade da peça**, não o que tem em estoque. O tamanho que
acabou aparece riscado, nunca sumido: sumindo, ninguém sabe se ele nunca
existiu ou se esgotou. O risco **atravessa o botão inteiro**, não a
palavra: riscar só a letra some num "P" de três pixels e a ficha parece
disponível de relance.

**`description` é texto longo** — parágrafos separados por linha em
branco, quebrados em `/\n{2,}/` na página da peça — e `details` são
frases inteiras. Foi o que tirou a linha de prosa do card: um trecho de
texto longo cortado em duas linhas não diz nada. O card ficou nome +
bolinhas + preço + grade, e a diferença em relação ao protótipo, que tem
um `<p>` ali, é consciente.

**O número que o site mostra pode estar velho.** Dar baixa no admin só
acende o aviso de publicação, não republica. É o motivo de a nota da
página da peça pedir confirmação no WhatsApp — não tire.

**As fotos não têm rótulo de ângulo.** O que importa é a ordem, e a
primeira é a capa. O alt text é "<nome> — foto N". Cada foto vem em duas
larguras: `src` (600w) no card, `srcGrande` (1200w) na página da peça.

**As fotos ficam num trilho que rola com encaixe** (`useTrilhoFotos`), o
mesmo no card e na página da peça — não há mais miniaturas nem chevrons.
Quem manda no índice é sempre a posição do trilho, lida no `scroll`:
assim o dedo, as setas do teclado e a roda horizontal do mouse atualizam
o indicador sem um ramo de código para cada um. O mouse é o único caso
especial, porque não desliza: a posição X vira índice e escreve o
`scrollLeft`, **só quando o índice muda** — escrever a cada pixel briga
com a animação de encaixe e a foto treme.

O trilho é `tabindex="0"`, e é isso que mantém as outras fotos
alcançáveis por teclado sem controle na tela. **Não tire o `tabindex`.**
O indicador de segmentos é `aria-hidden`; quem anuncia é a região viva
com "Foto 2 de 4". Ele leva cor chapada em `--accent` sobre um véu
(`--scrim-strong`) — degradê ali seria um terceiro significado além de
fronteira e escolha, e sem o véu os segmentos sumiam no rodapé branco das
fotos.

## Acessibilidade

- Conteúdo que só aparece ao rolar precisa de alternativa alcançável por
  teclado. O scroll infinito tem botão "Ver mais" por isso, não por
  redundância.
- `prefers-reduced-motion` respeitado: o carrossel do hero não gira
  sozinho.
- **Conteúdo que se move sozinho precisa de parada alcançável.** O
  carrossel para no hover e no foco, e clicar numa bolinha para de vez —
  só o hover não serve, porque não existe no teclado nem no toque.
- Efeito que depende de `hover` não existe em tela de toque. A maior
  parte do tráfego vem do Instagram, ou seja, celular — diga isso ao
  propor um efeito de hover.

## Verificando

- Renderize em **360px, 768px e 1280px**. 360 é o piso real de celular
  no Brasil.
- O número que importa é **CLS < 0.1**.
- Ao tirar screenshot automatizado, **`networkidle` não basta**: ele
  dispara antes de JPEGs grandes pintarem, e o resultado parece um bug
  que não existe. Espere o `decode()` das imagens.
- Antes de "consertar" algo visual, inspecione o DOM. Já houve conserto
  de problema inexistente por causa de captura prematura.

## Pendente

WebP. As fotos hoje vêm do admin já redimensionadas em 600w e 1200w (o
600w pesa uns 45 KB, contra 250 KB dos JPEGs do protótipo), então o
problema encolheu bastante. WebP ainda cortaria uns 60% em cima disso,
mas o trabalho agora é no admin (`../venus-admin`, processamento em Go
puro), não aqui.

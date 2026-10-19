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
  filete, brilho do hero. Texto corrido é sempre `--text`. Cor saturada
  sobre preto puro vibra e cansa a leitura.
- O filete com degradê (`.brand-rule`) marca **fronteiras estruturais** —
  cabeçalho/corpo, corpo/rodapé. Divisões internas usam linha lisa. Se
  tudo virar degradê, ele deixa de significar "aqui muda de contexto".
- `--brand-gradient-deep` existe para fundo claro: o degradê normal passa
  por um champagne quase branco que some sobre as fotos.
- A fonte de display é serifada sem webfont. Sem requisição externa e sem
  risco de piscar a fonte errada.

## Logo

Os arquivos em `public/` têm fundo preto chapado e usam
`mix-blend-mode: screen`, que faz o preto desaparecer sem recorte.

**Consequência: a logo só funciona sobre fundo escuro.** Se um dia
houver seção clara, aí sim gere um PNG com transparência de verdade.

Para regerar os recortes a partir de um original novo:
`python scripts/logo.py <arquivo>`.

## Imagens

- Proporção **2:3**, que é o formato das fotos. Usar 3:4 corta cabeça e
  pés no `object-fit: cover`.
- Sempre `width` e `height` no `<img>`, contra layout shift.
- **Com esses atributos presentes, `aspect-ratio` é ignorado** enquanto
  `height` tiver valor concreto. Use `height: auto` junto. Isso já causou
  miniatura de 1168px de altura.
- `loading="lazy"` em tudo, menos no hero e nos primeiros cards.
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
existiu ou se esgotou.

**O número que o site mostra pode estar velho.** Dar baixa no admin só
acende o aviso de publicação, não republica. É o motivo de a nota da
página da peça pedir confirmação no WhatsApp — não tire.

**As fotos não têm rótulo de ângulo.** O que importa é a ordem, e a
primeira é a capa. O alt text é "<nome> — foto N" e a miniatura não tem
legenda. Cada foto vem em duas larguras: `src` (600w) no card e na
miniatura, `srcGrande` (1200w) na foto grande da página da peça.

## Acessibilidade

- Conteúdo que só aparece ao rolar precisa de alternativa alcançável por
  teclado. O scroll infinito tem botão "Ver mais" por isso, não por
  redundância.
- `prefers-reduced-motion` respeitado: a onda do card continua visível,
  parada.
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

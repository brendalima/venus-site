# Regras de trabalho — site da Vênus Oasis

Convenções duráveis deste repositório.

---

## O que este site é

Catálogo institucional de uma marca de moda praia. **Somente leitura**:
não vende, não tem carrinho, não tem backend. Existe para dar
credibilidade à marca enquanto a venda acontece por indicação e WhatsApp.

## A invariante

O site é **estático** e não depende de backend em tempo de requisição.

Quando o admin (`../venus-admin`) entrar, os produtos virão da API **no
build**, não no carregamento da página. O que isso compra: backend
dormindo, caído ou em deploy não derruba a loja.

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

## Dados dos produtos

`src/data/products.ts`, tipado. **Preço em centavos inteiros**, nunca
float: `29.90 * 3` dá `89.69999999999999`.

Cada imagem precisa de um `label` dizendo o ângulo. Ele vira o rótulo da
miniatura e o alt text, então escreva "Costas", não "Imagem 2".

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

Otimizar as fotos: 2,1 MB de JPEG, o maior peso da página. WebP em duas
larguras corta uns 60%. Não feito porque adiciona dependência e passo de
build — decisão da dona do projeto.

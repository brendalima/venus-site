import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { BotaoTema } from "./BotaoTema";
import "./Cabecalho.css";

/**
 * As seções da home que o menu alcança. Todas vivem na home, inclusive
 * quando o clique parte da página de uma peça — daí os caminhos
 * absolutos, e daí o `useAncora` em App.tsx, que faz a rolagem acontecer
 * depois de a rota montar.
 */
const MENU = [
  { href: "/#colecao", texto: "Coleção" },
  { href: "/#lookbook", texto: "Lookbook" },
  { href: "/#comprar", texto: "Como comprar" },
  { href: "/#duvidas", texto: "Dúvidas" },
];

/**
 * Cabeçalho do site, igual em todas as rotas.
 *
 * Fica grudado no alto (`sticky`), então o menu e o botão de tema
 * continuam alcançáveis depois de rolar — numa página de peça que é
 * longa, isso é a diferença entre voltar para a coleção e usar o botão do
 * navegador.
 *
 * **A faixa é escura nos dois temas**, por `.faixa-escura`: a logo tem
 * fundo preto chapado e vive de `mix-blend-mode: screen`, que só faz o
 * preto desaparecer sobre fundo escuro. No protótipo as faixas clareiam
 * junto com o corpo, com um `invert` na logo; aqui não, e a diferença foi
 * decidida com a dona do projeto. Ver a nota em global.css antes de
 * "consertar".
 *
 * O menu some abaixo de 900px. É por isso que a volta para a coleção, na
 * página da peça, mora no corpo e não aqui: no celular ela desapareceria
 * junto, e o celular é de onde vem quase todo o tráfego.
 */
export function Cabecalho() {
  return (
    <header className="cabecalho faixa-escura brand-rule brand-rule--bottom">
      <div className="page cabecalho__inner">
        <Link
          to="/"
          className="cabecalho__marca"
          aria-label="Vênus Oasis — página inicial"
        >
          {/* O link já nomeia a marca; alt="" evita o anúncio duplicado. */}
          <Logo alt="" />
        </Link>

        <nav className="cabecalho__menu" aria-label="Seções do site">
          {MENU.map((item) => (
            <Link key={item.href} to={item.href}>
              {item.texto}
            </Link>
          ))}
        </nav>

        <BotaoTema />
      </div>
    </header>
  );
}

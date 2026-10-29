import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { BotaoTema } from "./BotaoTema";
import "./Cabecalho.css";

/**
 * As seções da home que o menu alcança. Caminhos absolutos porque o
 * clique pode partir da página de uma peça — ver `useAncora`.
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
 * **A faixa é escura nos dois temas**, por `.faixa-escura`: a logo tem
 * fundo preto chapado e vive de `mix-blend-mode: screen`, que só faz o
 * preto desaparecer sobre fundo escuro. Ver a nota em global.css antes de
 * "consertar".
 *
 * O menu some abaixo de 900px. É por isso que a volta para a coleção, na
 * página da peça, mora no corpo e não aqui: no celular ela desapareceria
 * junto.
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

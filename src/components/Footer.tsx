import { Logo } from "./Logo";
import "./Footer.css";

/**
 * A faixa é escura nos dois temas (`.faixa-escura`): é o que mantém o
 * `mix-blend-mode: screen` da logo funcionando. Ver a nota em global.css
 * antes de "consertar".
 */
export function Footer() {
  return (
    <footer className="footer faixa-escura brand-rule brand-rule--top">
      <div className="page footer__inner">
        <Logo lockup />

        <div className="footer__textos">
          <p className="footer__legal">
            © {new Date().getFullYear()} Vênus Oasis. Todos os direitos
            reservados.
          </p>
          <p>
            <a
              className="footer__insta"
              href="https://www.instagram.com/venusoasis.br"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram @venusoasis.br
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Logo } from "./Logo";
import "./Footer.css";

/**
 * Rodapé: lockup à esquerda, textos à direita, como no protótipo.
 *
 * As fichas de Instagram e WhatsApp que havia aqui saíram. O WhatsApp
 * virou o botão flutuante, que acompanha a página inteira em vez de
 * esperar alguém rolar até o fim; o Instagram virou o arroba escrito,
 * que é como o protótipo o mostra e como as pessoas procuram.
 *
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

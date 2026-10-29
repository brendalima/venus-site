import { useMatch } from "react-router-dom";
import { findProduct } from "../data/products";
import { linkWhatsApp, MENSAGEM_GERAL, mensagemDaPeca } from "../lib/whatsapp";
import { Logo } from "./Logo";
import "./Footer.css";

/* Ícones inline: a marca não carrega webfont nem biblioteca de ícones,
   então dois SVGs desenhados aqui evitam uma requisição externa. */
function IconeInstagram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconeWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3.4 20.6l1.3-4.4A8.3 8.3 0 1 1 7.8 19.3L3.4 20.6z" />
      <path d="M9 8.4c.3 0 .5.1.6.4l.6 1.4c.1.3 0 .5-.2.7l-.4.4a.4.4 0 0 0-.1.5 6 6 0 0 0 2.7 2.5.4.4 0 0 0 .5-.1l.5-.6c.2-.2.4-.3.7-.2l1.4.7c.3.1.4.4.3.7-.2.8-1 1.3-1.8 1.3-2.5 0-5.8-3.3-5.8-5.8 0-.8.5-1.6 1.3-1.8H9z" />
    </svg>
  );
}

export function Footer() {
  // O rodapé é o mesmo em todas as rotas, mas a conversa não: estando numa
  // peça, o nome dela já vai na mensagem. Slug inválido cai no texto geral.
  const naPeca = useMatch("/produto/:slug");
  const peca = findProduct(naPeca?.params.slug);
  const mensagem = peca ? mensagemDaPeca(peca.name) : MENSAGEM_GERAL;

  return (
    <footer className="footer faixa-escura brand-rule brand-rule--top">
      <div className="page footer__inner">
        <ul className="footer__redes">
          <li>
            <a
              className="footer__rede"
              href="https://www.instagram.com/venusoasis.br"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconeInstagram />
              <span>Instagram</span>
            </a>
          </li>
          <li>
            <a
              className="footer__rede"
              href={linkWhatsApp(mensagem)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconeWhatsApp />
              <span>WhatsApp</span>
            </a>
          </li>
        </ul>

        {/* O lockup completo, como no rodapé do protótipo: aqui há altura
            para o monograma, ao contrário do cabeçalho. */}
        <Logo size="sm" lockup />

        <p className="footer__note">
          Catálogo para consulta. Entre em contato para se informar sobre
          preços e pagamento.
        </p>

        <p className="footer__legal">
          © {new Date().getFullYear()} Vênus Oasis
        </p>
      </div>
    </footer>
  );
}

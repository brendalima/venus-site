import { useMatch } from "react-router-dom";
import { findProduct } from "../data/products";
import { linkWhatsApp, MENSAGEM_GERAL, mensagemDaPeca } from "../lib/whatsapp";
import "./BotaoWhatsApp.css";

/**
 * Botão flutuante de WhatsApp, em todas as rotas.
 *
 * Estando numa peça, o nome dela já vai escrito na mensagem. Slug
 * inválido cai no texto geral.
 */
export function BotaoWhatsApp() {
  const naPeca = useMatch("/produto/:slug");
  const peca = findProduct(naPeca?.params.slug);
  const mensagem = peca ? mensagemDaPeca(peca.name) : MENSAGEM_GERAL;

  return (
    <a
      className="zap"
      href={linkWhatsApp(mensagem)}
      target="_blank"
      rel="noopener noreferrer"
    >
      Falar no WhatsApp
    </a>
  );
}

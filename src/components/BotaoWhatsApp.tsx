import { useMatch } from "react-router-dom";
import { findProduct } from "../data/products";
import { linkWhatsApp, MENSAGEM_GERAL, mensagemDaPeca } from "../lib/whatsapp";
import "./BotaoWhatsApp.css";

/**
 * O botão flutuante de WhatsApp, fixo no canto.
 *
 * O site é um catálogo e a venda acontece na conversa, então o caminho
 * para a conversa não pode depender de rolar até o rodapé. Fica em todas
 * as rotas, como no protótipo.
 *
 * A mensagem muda com a rota, do mesmo jeito que a do rodapé: estando
 * numa peça, o nome dela já vai escrito, o que evita o "qual delas?".
 * Slug inválido cai no texto geral.
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

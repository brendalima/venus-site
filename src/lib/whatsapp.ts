/** Número da marca no formato que o wa.me espera: DDI + DDD + número. */
const NUMERO = "5521970649983";

/**
 * Monta o link do WhatsApp com a mensagem já escrita no campo de texto.
 *
 * A mensagem aparece no compositor de quem clicou, não no nosso — por
 * isso é redigida na voz da cliente ("Vi o catálogo"), e nunca na da
 * marca.
 */
export function linkWhatsApp(mensagem: string): string {
  return `https://wa.me/${NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

export const MENSAGEM_GERAL =
  "Oi! Vi o catálogo da Vênus Oasis e queria saber mais.";

export function mensagemDaPeca(nome: string): string {
  return `Oi! Vi o ${nome} no catálogo da Vênus Oasis e queria saber mais.`;
}

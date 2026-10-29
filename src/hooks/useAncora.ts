import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Rola até a âncora do endereço depois de uma navegação do cliente.
 *
 * O menu do cabeçalho aponta para seções da home (`/#colecao`), e o
 * cabeçalho existe em todas as rotas — clicar em "Coleção" estando numa
 * peça troca de rota e de âncora ao mesmo tempo. O navegador só rola até
 * um `id` no carregamento da página; numa navegação de router ele não
 * sabe que o alvo acabou de nascer.
 *
 * Roda num efeito, ou seja, depois de o DOM estar pronto, que é quando a
 * seção existe. O recuo do cabeçalho grudado vem do `scroll-padding-top`
 * do `html` (ver global.css), não de conta feita aqui.
 */
export function useAncora(): void {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    // Pode não existir: alguém chega com uma âncora velha num link
    // compartilhado. Aí fica onde está, que é melhor que pular para o topo.
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [pathname, hash]);
}

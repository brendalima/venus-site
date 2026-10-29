import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Rola até a âncora do endereço depois de uma navegação do router.
 *
 * O navegador só rola até um `id` no carregamento da página; numa
 * navegação do router ele não sabe que o alvo acabou de nascer. O recuo
 * do cabeçalho grudado vem do `scroll-padding-top` do `html`.
 */
export function useAncora(): void {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    // Pode não existir, se alguém chega com uma âncora velha num link
    // compartilhado. Aí fica onde está, em vez de pular para o topo.
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [pathname, hash]);
}

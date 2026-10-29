import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Rola até a âncora do endereço depois de uma navegação do router.
 *
 * O navegador só rola até um `id` no carregamento da página; numa
 * navegação do router ele não sabe que o alvo acabou de nascer. O recuo
 * do cabeçalho grudado vem do `scroll-padding-top` do `html`.
 *
 * **Depende do `key` da navegação, não do valor do hash.** Clicar em
 * "Ver a coleção" com `#colecao` já no endereço não muda o hash, então um
 * efeito que observasse só o valor não rodaria de novo — e o botão ficava
 * morto depois que a pessoa subia a página com a roda do mouse, ou voltava
 * da página de uma peça. O `key` do router muda a cada navegação, inclusive
 * para o mesmo endereço, e é isso que faz o segundo clique rolar.
 */
export function useAncora(): void {
  const { hash, key } = useLocation();

  useEffect(() => {
    if (!hash) return;

    // Pode não existir, se alguém chega com uma âncora velha num link
    // compartilhado. Aí fica onde está, em vez de pular para o topo.
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [hash, key]);
}

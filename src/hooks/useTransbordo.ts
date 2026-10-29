import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Diz se o conteúdo de um elemento não cabe na largura dele.
 *
 * Serve às fileiras que rolam na horizontal dentro do card, que só viram
 * parada de teclado quando há mesmo o que rolar: região rolável
 * inalcançável por teclado é falha de acessibilidade, e um tabstop a mais
 * por card, sem nada escondido, é ruído na navegação.
 *
 * Por medição e não por um número de itens: cinco tamanhos cabem em
 * 1280px e não cabem em 360px, e o card é fluido entre os dois.
 */
export function useTransbordo<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [transborda, setTransborda] = useState(false);

  const medir = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // 1px de folga: arredondamento de subpixel acusa transbordo onde não
    // há, e a fileira ganharia um tabstop que não leva a lugar nenhum.
    setTransborda(el.scrollWidth - el.clientWidth > 1);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    medir();

    // Os filhos também: a fileira de cores muda de forma quando uma cor
    // ganha hex e a ficha de texto vira bolinha.
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    for (const filho of el.children) ro.observe(filho);

    return () => ro.disconnect();
  }, [medir]);

  return { ref, transborda };
}

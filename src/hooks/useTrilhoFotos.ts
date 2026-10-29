import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

/**
 * O trilho de fotos: um só mecanismo para o dedo, o mouse e o teclado.
 *
 * As fotos ficam lado a lado num contêiner que rola com encaixe
 * (`scroll-snap`), em vez de empilhadas com uma visível por vez. Assim o
 * dedo desliza com a inércia do sistema e as setas do teclado rolam o
 * contêiner focado sem controle na tela — o trilho é `tabindex="0"`, e é
 * isso que mantém as outras fotos alcançáveis.
 *
 * Quem manda no índice é sempre a posição do trilho, lida no `scroll`.
 * Assim o dedo, as setas e a roda horizontal do mouse atualizam o
 * indicador sem um ramo de código para cada um. O mouse é o único caso
 * especial, porque não desliza.
 *
 * @param total Quantas fotos o trilho tem.
 * @param chave Identidade da lista. Quando muda, a galeria é outra e o
 *   trilho volta para a capa.
 */
export function useTrilhoFotos(total: number, chave: string) {
  const trilhoRef = useRef<HTMLDivElement>(null);
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    setIndice(0);
    const el = trilhoRef.current;
    // Direto, sem animação: é troca de conteúdo, não navegação dentro da
    // mesma galeria.
    if (el) el.scrollLeft = 0;
  }, [chave]);

  const aoRolar = useCallback(() => {
    const el = trilhoRef.current;
    // clientWidth zero acontece enquanto o elemento está escondido, e a
    // divisão daria NaN. Com total zero o `total - 1` abaixo daria -1.
    if (!el || el.clientWidth === 0 || total < 1) return;

    const i = Math.round(el.scrollLeft / el.clientWidth);
    setIndice(Math.min(total - 1, Math.max(0, i)));
  }, [total]);

  const aoMover = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      // Só mouse: no toque quem rola é o dedo, e mexer no scrollLeft no
      // meio do gesto arranca o trilho da mão de quem está deslizando.
      if (e.pointerType !== "mouse") return;

      const el = trilhoRef.current;
      if (!el) return;

      const r = el.getBoundingClientRect();
      if (r.width === 0) return;

      const bruto = Math.floor(((e.clientX - r.left) / r.width) * total);
      const i = Math.min(total - 1, Math.max(0, bruto));

      // Só quando o índice muda. Escrever o mesmo valor a cada pixel de
      // movimento briga com a animação de encaixe, e a foto fica tremendo.
      if (i !== indice) el.scrollLeft = i * el.clientWidth;
    },
    [total, indice],
  );

  const aoSair = useCallback((e: PointerEvent<HTMLDivElement>) => {
    // Volta para a capa, que é a foto que representa a peça.
    if (e.pointerType === "mouse" && trilhoRef.current) {
      trilhoRef.current.scrollLeft = 0;
    }
  }, []);

  return { trilhoRef, indice, aoRolar, aoMover, aoSair };
}

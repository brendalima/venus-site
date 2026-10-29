import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Pagina RENDERIZAÇÃO, não carregamento — todos os produtos já estão em
 * memória. Serve para o DOM não crescer sem necessidade se o catálogo
 * aumentar.
 */
export function useInfiniteScroll(total: number, pageSize = 8) {
  const [visible, setVisible] = useState(() => Math.min(pageSize, total));
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = visible < total;

  const showMore = useCallback(() => {
    setVisible((v) => Math.min(v + pageSize, total));
  }, [pageSize, total]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) showMore();
      },
      // Antecipa antes de chegar na borda, para não haver espera visível.
      { rootMargin: "400px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, showMore]);

  // Se a lista encolher, não deixa `visible` acima do total.
  useEffect(() => {
    setVisible((v) => Math.min(v, total) || Math.min(pageSize, total));
  }, [total, pageSize]);

  return { visible, hasMore, showMore, sentinelRef };
}

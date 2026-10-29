import { Logo } from "./Logo";
import "./Hero.css";

/**
 * Abertura da home.
 *
 * É <section> e não <header>: o cabeçalho do site já é o banner da
 * página, e dois <header> no nível da raiz dariam dois banners para quem
 * navega por marcos. O botão de tema também mudou para lá — antes havia
 * um por rota, agora há um só, no cabeçalho de todas.
 */
export function Hero({ count }: { count: number }) {
  return (
    <section
      className="hero faixa-escura brand-rule brand-rule--bottom"
      aria-label="Vênus Oasis"
    >
      <div className="page hero__inner">
        <Logo size="lg" />

        <p className="hero__tagline">
          Moda praia autoral, produzida em pequenos lotes no Brasil.
        </p>

        <p className="hero__meta">
          <span>{count} peças</span>
          <span aria-hidden="true">·</span>
          <span>Coleção atual</span>
        </p>
      </div>
    </section>
  );
}

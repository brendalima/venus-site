import { Logo } from "./Logo";
import "./Hero.css";

export function Hero({ count }: { count: number }) {
  return (
    <header className="hero brand-rule brand-rule--bottom">
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
    </header>
  );
}

import { Logo } from "./Logo";
import { BotaoTema } from "./BotaoTema";
import "./Hero.css";

export function Hero({ count }: { count: number }) {
  return (
    <header className="hero faixa-escura brand-rule brand-rule--bottom">
      <div className="page hero__inner">
        {/* Fora do fluxo, então não entra no gap da coluna centralizada. */}
        <div className="hero__tema">
          <BotaoTema />
        </div>

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

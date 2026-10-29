import { useState } from "react";
import { aplicaTema, temaAtual, type Tema } from "../lib/tema";
import "./BotaoTema.css";

function IconeSol() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7" />
    </svg>
  );
}

function IconeLua() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M20.5 14.3A8.8 8.8 0 0 1 9.7 3.5a8.8 8.8 0 1 0 10.8 10.8z" />
    </svg>
  );
}

/**
 * O ícone mostra o DESTINO, não o estado: no escuro aparece o sol, que é
 * para onde o clique leva.
 *
 * A verdade continua sendo o atributo no <html>, que o script do
 * index.html define antes da primeira pintura.
 */
export function BotaoTema() {
  const [tema, setTema] = useState<Tema>(temaAtual);
  const destino: Tema = tema === "escuro" ? "claro" : "escuro";

  function alterna() {
    aplicaTema(destino);
    setTema(destino);
  }

  return (
    <button
      type="button"
      className="botao-tema"
      onClick={alterna}
      aria-label={`Mudar para o tema ${destino}`}
    >
      {destino === "claro" ? <IconeSol /> : <IconeLua />}
    </button>
  );
}

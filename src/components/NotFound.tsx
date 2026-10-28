import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="page" style={{ paddingBlock: "6rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        Peça não encontrada
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
        Essa peça saiu do catálogo ou o endereço está errado.
      </p>
      <Link to="/" style={{ color: "var(--accent)" }}>
        Ver a coleção
      </Link>
    </div>
  );
}

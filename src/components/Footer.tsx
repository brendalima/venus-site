import { Logo } from "./Logo";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer brand-rule brand-rule--top">
      <div className="page footer__inner">
        <Logo size="sm" />

        <p className="footer__note">
          Catálogo para consulta. Os preços são informativos e podem mudar sem
          aviso.
        </p>

        <p className="footer__legal">
          © {new Date().getFullYear()} Vênus Oasis
        </p>
      </div>
    </footer>
  );
}

import { Route, Routes } from "react-router-dom";
import { Cabecalho } from "./components/Cabecalho";
import { Hero } from "./components/Hero";
import { ProductGrid } from "./components/ProductGrid";
import { ComoComprar, Duvidas, Faixa, Lookbook } from "./components/Secoes";
import { ProductPage } from "./components/ProductPage";
import { NotFound } from "./components/NotFound";
import { Footer } from "./components/Footer";
import { BotaoWhatsApp } from "./components/BotaoWhatsApp";
import { useAncora } from "./hooks/useAncora";
import { products } from "./data/products";

function Home() {
  return (
    <main>
      <Hero />
      <Faixa />
      <ProductGrid products={products} />
      <Lookbook />
      <ComoComprar />
      <Duvidas />
    </main>
  );
}

export default function App() {
  useAncora();

  return (
    <>
      {/* Fora do <Routes> para não remontar a cada navegação: é o que faz
          o estado do botão de tema sobreviver à troca de página. */}
      <Cabecalho />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/produto/:slug"
          element={
            <main>
              <ProductPage />
            </main>
          }
        />
        <Route
          path="*"
          element={
            <main>
              <NotFound />
            </main>
          }
        />
      </Routes>

      <Footer />

      <BotaoWhatsApp />
    </>
  );
}

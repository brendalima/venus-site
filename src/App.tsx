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
      {/* A ordem é a do protótipo: abertura, faixa de atributos,
          catálogo, e então as três seções de texto que o menu alcança. */}
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
  // O menu aponta para seções da home, inclusive quando o clique parte da
  // página de uma peça. Numa navegação do router o navegador não rola até
  // a âncora sozinho — ver useAncora.
  useAncora();

  return (
    <>
      {/* Fora do <Routes>: o cabeçalho é o mesmo em todas as rotas e fica
          grudado no alto. Montado uma vez, ele não remonta a cada
          navegação, e o estado do botão de tema sobrevive à troca de
          página. */}
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

      {/* Fora das rotas: acompanha a página inteira, em qualquer peça. */}
      <BotaoWhatsApp />
    </>
  );
}

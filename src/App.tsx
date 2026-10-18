import { Route, Routes } from "react-router-dom";
import { Hero } from "./components/Hero";
import { ProductGrid } from "./components/ProductGrid";
import { ProductPage } from "./components/ProductPage";
import { NotFound } from "./components/NotFound";
import { Footer } from "./components/Footer";
import { products } from "./data/products";

function Home() {
  return (
    <>
      <Hero count={products.length} />
      <main>
        <ProductGrid products={products} />
      </main>
    </>
  );
}

export default function App() {
  return (
    <>
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
    </>
  );
}

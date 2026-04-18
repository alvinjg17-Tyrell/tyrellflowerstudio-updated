import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminPage from "./pages/AdminPage";
import ProductPage from "./pages/ProductPage";
import AboutPage from "./pages/AboutPage";
import CatalogsPage from "./pages/CatalogsPage";
import ContactPage from "./pages/ContactPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/products/:slug" element={<ProductPage />} />

          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/catalogos" element={<CatalogsPage />} />
          <Route path="/contacto" element={<ContactPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer'; // <-- Импортируем футер
import Home from './pages/Home';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';

function App() {
  return (
    <Router>
      {/* Добавили flex flex-col для прижатия футера */}
      <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#d4af37] selection:text-black">
        <Header />
        
        {/* flex-grow заставляет main занимать все свободное место */}
        <main className="flex-grow"> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />
          </Routes>
        </main>

        <Footer /> {/* <-- Футер теперь рендерится всегда! */}
      </div>
    </Router>
  );
}

export default App;
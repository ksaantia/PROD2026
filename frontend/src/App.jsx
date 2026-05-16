import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import CatalogPage from './pages/CatalogPage'; // <-- Добавили импорт

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#d4af37] selection:text-black">
        <Header />
        
        <main> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<CatalogPage />} /> {/* <-- Добавили роут */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
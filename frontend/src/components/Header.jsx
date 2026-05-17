import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '../api';

const highlightText = (text, highlight) => {
  if (!highlight.trim()) return text;
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return parts.map((part, i) => 
    part.toLowerCase() === highlight.toLowerCase() ? 
      <span key={i} className="text-[#d4af37]">{part}</span> : part
  );
};

export default function Header() {
  const [productsData, setProductsData] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { cartCount } = useCart();
  const navigate = useNavigate();
  
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  // Запрашиваем товары для работы живого поиска
  useEffect(() => {
    getProducts().then(data => setProductsData(data));
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Блокируем скролл страницы только для окна поиска
  useEffect(() => {
    if (isSearchOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [isSearchOpen]);

  // Закрытие при клике вне панелей
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) setIsSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    } else {
      navigate('/catalog');
    }
    setIsSearchOpen(false);
  };

  const closeOverlays = () => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return productsData.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [searchQuery, productsData]);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 py-6 ${isScrolled || isSearchOpen || isMenuOpen ? 'bg-[#0a0a0a]' : 'bg-transparent'}`}>
        <div className="w-full px-4 md:px-12 relative">
          <div className="flex justify-between items-center relative z-50">
            
            <div className="flex items-center gap-4 md:gap-6" ref={menuRef}>
              <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); setIsSearchOpen(false); }}
                  className="flex items-center gap-2 text-white hover:text-[#d4af37] transition group cursor-pointer"
                >
                  {isMenuOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M6 18L18 6M6 6l12 12" /></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                  )}
                  <span className="hidden md:block text-xs uppercase tracking-widest font-medium">Menu</span>
                </button>

                {/* Выпадающее меню */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-8 w-[calc(100vw-2rem)] md:w-64 bg-[#141414] border border-white/10 shadow-2xl flex flex-col overflow-hidden rounded-sm"
                    >
                      <nav className="flex flex-col">
                        <Link to="/" onClick={closeOverlays} className="p-5 border-b border-white/5 text-white hover:text-[#d4af37] hover:bg-white/5 transition text-xs uppercase tracking-widest font-medium">Главная</Link>
                        <Link to="/catalog" onClick={closeOverlays} className="p-5 border-b border-white/5 text-white hover:text-[#d4af37] hover:bg-white/5 transition text-xs uppercase tracking-widest font-medium">Каталог подарков</Link>
                        <Link to="/cart" onClick={closeOverlays} className="p-5 border-b border-white/5 text-white hover:text-[#d4af37] hover:bg-white/5 transition text-xs uppercase tracking-widest font-medium">Корзина</Link>
                      </nav>
                      <div className="p-5 flex gap-6 text-[10px] uppercase tracking-widest text-gray-500 bg-black/40">
                        <a href="#" className="hover:text-[#d4af37] transition">Instagram</a>
                        <a href="#" className="hover:text-[#d4af37] transition">Telegram</a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div ref={searchRef}>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsSearchOpen(!isSearchOpen); setIsMenuOpen(false); }}
                  className="flex items-center gap-2 text-white hover:text-[#d4af37] transition cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <span className="hidden md:block text-xs uppercase tracking-widest font-medium">Search</span>
                </button>
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link to="/" onClick={closeOverlays} className="text-2xl md:text-4xl font-serif tracking-[0.15em] text-white font-bold whitespace-nowrap cursor-pointer">
                WELLNESS<span className="text-[#d4af37] md:text-4xl leading-none">.</span>
              </Link>
            </div>

            <div className="flex items-center gap-6">
              <Link to="/cart" onClick={closeOverlays} className="relative text-white hover:text-[#d4af37] transition flex items-center cursor-pointer">
                <svg className="w-5 h-5 md:w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {cartCount > 0 && (
                  <motion.span 
                    key={cartCount}
                    initial={{ scale: 0, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="absolute -top-1.5 -right-2 bg-white text-black text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
            </div>
          </div>

          {/* Адаптивный Поиск */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute top-full left-4 right-4 md:left-12 md:right-12 mt-6 bg-[#141414] border border-white/10 shadow-2xl p-6 md:px-12 z-40 rounded-sm"
              >
                <div className="max-w-2xl mx-auto relative">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input 
                      type="text" 
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Найти подарок..." 
                      className="w-full bg-transparent border-b border-white/20 text-white text-xl md:text-2xl py-3 pr-16 focus:outline-none focus:border-[#d4af37] transition placeholder-gray-600"
                    />
                    <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d4af37] uppercase text-xs tracking-widest cursor-pointer transition">
                      Искать
                    </button>
                  </form>

                  {searchQuery.trim() && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 mt-4 bg-[#1a1a1a] border border-white/10 shadow-2xl overflow-hidden z-50 max-h-[40vh] overflow-y-auto rounded-sm"
                    >
                      {searchSuggestions.length > 0 ? (
                        <ul>
                          {searchSuggestions.map((product) => (
                            <li key={product.id} className="border-b border-white/5 last:border-none">
                              <Link 
                                to={`/product/${product.id}`} 
                                onClick={closeOverlays}
                                className="flex items-center gap-4 p-4 hover:bg-white/5 transition group cursor-pointer"
                              >
                                <img src={product.image} alt={product.title} className="w-12 h-12 md:w-16 md:h-16 object-cover opacity-80 group-hover:opacity-100 transition flex-shrink-0" />
                                <div>
                                  <p className="text-[#d4af37] text-[9px] uppercase tracking-widest mb-1">{product.category}</p>
                                  <h4 className="text-white font-serif text-sm md:text-lg group-hover:text-[#d4af37] transition leading-tight">
                                    {highlightText(product.title, searchQuery)}
                                  </h4>
                                  <p className="text-gray-500 text-[10px] md:text-xs mt-1">{product.price.toLocaleString('ru-RU')} ₽</p>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-gray-400 font-serif text-lg mb-2">Ничего не найдено</p>
                          <p className="text-gray-600 text-xs md:text-sm">Подарков, содержащих «{searchQuery}», нет.</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}
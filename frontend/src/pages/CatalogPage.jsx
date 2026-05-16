import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom'; // <-- Добавили хук
import ProductCard from '../components/ProductCard';
import productsData from '../data/product.json';

// Создаем наш кастомный, элегантный Select с плавной анимацией
const CustomSelect = ({ value, onChange, options, placeholder }) => {
  // ... код CustomSelect (остается без изменений)
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div className={`relative w-full ${isOpen ? 'z-50' : 'z-30'}`} ref={ref}>
      <button
        type="button"
        className="w-full bg-[#0a0a0a] border border-white/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37] transition flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate pr-2 text-gray-300">{selected ? selected.label : placeholder}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-[10px] text-[#d4af37]">▼</motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full mt-2 bg-[#0a0a0a] border border-white/20 shadow-2xl"
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`px-4 py-3 text-sm cursor-pointer transition-colors ${value === opt.value ? 'text-[#d4af37] bg-white/10' : 'text-gray-300 hover:text-[#d4af37] hover:bg-white/5'}`}
              >
                {opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams(); // <-- Читаем параметры URL
  
  // Инициализируем поиск из URL (если мы пришли из шапки)
  const initialSearch = searchParams.get('search') || '';
  
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [premium, setPremium] = useState('all');

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showFilters, setShowFilters] = useState(false);

  // Синхронизируем состояние поиска, если URL изменился (например, при повторном поиске из шапки)
  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) {
      setSearch(q);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Обновляем URL при вводе в локальный инпут поиска каталога
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (val) {
      searchParams.set('search', val);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams, { replace: true });
  };

  const categoriesOptions = [
    { value: 'all', label: 'Все категории' },
    ...[...new Set(productsData.map(p => p.category))].map(c => ({
      value: c,
      label: c.charAt(0).toUpperCase() + c.slice(1)
    }))
  ];

  const priceOptions = [
    { value: 'all', label: 'Любая цена' },
    { value: 'under10k', label: 'До 10 000 ₽' },
    { value: '10k-50k', label: '10 000 - 50 000 ₽' },
    { value: 'over50k', label: '50 000 ₽ +' }
  ];

  const premiumOptions = [
    { value: 'all', label: 'Любой уровень' },
    { value: 'Basic', label: 'Basic' },
    { value: 'Premium', label: 'Premium' },
    { value: 'VIP', label: 'VIP' }
  ];

  const filteredProducts = useMemo(() => {
    return productsData.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase()) || 
                            product.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || product.category === category;
      const matchesPremium = premium === 'all' || product.premiumLevel === premium;
      
      let matchesPrice = true;
      if (priceRange === 'under10k') matchesPrice = product.price <= 10000;
      if (priceRange === '10k-50k') matchesPrice = product.price > 10000 && product.price <= 50000;
      if (priceRange === 'over50k') matchesPrice = product.price > 50000;

      return matchesSearch && matchesCategory && matchesPremium && matchesPrice;
    });
  }, [search, category, priceRange, premium]);

  const resetFilters = () => {
    setSearch('');
    searchParams.delete('search');
    setSearchParams(searchParams, { replace: true });
    setCategory('all');
    setPriceRange('all');
    setPremium('all');
    if (isMobile) setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">Коллекция подарков</h1>
          <p className="text-gray-500 font-medium text-sm max-w-xl mx-auto md:mx-0">
            Используйте фильтры, чтобы найти идеальный вариант для себя или близких.
          </p>
        </div>

        {isMobile && (
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="w-full mb-8 border border-white/20 px-4 py-3 flex justify-between items-center text-xs uppercase tracking-widest text-white cursor-pointer hover:border-[#d4af37] transition"
          >
            <span>Фильтры и поиск</span>
            <motion.span animate={{ rotate: showFilters ? 45 : 0 }} className="text-lg leading-none text-[#d4af37]">+</motion.span>
          </button>
        )}

        <AnimatePresence>
          {(!isMobile || showFilters) && (
            <motion.div 
              initial={isMobile ? { opacity: 0, y: -20 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={isMobile ? { opacity: 0, y: -20 } : undefined}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
            >
              <div className="relative w-full z-30">
                {/* Используем handleSearchChange вместо setSearch */}
                <input 
                  type="text"
                  placeholder="Поиск по названию..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full bg-transparent border border-white/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37] transition placeholder-gray-500"
                />
              </div>
              
              <CustomSelect value={category} onChange={setCategory} options={categoriesOptions} placeholder="Все категории" />
              <CustomSelect value={priceRange} onChange={setPriceRange} options={priceOptions} placeholder="Любая цена" />
              <CustomSelect value={premium} onChange={setPremium} options={premiumOptions} placeholder="Любой уровень" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ... (остальная часть с выводом товаров не меняется) */}
        {filteredProducts.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center py-20 border border-white/5 bg-white/[0.02]"
          >
            <h3 className="font-serif text-3xl text-white mb-4">Ничего не найдено</h3>
            <p className="text-gray-400 text-sm mb-8">По вашему запросу нет подходящих подарков. Попробуйте изменить параметры.</p>
            <button 
              onClick={resetFilters}
              className="border border-[#d4af37] text-[#d4af37] px-8 py-3 text-xs uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition duration-300 cursor-pointer"
            >
              Сбросить фильтры
            </button>

            <div className="mt-24 text-left px-4 md:px-12">
              <h4 className="font-serif text-2xl text-white mb-8 border-b border-white/10 pb-4">Популярные предложения</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {productsData.slice(0, 3).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
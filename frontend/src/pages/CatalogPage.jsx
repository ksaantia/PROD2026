import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { getProducts } from '../api';

// Универсальный выпадающий список (поддерживает передачу иконки)
const CustomSelect = ({ value, onChange, options, placeholder, icon }) => {
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
        className="w-full bg-[#0a0a0a] border border-white/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37] transition flex justify-between items-center cursor-pointer hover:border-[#d4af37]/60"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center truncate">
          {icon && <span className="mr-3 flex-shrink-0 text-[#d4af37]">{icon}</span>}
          <span className="truncate pr-2 text-gray-300">{selected ? selected.label : placeholder}</span>
        </div>
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

// Иконка сортировки
const SortIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 6h18M6 12h12m-9 6h6" />
  </svg>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function CatalogPage() {
  // Состояния для работы с API
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  // Параметры из URL
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'default';
  const category = searchParams.get('category') || 'all';
  const priceRange = searchParams.get('priceRange') || 'all';
  const premium = searchParams.get('premium') || 'all';

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showFilters, setShowFilters] = useState(false);

  // Обращение к Go бэкенду
  useEffect(() => {
    const fetchFromGo = async () => {
      setIsLoading(true);
      const data = await getProducts();
      setProductsData(data);
      setIsLoading(false);
    };
    fetchFromGo();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateFilter = (key, value) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (!value || value === 'all' || value === 'default') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
      return newParams;
    }, { replace: true });
  };

  const sortOptions = [
    { value: 'default', label: 'По умолчанию' },
    { value: 'price_asc', label: 'Сначала дешевле' },
    { value: 'price_desc', label: 'Сначала дороже' }
  ];

  // Категории теперь формируются динамически на основе полученных с бекенда данных
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
    let result = productsData.filter(product => {
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

    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);

    return result;
  }, [productsData, search, category, priceRange, premium, sort]);

  const resetFilters = () => {
    setSearchParams({}, { replace: true });
    if (isMobile) setShowFilters(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
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
            <span>Настройки каталога</span>
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12"
            >
              <div className="relative w-full z-30">
                <input 
                  type="text"
                  placeholder="Поиск..."
                  value={search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="w-full bg-transparent border border-white/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37] transition placeholder-gray-500"
                />
              </div>
              
              <CustomSelect value={sort} onChange={(val) => updateFilter('sort', val)} options={sortOptions} placeholder="Сортировка" icon={SortIcon} />
              <CustomSelect value={category} onChange={(val) => updateFilter('category', val)} options={categoriesOptions} placeholder="Категория" />
              <CustomSelect value={priceRange} onChange={(val) => updateFilter('priceRange', val)} options={priceOptions} placeholder="Цена" />
              <CustomSelect value={premium} onChange={(val) => updateFilter('premium', val)} options={premiumOptions} placeholder="Уровень" />
            </motion.div>
          )}
        </AnimatePresence>

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
          </motion.div>
        )}
      </div>
    </div>
  );
}
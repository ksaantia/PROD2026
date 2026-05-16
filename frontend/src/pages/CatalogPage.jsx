import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import productsData from '../data/product.json';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function CatalogPage() {
  // Состояния фильтров
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [premium, setPremium] = useState('all');

  // Уникальные категории из JSON
  const categories = ['all', ...new Set(productsData.map(p => p.category))];

  // Логика фильтрации
  const filteredProducts = useMemo(() => {
    return productsData.filter(product => {
      // 1. Поиск по названию и описанию
      const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase()) || 
                            product.description.toLowerCase().includes(search.toLowerCase());
      
      // 2. Категория
      const matchesCategory = category === 'all' || product.category === category;
      
      // 3. Уровень премиальности
      const matchesPremium = premium === 'all' || product.premiumLevel === premium;
      
      // 4. Цена
      let matchesPrice = true;
      if (priceRange === 'under10k') matchesPrice = product.price <= 10000;
      if (priceRange === '10k-50k') matchesPrice = product.price > 10000 && product.price <= 50000;
      if (priceRange === 'over50k') matchesPrice = product.price > 50000;

      return matchesSearch && matchesCategory && matchesPremium && matchesPrice;
    });
  }, [search, category, priceRange, premium]);

  const resetFilters = () => {
    setSearch('');
    setCategory('all');
    setPriceRange('all');
    setPremium('all');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Заголовок */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">Коллекция подарков</h1>
          <p className="text-gray-500 font-light text-sm max-w-xl">
            Подберите идеальный wellness-подарок. Используйте фильтры, чтобы найти подходящий вариант для себя или близких.
          </p>
        </div>

        {/* Панель фильтров */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <input 
            type="text"
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border border-white/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37] transition"
          />
          
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="bg-[#0a0a0a] border border-white/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37] transition appearance-none cursor-pointer"
          >
            <option value="all">Все категории</option>
            {categories.filter(c => c !== 'all').map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>

          <select 
            value={priceRange} 
            onChange={(e) => setPriceRange(e.target.value)}
            className="bg-[#0a0a0a] border border-white/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37] transition appearance-none cursor-pointer"
          >
            <option value="all">Любая цена</option>
            <option value="under10k">До 10 000 ₽</option>
            <option value="10k-50k">10 000 - 50 000 ₽</option>
            <option value="over50k">50 000 ₽ +</option>
          </select>

          <select 
            value={premium} 
            onChange={(e) => setPremium(e.target.value)}
            className="bg-[#0a0a0a] border border-white/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37] transition appearance-none cursor-pointer"
          >
            <option value="all">Любой уровень</option>
            <option value="Basic">Basic</option>
            <option value="Premium">Premium</option>
            <option value="VIP">VIP</option>
          </select>
        </div>

        {/* Сетка товаров или Пустое состояние */}
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
              className="border border-[#d4af37] text-[#d4af37] px-8 py-3 text-xs uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition duration-300"
            >
              Сбросить фильтры
            </button>

            {/* Рекомендации, если ничего не найдено (по ТЗ) */}
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
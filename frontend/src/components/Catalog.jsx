import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { getProducts } from '../api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function Catalog() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(data => setProducts(data));
  }, []);

  const categories = [
    { title: "Эксклюзивные SPA", slug: "spa", gradient: "from-[#0a0a0a] via-[#0f1714] to-[#121c17]" },
    { title: "Ретриты и Восстановление", slug: "ретриты", gradient: "from-[#121c17] via-[#1a1814] to-[#211a14]" },
    { title: "Премиальные Массажи", slug: "массажи", gradient: "from-[#211a14] via-[#14100c] to-[#0a0a0a]" }
  ];

  if (products.length === 0) return null; // Если бэкенд не ответил - не ломаем главную страницу

  return (
    <div id="catalog">
      {categories.map((cat, idx) => {
        // Берем по 3 товара из каждой категории для Главной
        const categoryProducts = products.filter(p => p.category === cat.slug).slice(0, 3);
        
        if (categoryProducts.length === 0) return null;

        return (
          <section key={idx} className={`py-32 px-4 bg-gradient-to-b ${cat.gradient}`}>
            <div className="max-w-7xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="flex flex-col items-center mb-20"
              >
                <h2 className="font-serif text-4xl md:text-5xl text-white mb-6 tracking-tight">{cat.title}</h2>
                <div className="w-12 h-[1px] bg-[#d4af37]/50 mb-6"></div>
              </motion.div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-12"
              >
                {categoryProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </motion.div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import productsData from '../data/product.json';
import ProductCard from './ProductCard'; // <-- Импортируем нашу общую карточку!

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Catalog() {
  const categories = [
    { title: "Эксклюзивные SPA", slug: "spa", gradient: "from-[#0a0a0a] via-[#0f1714] to-[#121c17]" },
    { title: "Ретриты и Восстановление", slug: "ретриты", gradient: "from-[#121c17] via-[#1a1814] to-[#211a14]" },
    { title: "Премиальные Массажи", slug: "массажи", gradient: "from-[#211a14] via-[#14100c] to-[#0a0a0a]" }
  ];

  return (
    <div id="catalog">
      {categories.map((cat, idx) => (
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
              {productsData.filter(p => p.category === cat.slug).slice(0, 3).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </motion.div>
          </div>
        </section>
      ))}
    </div>
  );
}
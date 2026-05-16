import React from 'react';
import { motion } from 'framer-motion';
import products from '../data/product.json';

// Анимация для контейнера (задает задержку между элементами)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

// Анимация для каждой карточки
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const ProductCard = ({ product }) => (
  <motion.div 
    variants={itemVariants}
    className="group flex flex-col bg-transparent border border-white/5 hover:border-[#d4af37]/40 transition-colors duration-700 cursor-pointer"
  >
    <div className="relative h-96 overflow-hidden">
      <img 
        src={product.image} 
        alt={product.title} 
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out opacity-70 group-hover:opacity-100" 
      />
      <div className="absolute top-6 left-6 z-20">
        <span className="text-[9px] uppercase tracking-[0.2em] text-black bg-white/90 backdrop-blur-sm px-4 py-1.5 font-bold">
          {product.premiumLevel}
        </span>
      </div>
    </div>
    <div className="p-8 flex flex-col flex-grow">
      <h3 className="font-serif text-2xl text-white mb-3 group-hover:text-[#d4af37] transition-colors duration-500">{product.title}</h3>
      <p className="text-gray-500 font-light text-sm mb-8 leading-relaxed flex-grow italic">{product.description}</p>
      <p className="font-serif text-xl text-[#d4af37] tracking-wider">{product.price.toLocaleString('ru-RU')} ₽</p>
    </div>
  </motion.div>
);

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
              {products.filter(p => p.category === cat.slug).slice(0, 3).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </motion.div>
          </div>
        </section>
      ))}
    </div>
  );
}
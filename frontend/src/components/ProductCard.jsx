import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function ProductCard({ product }) {
  return (
    <motion.div 
      variants={itemVariants}
      className="group flex flex-col bg-transparent border border-white/5 hover:border-[#d4af37]/40 transition-colors duration-700 cursor-pointer h-full"
    >
      <div className="relative h-80 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out opacity-70 group-hover:opacity-100" 
        />
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-[0.2em] text-black bg-white/90 backdrop-blur-sm px-3 py-1 font-bold w-max">
            {product.premiumLevel}
          </span>
          {/* Добавили вывод рейтинга */}
          <span className="text-[10px] font-bold text-black bg-[#d4af37]/90 px-3 py-1 w-max flex items-center gap-1">
            ★ {product.rating}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-[#d4af37] text-[10px] uppercase tracking-widest mb-2">{product.category}</p>
        
        {/* Ссылка на будущую страницу товара */}
        <Link to={`/product/${product.id}`} className="mb-3 block">
          <h3 className="font-serif text-2xl text-white group-hover:text-[#d4af37] transition-colors duration-500">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-gray-500 font-light text-sm mb-8 leading-relaxed flex-grow italic line-clamp-3">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-auto">
          <p className="font-serif text-xl text-white tracking-wider">
            {product.price.toLocaleString('ru-RU')} ₽
          </p>
          <button className="text-[10px] uppercase tracking-widest border border-white/20 px-4 py-2 hover:border-[#d4af37] hover:text-[#d4af37] transition-all">
            В корзину
          </button>
        </div>
      </div>
    </motion.div>
  );
}
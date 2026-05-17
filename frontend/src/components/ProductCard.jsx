import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function ProductCard({ product }) {
  const { addToCart, decreaseQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);
  
  // Получаем текущий путь, чтобы запомнить фильтры каталога
  const location = useLocation();
  // Если мы в каталоге — берем его URL-параметры. Если на странице товара — берем переданный стейт.
  const filterState = location.pathname === '/catalog' ? location.search : (location.state?.from || '');

  const handleAction = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  return (
    <motion.div 
      variants={itemVariants}
      className="group flex flex-col bg-transparent border border-white/5 hover:border-[#d4af37]/40 transition-colors duration-700 h-full"
    >
      {/* Прокидываем фильтры через state */}
      <Link to={`/product/${product.id}`} state={{ from: filterState }} className="relative h-80 overflow-hidden block">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out opacity-70 group-hover:opacity-100" 
        />
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-[0.2em] text-black bg-white/90 backdrop-blur-sm px-3 py-1 font-bold w-max">
            {product.premiumLevel}
          </span>
          <span className="text-[10px] font-bold text-black bg-[#d4af37]/90 px-3 py-1 w-max flex items-center gap-1">
            ★ {product.rating}
          </span>
        </div>
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-[#d4af37] text-[10px] uppercase tracking-widest mb-2">{product.category}</p>
        
        {/* Прокидываем фильтры через state */}
        <Link to={`/product/${product.id}`} state={{ from: filterState }} className="mb-3 block">
          <h3 className="font-serif text-2xl text-white group-hover:text-[#d4af37] transition-colors duration-500">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-gray-300 font-medium text-sm mb-8 leading-relaxed flex-grow line-clamp-3">
          {product.description}
        </p>
        
        {/* Блок цены и кнопок: теперь элементы друг под другом, чтобы кнопки занимали всю ширину */}
        <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-white/10">
          <p className="font-serif text-xl text-white tracking-wider">
            {product.price.toLocaleString('ru-RU')} ₽
          </p>
          
          <div className="w-full h-[36px] relative">
            <AnimatePresence mode="wait">
              {quantity === 0 ? (
                <motion.button 
                  key="addBtn"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                  onClick={(e) => handleAction(e, () => addToCart(product))}
                  className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest border border-white/20 hover:border-[#d4af37] hover:text-[#d4af37] transition-all cursor-pointer"
                >
                  В корзину
                </motion.button>
              ) : (
                <motion.div 
                  key="controlsGroup"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                  className="w-full h-full flex items-center gap-2"
                >
                  {/* Счетчик */}
                  <div className="flex items-center justify-between border border-[#d4af37] h-full w-[40%]">
                    <button onClick={(e) => handleAction(e, () => decreaseQuantity(product.id))} className="w-1/3 h-full flex items-center justify-center text-white hover:bg-[#d4af37] hover:text-black transition cursor-pointer">-</button>
                    <span className="w-1/3 flex items-center justify-center text-[11px] text-white font-bold">{quantity}</span>
                    <button onClick={(e) => handleAction(e, () => addToCart(product))} className="w-1/3 h-full flex items-center justify-center text-white hover:bg-[#d4af37] hover:text-black transition cursor-pointer">+</button>
                  </div>
                  {/* Кнопка "Перейти в корзину" */}
                  <Link 
                    to="/cart"
                    onClick={(e) => e.stopPropagation()}
                    className="w-[60%] h-full flex items-center justify-center bg-[#d4af37] text-black text-[9px] font-bold uppercase tracking-widest hover:bg-white transition-colors cursor-pointer"
                  >
                    В корзину ➔
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
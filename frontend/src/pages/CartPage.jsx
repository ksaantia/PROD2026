import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, addToCart, decreaseQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-12 text-center md:text-left">Ваша корзина</h1>

        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center py-20 border border-white/5 bg-white/[0.02]"
          >
            <h3 className="font-serif text-3xl text-white mb-4">Корзина пуста</h3>
            <p className="text-gray-400 text-sm mb-8">Вы еще не выбрали ни одного подарка.</p>
            <Link 
              to="/catalog"
              className="border border-[#d4af37] text-[#d4af37] px-8 py-3 text-xs uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition duration-300"
            >
              Перейти в каталог
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            
            <div className="flex-grow flex flex-col gap-6">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div 
                    key={item.id} 
                    layout 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50, scale: 0.95 }} 
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex gap-6 border border-white/10 p-4 bg-white/[0.01]"
                  >
                    <img src={item.image} alt={item.title} className="w-24 h-32 md:w-32 md:h-40 object-cover opacity-80" />
                    
                    <div className="flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex justify-between items-start">
                          <p className="text-[#d4af37] text-[10px] uppercase tracking-widest mb-1">{item.category}</p>
                          {/* Кнопка полного удаления позиции */}
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-600 hover:text-red-500 text-[10px] uppercase tracking-widest transition"
                          >
                            ✕ Удалить
                          </button>
                        </div>
                        <h3 className="font-serif text-xl md:text-2xl text-white mb-4">{item.title}</h3>
                        
                        {/* Регулятор количества */}
                        <div className="flex items-center gap-3">
                          <p className="text-gray-500 text-xs">Количество:</p>
                          <div className="flex items-center border border-white/20">
                            <button onClick={() => decreaseQuantity(item.id)} className="px-3 py-1 text-white hover:text-[#d4af37] transition">-</button>
                            <span className="text-xs text-white min-w-[24px] text-center font-bold">{item.quantity}</span>
                            <button onClick={() => addToCart(item)} className="px-3 py-1 text-white hover:text-[#d4af37] transition">+</button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        {/* Цена за все единицы этого товара */}
                        <p className="font-serif text-xl text-white">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="w-full lg:w-1/3">
              <div className="border border-white/10 p-8 sticky top-32">
                <h3 className="font-serif text-2xl text-white mb-6 border-b border-white/10 pb-4">Ваш заказ</h3>
                
                <div className="flex justify-between items-center mb-4 text-sm text-gray-400">
                  <span>Товары ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
                  <span>{cartTotal.toLocaleString('ru-RU')} ₽</span>
                </div>
                
                <div className="flex justify-between items-center mb-8 text-white font-serif text-2xl pt-4 border-t border-white/10">
                  <span>Итого</span>
                  <span className="text-[#d4af37]">{cartTotal.toLocaleString('ru-RU')} ₽</span>
                </div>

                <Link 
                  to="/checkout"
                  className="w-full block text-center bg-[#d4af37] text-black font-bold uppercase tracking-widest text-xs py-4 hover:bg-white transition-colors duration-500"
                >
                  Оформить заказ
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
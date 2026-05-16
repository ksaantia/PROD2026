import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SuccessPage() {
  const location = useLocation();
  const state = location.state;

  // Если пользователь зашел по прямой ссылке /success без оформления
  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { name, cartItems, cartTotal } = state;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl w-full border border-[#d4af37]/30 p-10 md:p-16 bg-white/[0.01]"
      >
        <span className="text-[#d4af37] text-5xl mb-6 block">✓</span>
        
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-6">Спасибо за заказ, {name}!</h1>
        <p className="text-gray-400 font-light mb-12">
          Ваш заказ успешно оформлен. В ближайшее время мы свяжемся с вами для подтверждения деталей.
        </p>

        <div className="text-left border-t border-white/10 pt-8 mb-12">
          <h3 className="text-white text-xs uppercase tracking-widest mb-6">Резюме заказа</h3>
          <ul className="flex flex-col gap-4 mb-6">
            {cartItems.map((item, idx) => (
              <li key={idx} className="flex justify-between text-sm">
                <span className="text-gray-300">{item.quantity}x {item.title}</span>
                <span className="text-white">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center text-white font-serif text-2xl pt-4 border-t border-white/10">
            <span>Оплачено</span>
            <span className="text-[#d4af37]">{cartTotal.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>

        <Link 
          to="/catalog"
          className="inline-block border border-[#d4af37] text-[#d4af37] px-8 py-4 text-xs uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition duration-300"
        >
          Вернуться в каталог
        </Link>
      </motion.div>
    </div>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center text-center">
      
      {/* Фоновое изображение с эффектом медленного зума */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="absolute inset-0 bg-fixed bg-cover bg-center z-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1489908990827-08a75c580832?q=80&w=1170&auto=format&fit=crop')" }}
      />

      {/* Оверлей: градиент стал чуть плотнее сверху, чтобы скрыть светлое небо под текстом */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent z-10"></div>

      {/* Контент с анимацией появления */}
      <div className="relative z-20 flex flex-col items-center px-4">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#d4af37] font-medium mb-5"
        >
          The Premium Collection
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-9xl text-white mb-12 tracking-tight"
        >
          Искусство <br className="md:hidden" /> Отдыха
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.5 }}
        >
          <Link 
            to="/catalog" 
            className="text-white text-xs md:text-sm uppercase tracking-widest font-semibold pb-2 border-b-[1px] border-white/50 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-500"
          >
            Смотреть каталог
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
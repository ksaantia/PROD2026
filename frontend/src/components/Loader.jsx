import React from 'react';
import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center"
    >
      <div className="relative flex items-center justify-center">
        {/* Вращающееся золотое кольцо */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="absolute w-24 h-24 border-t-[2px] border-r-[2px] border-[#d4af37] border-b-[2px] border-b-transparent border-l-[2px] border-l-transparent rounded-full"
        />
        
        {/* Пульсирующий логотип внутри */}
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="font-serif text-2xl tracking-[0.2em] text-white font-bold ml-1"
        >
          W<span className="text-[#d4af37]">.</span>
        </motion.div>
      </div>
      
      <motion.p
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.5 }}
        className="text-[#d4af37] text-[9px] uppercase tracking-[0.4em] mt-8"
      >
      </motion.p>
    </motion.div>
  );
}
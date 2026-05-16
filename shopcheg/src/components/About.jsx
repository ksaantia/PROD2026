import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <section className="py-32 px-4 bg-[#0a0a0a] text-center overflow-hidden">
      <div className="max-w-3xl mx-auto">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-[#d4af37] text-xs uppercase tracking-[0.3em] font-medium block mb-6"
        >
          О Сервисе
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-serif text-3xl md:text-5xl text-white mb-10 leading-snug"
        >
          Безупречность в каждой детали. <br className="hidden md:block"/> 
          Ваше время — наша главная ценность.
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-gray-400 font-light text-sm md:text-base leading-relaxed mb-12"
        >
          Wellness Gift Shop создавался для тех, кто не терпит компромиссов в вопросах качества отдыха. 
          Мы лично тестируем каждый spa-салон и ретрит-центр, прежде чем добавить их в нашу коллекцию. 
          Подарите себе и своим близким привилегию настоящего спокойствия и первоклассного сервиса.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <img 
            src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=800" 
            alt="Brand aesthetic" 
            className="w-full h-64 md:h-80 object-cover opacity-50 grayscale hover:grayscale-0 transition duration-700"
          />
        </motion.div>
      </div>
    </section>
  );
}
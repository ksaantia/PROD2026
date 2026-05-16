import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#050505] text-white py-16 px-4 border-t border-gray-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        
        <div>
          <h3 className="font-serif text-2xl tracking-[0.1em] mb-6">WELLNESS<span className="text-[#d4af37]">.</span></h3>
          <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto md:mx-0">
            Эксклюзивная коллекция премиальных подарков для восстановления и осознанности.
          </p>
        </div>

        <div className="flex flex-col gap-4 text-xs uppercase tracking-widest text-gray-400">
          <a href="#" className="hover:text-white transition">Каталог</a>
          <a href="#" className="hover:text-white transition">О сервисе</a>
          <a href="#" className="hover:text-white transition">Контакты</a>
        </div>

        <div className="flex flex-col gap-4 text-xs uppercase tracking-widest text-gray-400 md:items-end">
          <a href="#" className="hover:text-white transition">Instagram</a>
          <a href="#" className="hover:text-white transition">Telegram</a>
          <a href="#" className="hover:text-white transition">Client Service</a>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-900 text-center text-[10px] text-gray-600 uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Wellness Gift Shop. All rights reserved.
      </div>
    </footer>
  );
}
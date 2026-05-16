import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#050505] text-white py-16 px-4 border-t border-gray-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        
        <div>
          <Link to="/" className="font-serif text-2xl tracking-[0.1em] mb-6 block hover:text-[#d4af37] transition">
            WELLNESS<span className="text-[#d4af37]">.</span>
          </Link>
          <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto md:mx-0">
            Эксклюзивная коллекция премиальных подарков для восстановления и осознанности.
          </p>
        </div>

        <div className="flex flex-col gap-4 text-xs uppercase tracking-widest text-gray-400">
          <Link to="/catalog" className="hover:text-white transition cursor-pointer">Каталог</Link>
          {/* Ссылка на главную страницу с якорем на блок 'О сервисе' (нужно чтобы в About.jsx был id="about") */}
          <Link to="/" className="hover:text-white transition cursor-pointer">О сервисе</Link>
          <a href="mailto:info@wellness-shop.com" className="hover:text-white transition cursor-pointer">Контакты</a>
        </div>

        <div className="flex flex-col gap-4 text-xs uppercase tracking-widest text-gray-400 md:items-end">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition cursor-pointer">Instagram</a>
          <a href="https://telegram.org" target="_blank" rel="noreferrer" className="hover:text-white transition cursor-pointer">Telegram</a>
          <a href="tel:+74950000000" className="hover:text-white transition cursor-pointer">Client Service</a>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-900 text-center text-[10px] text-gray-600 uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Wellness Gift Shop. All rights reserved.
      </div>
    </footer>
  );
}
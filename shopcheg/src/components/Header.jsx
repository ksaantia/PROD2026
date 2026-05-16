import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      // py-6 теперь стоит жестко, хедер не меняет толщину. Рамки и тени убраны.
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 py-6 ${
        isScrolled ? 'bg-[#0a0a0a]' : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 md:px-12">
        <div className="flex justify-between items-center relative">
          
          <div className="flex items-center gap-4 md:gap-6 z-10">
            <button className="flex items-center gap-2 text-white hover:text-[#d4af37] transition group">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="hidden md:block text-xs uppercase tracking-widest font-medium">Menu</span>
            </button>
            
            <button className="flex items-center gap-2 text-white hover:text-[#d4af37] transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden md:block text-xs uppercase tracking-widest font-medium">Search</span>
            </button>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <Link to="/" className="text-2xl md:text-4xl font-serif tracking-[0.15em] text-white font-bold whitespace-nowrap">
              WELLNESS<span className="text-[#d4af37] md:text-4xl leading-none">.</span>
            </Link>
          </div>

          <div className="flex items-center gap-6 z-10">
            <Link to="/cart" className="relative text-white hover:text-[#d4af37] transition flex items-center">
              <svg className="w-5 h-5 md:w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-1.5 -right-2 bg-white text-black text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
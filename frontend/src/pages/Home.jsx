import React from 'react';
import Hero from '../components/Hero';
import Catalog from '../components/Catalog';
import About from '../components/About';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Catalog />
      <About />
    </div>
  );
}
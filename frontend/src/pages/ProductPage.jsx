import React, { useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import productsData from '../data/product.json';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
  const { id } = useParams();
  const location = useLocation();
  const { addToCart, decreaseQuantity, getItemQuantity } = useCart();
  
  const product = productsData.find(p => p.id === parseInt(id));
  const quantity = product ? getItemQuantity(product.id) : 0;

  // Формируем ссылку назад: если есть сохраненные параметры фильтра, подставляем их
  const backLink = location.state?.from ? `/catalog${location.state.from}` : '/catalog';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
        <h2 className="text-3xl font-serif mb-4">Подарок не найден</h2>
        <Link to="/catalog" className="text-[#d4af37] border-b border-[#d4af37] pb-1 uppercase text-xs tracking-widest cursor-pointer">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  const recommendations = productsData
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Кнопка НАЗАД с сохранением фильтрации */}
        <Link to={backLink} className="inline-flex items-center text-gray-500 hover:text-white transition text-xs uppercase tracking-widest mb-12 cursor-pointer">
          ← Назад в каталог
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative h-[50vh] lg:h-[70vh]"
          >
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            <div className="absolute top-6 left-6 flex gap-3">
              <span className="bg-white/90 text-black text-xs uppercase tracking-widest px-4 py-2 font-bold">
                {product.premiumLevel}
              </span>
              <span className="bg-[#d4af37]/90 text-black text-xs font-bold px-4 py-2 flex items-center">
                ★ {product.rating}
              </span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <span className="text-[#d4af37] text-xs uppercase tracking-[0.3em] mb-4 block">
              {product.category}
            </span>
            <h1 className="font-serif text-4xl lg:text-6xl text-white mb-6 leading-tight">
              {product.title}
            </h1>
            
            <p className="text-gray-400 font-medium text-base leading-relaxed mb-10">
              {product.description}
            </p>

            <div className="flex items-end justify-between border-t border-white/10 pt-8 mb-10">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Стоимость</p>
                <p className="font-serif text-4xl text-white tracking-wider">
                  {product.price.toLocaleString('ru-RU')} ₽
                </p>
              </div>
            </div>

            {/* Блок кнопок: Плавное превращение */}
            <div className="w-full h-[60px] relative">
              <AnimatePresence mode="wait">
                {quantity === 0 ? (
                  <motion.button 
                    key="addBtn"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                    onClick={() => addToCart(product)}
                    className="w-full h-full flex items-center justify-center bg-[#d4af37] text-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors duration-500 cursor-pointer"
                  >
                    Добавить в корзину
                  </motion.button>
                ) : (
                  <motion.div 
                    key="controlsGroup"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                    className="flex items-center gap-4 w-full h-full"
                  >
                    {/* Счетчик */}
                    <div className="flex items-center justify-between border border-[#d4af37] w-[40%] h-full">
                      <button onClick={() => decreaseQuantity(product.id)} className="h-full w-1/3 flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-colors text-xl cursor-pointer">-</button>
                      <span className="w-1/3 text-center text-white text-xs uppercase tracking-widest font-bold">{quantity} шт</span>
                      <button onClick={() => addToCart(product)} className="h-full w-1/3 flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-colors text-xl cursor-pointer">+</button>
                    </div>
                    {/* Кнопка "Перейти в корзину" */}
                    <Link 
                      to="/cart"
                      className="w-[60%] h-full flex items-center justify-center bg-[#d4af37] text-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors duration-500 cursor-pointer"
                    >
                      В корзину ➔
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-32 border-t border-white/10 pt-16"
        >
          <div className="max-w-3xl">
            <h2 className="font-serif text-3xl text-white mb-8">Об услуге</h2>
            <p className="text-gray-300 font-medium text-base lg:text-lg leading-relaxed">
              {product.expandedDescription}
            </p>
          </div>
        </motion.div>

        {recommendations.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="font-serif text-3xl text-white mb-10 border-b border-white/10 pb-6">
              Рекомендуем также
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recommendations.map(item => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
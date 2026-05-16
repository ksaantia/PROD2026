import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    forWhom: '',
    comment: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Валидация по ТЗ
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Пожалуйста, укажите ваше имя';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Пожалуйста, укажите email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      
      // Имитация отправки и оплаты заказа
      setTimeout(() => {
        // Передаем данные на страницу "Спасибо", чтобы вывести резюме
        navigate('/success', { 
          state: { 
            name: formData.name, 
            cartItems: cartItems, 
            cartTotal: cartTotal 
          } 
        });
        clearCart(); // Очищаем корзину после оформления
      }, 1500);
    }
  };

  if (cartItems.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
        <h2 className="text-3xl font-serif mb-4">Ваша корзина пуста</h2>
        <Link to="/catalog" className="text-[#d4af37] border-b border-[#d4af37] pb-1 uppercase text-xs tracking-widest">
          Вернуться к покупкам
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-12">Оформление заказа</h1>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Форма */}
          <div className="flex-grow">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Ваше имя *</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full bg-transparent border ${errors.name ? 'border-red-500' : 'border-white/20'} text-white px-4 py-3 focus:outline-none focus:border-[#d4af37] transition`}
                  placeholder="Например, Александр"
                />
                {errors.name && <p className="text-red-500 text-xs mt-2">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Email *</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full bg-transparent border ${errors.email ? 'border-red-500' : 'border-white/20'} text-white px-4 py-3 focus:outline-none focus:border-[#d4af37] transition`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Для кого подарок?</label>
                <input 
                  type="text"
                  value={formData.forWhom}
                  onChange={(e) => setFormData({...formData, forWhom: e.target.value})}
                  className="w-full bg-transparent border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-[#d4af37] transition"
                  placeholder="Себе, маме, коллеге..."
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Комментарий к заказу</label>
                <textarea 
                  rows="4"
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  className="w-full bg-transparent border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-[#d4af37] transition resize-none"
                  placeholder="Особые пожелания..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="mt-6 bg-[#d4af37] text-black font-bold uppercase tracking-widest text-sm py-5 hover:bg-white transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Обработка...' : 'Подтвердить заказ'}
              </button>
            </form>
          </div>

          {/* Итог заказа сбоку */}
          <div className="w-full lg:w-1/3">
            <div className="border border-white/10 p-8 sticky top-32">
              <h3 className="font-serif text-2xl text-white mb-6 border-b border-white/10 pb-4">Ваш заказ</h3>
              
              <div className="flex flex-col gap-4 mb-8">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300 pr-4">{item.quantity}x {item.title}</span>
                    <span className="text-white whitespace-nowrap">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center text-white font-serif text-2xl pt-4 border-t border-white/10">
                <span>Итого</span>
                <span className="text-[#d4af37]">{cartTotal.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
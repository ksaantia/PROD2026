import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Инициализируем корзину из localStorage, если там что-то есть
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('wellness_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Ошибка при чтении корзины из localStorage:", error);
      return [];
    }
  });

  // Сохраняем корзину в localStorage при каждом ее изменении
  useEffect(() => {
    try {
      localStorage.setItem('wellness_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Ошибка при сохранении корзины в localStorage:", error);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing?.quantity === 1) {
        return prev.filter((item) => item.id !== id);
      }
      return prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemQuantity = (id) => {
    const item = cartItems.find((item) => item.id === id);
    return item ? item.quantity : 0;
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      decreaseQuantity, 
      removeFromCart, 
      clearCart,
      getItemQuantity,
      cartCount, 
      cartTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};
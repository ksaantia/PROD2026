// src/api/index.js
const API_URL = import.meta.env.VITE_API_URL || 'http://hack-umms-team-10-front-back-2e0e8a.vm.prodcontest.com:8080';

// Получение всех продуктов
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/api/products`);
    if (!response.ok) throw new Error('Ошибка при загрузке товаров');
    return await response.json();
  } catch (error) {
    console.error('API Error (getProducts):', error);
    return []; // Возвращаем пустой массив при ошибке
  }
};

// Отправка заказа
export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) throw new Error('Ошибка при создании заказа');
    return await response.json();
  } catch (error) {
    console.error('API Error (createOrder):', error);
    throw error;
  }
};
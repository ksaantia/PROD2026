const API_URL = import.meta.env.VITE_API_URL || 'http://hack-umms-team-10-front-back-2e0e8a.vm.prodcontest.com:8080';

// Умный кэш: чтобы Шапка, Каталог и Главная не делали 3 одинаковых запроса одновременно
let fetchPromise = null;

export const getProducts = async () => {
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch('http://hack-umms-team-10-front-back-2e0e8a.vm.prodcontest.com:8080/api/products')
    .then((res) => {
      if (!res.ok) throw new Error('Ошибка при загрузке товаров');
      return res.json();
    })
    .then((data) => {
      // Адаптируем данные из Go (snake_case) под React (camelCase)
      return data.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        expandedDescription: p.expanded_description,
        category: p.category,
        price: p.price,
        premiumLevel: p.premium_level,
        rating: p.rating,
        image: p.image_url || p.image_key || 'https://via.placeholder.com/800x600?text=No+Image'
      }));
    })
    .catch((error) => {
      console.error('API Error (getProducts):', error);
      fetchPromise = null; // Сбрасываем кэш при ошибке
      return [];
    });

  return fetchPromise;
};

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
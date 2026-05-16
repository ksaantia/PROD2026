import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx' // <-- Добавили импорт

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider> {/* <-- Обернули App */}
      <App />
    </CartProvider>
  </StrictMode>,
)
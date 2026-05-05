import { useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes, Navigate } from 'react-router-dom'
import Products from './components/Products.jsx'
import Cart from './components/Cart.jsx'
import Payments from './components/Payments.jsx'

export default function App() {
  const [cart, setCart] = useState([])

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <BrowserRouter>
      <div className="app">
        <header className="topbar">
          <h1>Sklep eBiz</h1>
          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              Produkty
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => (isActive ? 'active' : '')}>
              Koszyk ({cart.length})
            </NavLink>
            <NavLink to="/payments" className={({ isActive }) => (isActive ? 'active' : '')}>
              Płatności
            </NavLink>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Products onAdd={addToCart} />} />
          <Route
            path="/cart"
            element={
              <Cart items={cart} total={cartTotal} onRemove={removeFromCart} />
            }
          />
          <Route
            path="/payments"
            element={
              <Payments total={cartTotal} onPaid={clearCart} />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

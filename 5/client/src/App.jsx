import { BrowserRouter, NavLink, Route, Routes, Navigate } from 'react-router-dom'
import Products from './components/Products.jsx'
import Cart from './components/Cart.jsx'
import Payments from './components/Payments.jsx'
import { CartProvider, useCart } from './context/CartContext.jsx'

function Topbar() {
  const { items } = useCart()
  return (
    <header className="topbar">
      <h1>Sklep eBiz</h1>
      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Produkty
        </NavLink>
        <NavLink to="/cart" className={({ isActive }) => (isActive ? 'active' : '')}>
          Koszyk ({items.length})
        </NavLink>
        <NavLink to="/payments" className={({ isActive }) => (isActive ? 'active' : '')}>
          Płatności
        </NavLink>
      </nav>
    </header>
  )
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="app">
          <Topbar />
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  )
}

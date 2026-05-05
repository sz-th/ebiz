import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function Cart() {
  const { items, total, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <section className="section">
        <h2>Koszyk</h2>
        <p>Koszyk jest pusty.</p>
        <Link to="/">Wróć do produktów</Link>
      </section>
    )
  }

  return (
    <section className="section">
      <h2>Koszyk</h2>
      <ul className="product-list">
        {items.map((item) => (
          <li key={item.id}>
            <span>
              {item.name} × {item.qty}
            </span>
            <span className="price">
              {(item.price * item.qty).toFixed(2)} zł
            </span>
            <button type="button" onClick={() => removeItem(item.id)}>
              Usuń
            </button>
          </li>
        ))}
      </ul>
      <p className="total">Suma: {total.toFixed(2)} zł</p>
      <Link to="/payments">
        <button type="button">Przejdź do płatności</button>
      </Link>
    </section>
  )
}

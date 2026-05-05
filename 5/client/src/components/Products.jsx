import { useEffect, useState } from 'react'
import api from '../api.js'
import { useCart } from '../context/CartContext.jsx'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addItem } = useCart()

  useEffect(() => {
    let active = true
    api
      .get('/products')
      .then((res) => {
        if (active) {
          setProducts(res.data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setError('Błąd pobierania produktów')
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="section">
      <h2>Produkty</h2>
      {loading && <p>Ładowanie...</p>}
      {error && <p className="status err">{error}</p>}
      {!loading && !error && (
        <ul className="product-list">
          {products.map((p) => (
            <li key={p.id}>
              <span>{p.name}</span>
              <span className="price">{p.price.toFixed(2)} zł</span>
              <button type="button" onClick={() => addItem(p)}>
                Dodaj do koszyka
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

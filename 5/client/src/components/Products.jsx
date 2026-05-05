import { useEffect, useState } from 'react'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Błąd pobierania produktów')
        return res.json()
      })
      .then((data) => {
        if (active) {
          setProducts(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message)
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
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

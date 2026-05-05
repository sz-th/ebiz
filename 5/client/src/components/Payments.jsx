import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function Payments() {
  const { total, clear } = useCart()
  const [method, setMethod] = useState('card')
  const [amount, setAmount] = useState('')
  const [holder, setHolder] = useState('')
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (total > 0) {
      setAmount(total.toFixed(2))
    }
  }, [total])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus(null)
    setSending(true)
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          amount: parseFloat(amount),
          holder,
        }),
      })
      if (!res.ok) throw new Error('Płatność odrzucona')
      const data = await res.json()
      setStatus({ ok: true, msg: `Płatność ${data.id} przyjęta na kwotę ${data.amount.toFixed(2)} zł` })
      setHolder('')
      clear()
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      setStatus({ ok: false, msg: err.message })
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="section">
      <h2>Płatności</h2>
      <form className="payment-form" onSubmit={handleSubmit}>
        <label>
          Metoda
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="card">Karta</option>
            <option value="blik">BLIK</option>
            <option value="transfer">Przelew</option>
          </select>
        </label>
        <label>
          Imię i nazwisko
          <input
            type="text"
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
            required
          />
        </label>
        <label>
          Kwota (zł)
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={sending}>
          {sending ? 'Wysyłanie...' : 'Zapłać'}
        </button>
        {status && (
          <p className={`status ${status.ok ? 'ok' : 'err'}`}>{status.msg}</p>
        )}
      </form>
    </section>
  )
}

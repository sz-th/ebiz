import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'
import { useCart } from '../context/CartContext.jsx'

function paymentErrorMessage(err) {
  const data = err.response?.data
  if (data && typeof data === 'object' && typeof data.error === 'string') {
    return data.error
  }
  return 'Płatność odrzucona'
}

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
    const parsed = Number.parseFloat(amount)
    if (Number.isNaN(parsed) || parsed <= 0) {
      setStatus({ ok: false, msg: 'Nieprawidłowa kwota' })
      return
    }
    setSending(true)
    try {
      const res = await api.post('/payments', {
        method,
        amount: parsed,
        holder: holder.trim(),
      })
      const data = res.data
      const paid = typeof data.amount === 'number' ? data.amount : parsed
      const id = typeof data.id === 'string' ? data.id : ''
      setStatus({
        ok: true,
        msg: `Płatność ${id} przyjęta na kwotę ${paid.toFixed(2)} zł`,
      })
      setHolder('')
      clear()
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      setStatus({ ok: false, msg: paymentErrorMessage(err) })
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="section">
      <h2>Płatności</h2>
      <form className="payment-form" onSubmit={handleSubmit}>
        <label>
          <span>Metoda</span>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="card">Karta</option>
            <option value="blik">BLIK</option>
            <option value="transfer">Przelew</option>
          </select>
        </label>
        <label>
          <span>Imię i nazwisko</span>
          <input
            type="text"
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
            required
          />
        </label>
        <label>
          <span>Kwota (zł)</span>
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

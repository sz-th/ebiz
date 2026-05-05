import { describe, it, expect } from 'vitest'
import { api, rawApi } from './client.js'

describe('POST /payments - pozytywne', () => {
  it('przyjmuje płatność kartą', async () => {
    const res = await api.post('/payments', {
      method: 'card',
      amount: 199.99,
      holder: 'Jan Kowalski',
    })
    expect(res.status).toBe(201)
    expect(res.data).toHaveProperty('id')
    expect(res.data).toHaveProperty('status')
    expect(res.data).toHaveProperty('amount')
    expect(res.data).toHaveProperty('method')
    expect(res.data).toHaveProperty('timestamp')
    expect(res.data.status).toBe('OK')
    expect(res.data.amount).toBe(199.99)
    expect(res.data.method).toBe('card')
    expect(res.data.id).toMatch(/^PMT-\d{14}$/)
  })

  it('przyjmuje płatność BLIK', async () => {
    const res = await api.post('/payments', {
      method: 'blik',
      amount: 50,
      holder: 'Anna',
    })
    expect(res.status).toBe(201)
    expect(res.data.method).toBe('blik')
    expect(res.data.amount).toBe(50)
    expect(res.data.status).toBe('OK')
  })

  it('przyjmuje płatność przelewem', async () => {
    const res = await api.post('/payments', {
      method: 'transfer',
      amount: 1500.5,
      holder: 'Marek',
    })
    expect(res.status).toBe(201)
    expect(res.data.method).toBe('transfer')
    expect(res.data.amount).toBe(1500.5)
  })

  it('content-type odpowiedzi to JSON', async () => {
    const res = await api.post('/payments', {
      method: 'card',
      amount: 12.34,
      holder: 'X',
    })
    expect(res.headers['content-type']).toContain('application/json')
  })

  it('timestamp odpowiedzi jest poprawnym ISO datetime', async () => {
    const res = await api.post('/payments', {
      method: 'card',
      amount: 10,
      holder: 'X',
    })
    expect(res.status).toBe(201)
    const ts = new Date(res.data.timestamp)
    expect(Number.isNaN(ts.getTime())).toBe(false)
    expect(Math.abs(ts.getTime() - Date.now())).toBeLessThan(60_000)
  })
})

describe('POST /payments - negatywne', () => {
  it('odrzuca płatność z kwotą = 0', async () => {
    const res = await api.post('/payments', {
      method: 'card',
      amount: 0,
      holder: 'X',
    })
    expect(res.status).toBe(400)
    expect(res.data).toHaveProperty('error')
    expect(res.data.error).toBe('Kwota musi być większa od zera')
  })

  it('odrzuca płatność z kwotą ujemną', async () => {
    const res = await api.post('/payments', {
      method: 'card',
      amount: -100,
      holder: 'X',
    })
    expect(res.status).toBe(400)
    expect(res.data.error).toContain('Kwota')
  })

  it('odrzuca płatność z bardzo małą ujemną kwotą', async () => {
    const res = await api.post('/payments', {
      method: 'blik',
      amount: -0.01,
      holder: 'X',
    })
    expect(res.status).toBe(400)
  })

  it('odrzuca zniekształcony JSON', async () => {
    const res = await rawApi.post('/payments', 'to nie jest json', {
      headers: { 'Content-Type': 'application/json' },
    })
    expect(res.status).toBe(400)
    expect(res.data).toHaveProperty('error')
  })

  it('odrzuca zły typ pola amount', async () => {
    const res = await rawApi.post(
      '/payments',
      JSON.stringify({ method: 'card', amount: 'duzo', holder: 'X' }),
      { headers: { 'Content-Type': 'application/json' } }
    )
    expect(res.status).toBe(400)
  })

  it('GET na /payments zwraca błąd', async () => {
    const res = await api.get('/payments')
    expect([404, 405]).toContain(res.status)
  })

  it('puste body daje błąd walidacji', async () => {
    const res = await api.post('/payments', {})
    expect(res.status).toBe(400)
    expect(res.data.error).toBe('Kwota musi być większa od zera')
  })
})

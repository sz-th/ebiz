import { describe, it, expect } from 'vitest'
import { api } from './client.js'

describe('GET /products - pozytywne', () => {
  it('zwraca 200 i listę produktów', async () => {
    const res = await api.get('/products')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.data)).toBe(true)
    expect(res.data).toHaveLength(5)
  })

  it('content-type to application/json', async () => {
    const res = await api.get('/products')
    expect(res.headers['content-type']).toContain('application/json')
  })

  it('każdy produkt ma poprawny kontrakt', async () => {
    const res = await api.get('/products')
    for (const p of res.data) {
      expect(p).toHaveProperty('id')
      expect(p).toHaveProperty('name')
      expect(p).toHaveProperty('price')
      expect(typeof p.id).toBe('number')
      expect(typeof p.name).toBe('string')
      expect(typeof p.price).toBe('number')
      expect(p.price).toBeGreaterThan(0)
      expect(p.name.length).toBeGreaterThan(0)
    }
  })

  it('zawiera oczekiwane produkty', async () => {
    const res = await api.get('/products')
    const names = res.data.map((p) => p.name)
    expect(names).toContain('Klawiatura mechaniczna')
    expect(names).toContain('Mysz bezprzewodowa')
    expect(names).toContain('Monitor 27 cali')
    expect(names).toContain('Słuchawki nauszne')
    expect(names).toContain('Podkładka pod mysz')
  })

  it('IDs są unikalne i posortowane', async () => {
    const res = await api.get('/products')
    const ids = res.data.map((p) => p.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
    expect(ids[0]).toBe(1)
    expect(ids[ids.length - 1]).toBe(5)
  })
})

describe('GET /products - negatywne', () => {
  it('niewłaściwa metoda HTTP zwraca błąd', async () => {
    const res = await api.delete('/products')
    expect([404, 405]).toContain(res.status)
  })

  it('PUT na /products zwraca błąd', async () => {
    const res = await api.put('/products', {})
    expect([404, 405]).toContain(res.status)
  })

  it('nieistniejący zasób zwraca 404', async () => {
    const res = await api.get('/produkty')
    expect(res.status).toBe(404)
  })

  it('GET na /products/123 zwraca 404 (endpoint nie istnieje)', async () => {
    const res = await api.get('/products/123')
    expect(res.status).toBe(404)
  })
})

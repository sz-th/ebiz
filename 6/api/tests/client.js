import axios from 'axios'

const baseURL = process.env.API_URL || 'http://localhost:8080'

export const api = axios.create({
  baseURL,
  validateStatus: () => true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const rawApi = axios.create({
  baseURL,
  validateStatus: () => true,
  transformRequest: [(data) => data],
})

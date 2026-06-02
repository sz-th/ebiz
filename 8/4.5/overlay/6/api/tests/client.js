import axios from 'axios'

const baseURL = process.env.API_URL || 'http://localhost:8080'

const shared = {
  baseURL,
  validateStatus: () => true,
  headers: {
    'Content-Type': 'application/json',
  },
}

export const api = axios.create(shared)

export const rawApi = axios.create({
  ...shared,
  transformRequest: [(data) => data],
})

import axios from 'axios'

// In production (Vercel), use relative path since FE & BE are deployed together
// In development, use localhost
const API_URL = import.meta.env.MODE === 'production' 
  ? '/api' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api

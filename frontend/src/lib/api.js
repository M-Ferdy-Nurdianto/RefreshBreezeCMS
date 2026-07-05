import axios from 'axios'
import { showToast } from './toast'

// In production (Vercel), use the API URL from environment variable
// In development, use localhost
let API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL

if (!API_URL) {
  API_URL = import.meta.env.MODE === 'production' 
    ? '/api' 
    : `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:5000/api`
} else if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && API_URL.includes('localhost')) {
  // If accessing from a mobile device (non-localhost) but the API is configured with localhost,
  // dynamically substitute localhost with the computer's local IP address so requests reach the backend.
  API_URL = API_URL.replace('localhost', window.location.hostname)
}

const api = axios.create({
  baseURL: API_URL,
})

// Debug: Log API URL in production to help troubleshooting
if (import.meta.env.MODE === 'production') {
  // console.log('🌐 API Base URL:', API_URL)
}

// Add auth token to requests and handle Content-Type
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Only set Content-Type to JSON if data is not FormData
    // Let axios set the correct boundary for multipart/form-data
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  (error) => Promise.reject(error)
)

const rateLimitToastId = 'rate-limit-toast'

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 429) {
      const message = error?.response?.data?.error || 'Terlalu banyak permintaan. Silakan tunggu sebentar lalu coba lagi.'
      showToast.error(message, 'Rate Limit')
    }

    return Promise.reject(error)
  }
)

// Global in-memory cache for GET requests
const apiCache = new Map()
const originalGet = api.get

api.get = async (url, config) => {
  // Skip cache if admin is logged in or if explicitly disabled
  const token = localStorage.getItem('admin_token')
  if (token || config?.skipCache) {
    return originalGet.call(api, url, config)
  }

  const cacheKey = url + (config?.params ? JSON.stringify(config.params) : '')

  if (apiCache.has(cacheKey)) {
    return Promise.resolve(apiCache.get(cacheKey))
  }

  const requestPromise = originalGet.call(api, url, config)
    .then(response => {
      // Store the actual response to serve instantly later
      apiCache.set(cacheKey, response)
      return response
    })
    .catch(err => {
      apiCache.delete(cacheKey)
      throw err
    })

  // Store the promise immediately to deduplicate concurrent requests
  apiCache.set(cacheKey, requestPromise)
  return requestPromise
}

export default api


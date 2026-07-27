import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor: extract error detail or default message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

// Chat API
export const chatAPI = {
  sendMessage: async (message) => {
    const response = await api.post('/api/chat', { message })
    return response.data
  },
}

// Vision API
export const visionAPI = {
  analyzeImage: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/api/vision/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
}

// Navigation API
export const navAPI = {
  getRoute: async (data) => {
    const response = await api.post('/api/nav/route', data)
    return response.data
  },
  getNearby: async (lat, lng, type = 'hospital') => {
    const response = await api.get('/api/nav/nearby', {
      params: { lat, lng, type, radius: 2000 },
    })
    return response.data
  },
}

// Audit API
export const auditAPI = {
  analyzeImage: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/api/audit/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
}

export default api

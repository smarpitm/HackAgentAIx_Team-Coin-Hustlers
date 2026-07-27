import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// Chat API
export const sendChat = async (message, file = null) => {
  try {
    const response = await api.post('/api/chat', { message })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to send message')
  }
}

// Vision API
export const analyzeVision = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/api/vision/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to analyze image')
  }
}

// Navigation API
export const getRoute = async (originLat, originLng, destination, mode = 'walking') => {
  try {
    const response = await api.post('/api/nav/route', {
      origin_lat: originLat,
      origin_lng: originLng,
      destination,
      mode,
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to get route')
  }
}

export const getNearby = async (lat, lng, placeType = 'hospital', radius = 1000) => {
  try {
    const response = await api.post('/api/nav/nearby', {
      lat,
      lng,
      place_type: placeType,
      radius,
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to get nearby places')
  }
}

// Audit API
export const analyzeAudit = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/api/audit/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to analyze accessibility')
  }
}

export default api

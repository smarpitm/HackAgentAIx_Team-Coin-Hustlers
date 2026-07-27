import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Helper to convert file to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export const sendChat = async (message, file = null) => {
  let imageBase64 = null
  if (file) {
    imageBase64 = await fileToBase64(file)
  }
  const response = await api.post('/api/chat', {
    message,
    image_base64: imageBase64,
  })
  return response.data
}

export const analyzeVision = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post('/api/vision/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const analyzeAudit = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post('/api/audit/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const getRoute = async (origin, destination, mode = 'transit') => {
  const response = await api.post('/api/nav/route', {
    origin,
    destination,
    mode,
    wheelchair_accessible: true,
  })
  return response.data
}

export const getNearby = async (latitude, longitude, facilityType = 'accessible_restroom') => {
  const response = await api.post('/api/nav/nearby', {
    latitude,
    longitude,
    facility_type: facilityType,
  })
  return response.data
}

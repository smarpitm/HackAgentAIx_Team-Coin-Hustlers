import { useState, useEffect } from 'react'

export const useGeolocation = () => {
  const [location, setLocation] = useState({
    latitude: 28.6139,
    longitude: 77.2090, // Delhi fallback
    loaded: false,
    error: null,
  })

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocation((prev) => ({
        ...prev,
        loaded: true,
        error: { code: 0, message: 'Geolocation not supported' },
      }))
      return
    }

    const onSuccess = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        loaded: true,
        error: null,
      })
    }

    const onError = (error) => {
      console.warn('Geolocation error, using Delhi fallback:', error.message)
      setLocation((prev) => ({
        ...prev,
        loaded: true,
        error,
      }))
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    })
  }, [])

  return location
}

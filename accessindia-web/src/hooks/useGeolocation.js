import { useState, useEffect } from 'react'

/**
 * useGeolocation Hook
 * 
 * Gets user's current location using Geolocation API.
 * Falls back to Delhi coordinates if unavailable or denied.
 * 
 * @returns {Object} Location state
 * @returns {Object|null} location - {lat, lng} or null if loading
 * @returns {Boolean} loading - Whether location is being fetched
 * @returns {String|null} error - Error message if permission denied
 */
const useGeolocation = () => {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Default fallback: Delhi, India
  const DEFAULT_LOCATION = {
    lat: 28.6139,
    lng: 77.2090
  }

  useEffect(() => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported, using default location')
      setLocation(DEFAULT_LOCATION)
      setError('Geolocation not supported by browser')
      setLoading(false)
      return
    }

    // Success handler
    const onSuccess = (position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
      setLoading(false)
      setError(null)
    }

    // Error handler
    const onError = (err) => {
      console.warn('Geolocation error, using default location:', err.message)
      
      let errorMessage = 'Location access denied'
      
      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = 'Location permission denied. Using default location.'
          break
        case err.POSITION_UNAVAILABLE:
          errorMessage = 'Location unavailable. Using default location.'
          break
        case err.TIMEOUT:
          errorMessage = 'Location request timed out. Using default location.'
          break
        default:
          errorMessage = 'Unknown error. Using default location.'
      }

      setError(errorMessage)
      setLocation(DEFAULT_LOCATION)
      setLoading(false)
    }

    // Options
    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 300000 // Cache for 5 minutes
    }

    // Request current position
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options)
  }, [])

  return {
    location,
    loading,
    error
  }
}

export { useGeolocation }
export default useGeolocation


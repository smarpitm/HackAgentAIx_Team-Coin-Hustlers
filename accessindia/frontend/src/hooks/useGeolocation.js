import { useState, useEffect } from 'react'

export const useGeolocation = () => {
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported in this browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude)
        setLng(position.coords.longitude)
      },
      (err) => {
        setError(err.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    )
  }, [])

  return { lat, lng, error }
}

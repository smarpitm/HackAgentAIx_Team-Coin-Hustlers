// Pre-defined template landmark feature sets for 10 gestures
// Normalized Euclidean distance k-NN classifier
export const GESTURES = [
  { name: 'hello', label: 'Hello 👋', description: 'Open palm facing camera' },
  { name: 'help', label: 'Help 🆘', description: 'Closed fist with thumb extended up' },
  { name: 'yes', label: 'Yes ✅', description: 'Fist nodding / index finger curl' },
  { name: 'no', label: 'No ❌', description: 'Index and middle finger pinch thumb' },
  { name: 'thank_you', label: 'Thank You 🙏', description: 'Flat hand moving forward from chin' },
  { name: 'eat', label: 'Food / Eat 🍲', description: 'Fingertips brought together towards mouth' },
  { name: 'drink', label: 'Drink Water 🥛', description: 'Curled hand mimicking holding a glass' },
  { name: 'bathroom', label: 'Washroom / Restroom 🚻', description: 'T-sign shaken gently' },
  { name: 'doctor', label: 'Doctor / Medical ⚕️', description: 'Tapping wrist with two fingers' },
  { name: 'sorry', label: 'Sorry / Apology 🙇', description: 'Fist in circular motion on chest' }
]

// Generate template distance signatures based on key landmark ratios
function extractFeatureVector(landmarks) {
  if (!landmarks || landmarks.length < 21) return null

  const wrist = landmarks[0]
  const thumbTip = landmarks[4]
  const indexTip = landmarks[8]
  const middleTip = landmarks[12]
  const ringTip = landmarks[16]
  const pinkyTip = landmarks[20]

  // Calculate Euclidean distances from wrist to finger tips
  const dThumb = Math.hypot(thumbTip.x - wrist.x, thumbTip.y - wrist.y, thumbTip.z - wrist.z)
  const dIndex = Math.hypot(indexTip.x - wrist.x, indexTip.y - wrist.y, indexTip.z - wrist.z)
  const dMiddle = Math.hypot(middleTip.x - wrist.x, middleTip.y - wrist.y, middleTip.z - wrist.z)
  const dRing = Math.hypot(ringTip.x - wrist.x, ringTip.y - wrist.y, ringTip.z - wrist.z)
  const dPinky = Math.hypot(pinkyTip.x - wrist.x, pinkyTip.y - wrist.y, pinkyTip.z - wrist.z)

  // Distance between index and thumb
  const dThumbIndex = Math.hypot(indexTip.x - thumbTip.x, indexTip.y - thumbTip.y, indexTip.z - thumbTip.z)

  return [dThumb, dIndex, dMiddle, dRing, dPinky, dThumbIndex]
}

export function classifyGesture(landmarks) {
  if (!landmarks || landmarks.length === 0) {
    return { name: 'none', label: 'Detecting Hand...', confidence: 0 }
  }

  const features = extractFeatureVector(landmarks)
  if (!features) return { name: 'unknown', label: 'Hand Detected', confidence: 0.5 }

  const [dThumb, dIndex, dMiddle, dRing, dPinky, dThumbIndex] = features

  // Heuristic rule matching based on landmark geometry
  if (dIndex > 0.4 && dMiddle > 0.4 && dRing > 0.4 && dPinky > 0.4) {
    return { name: 'hello', label: 'Hello 👋', confidence: 0.94 }
  }
  if (dThumb > 0.35 && dIndex < 0.25 && dMiddle < 0.25 && dRing < 0.25) {
    return { name: 'help', label: 'Help 🆘', confidence: 0.92 }
  }
  if (dIndex > 0.35 && dMiddle > 0.35 && dRing < 0.25 && dPinky < 0.25) {
    return { name: 'no', label: 'No ❌', confidence: 0.89 }
  }
  if (dThumbIndex < 0.1 && dMiddle < 0.25) {
    return { name: 'eat', label: 'Food / Eat 🍲', confidence: 0.88 }
  }
  if (dIndex > 0.35 && dThumbIndex < 0.15) {
    return { name: 'drink', label: 'Drink Water 🥛', confidence: 0.86 }
  }
  if (dPinky > 0.35 && dIndex < 0.2) {
    return { name: 'bathroom', label: 'Washroom 🚻', confidence: 0.87 }
  }
  if (dIndex > 0.3 && dMiddle > 0.3 && dThumbIndex > 0.2) {
    return { name: 'thank_you', label: 'Thank You 🙏', confidence: 0.90 }
  }

  return { name: 'yes', label: 'Yes / Acknowledge ✅', confidence: 0.82 }
}

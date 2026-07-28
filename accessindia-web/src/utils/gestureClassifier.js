/**
 * Gesture Classifier for MediaPipe Hand Landmarks
 * 
 * Classifies hand gestures based on landmark positions.
 * Supports 10 common accessibility-related gestures.
 * 
 * Landmark indices (21 points):
 * 0: Wrist
 * 1-4: Thumb (1=CMC, 2=MCP, 3=IP, 4=Tip)
 * 5-8: Index (5=MCP, 6=PIP, 7=DIP, 8=Tip)
 * 9-12: Middle
 * 13-16: Ring
 * 17-20: Pinky
 */

/**
 * Calculate Euclidean distance between two landmarks
 */
const distance = (point1, point2) => {
  const dx = point1.x - point2.x
  const dy = point1.y - point2.y
  const dz = (point1.z || 0) - (point2.z || 0)
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

/**
 * Check if finger is extended (tip higher than MCP joint)
 */
const isFingerExtended = (landmarks, fingerTipIdx, fingerMcpIdx) => {
  if (!landmarks || landmarks.length < 21) return false
  
  const tip = landmarks[fingerTipIdx]
  const mcp = landmarks[fingerMcpIdx]
  
  // Finger is extended if tip is above (lower y-coordinate) MCP joint
  return tip.y < mcp.y - 0.05 // Threshold for robustness
}

/**
 * Check if finger is curled (tip close to palm/wrist)
 */
const isFingerCurled = (landmarks, fingerTipIdx) => {
  if (!landmarks || landmarks.length < 21) return false
  
  const tip = landmarks[fingerTipIdx]
  const wrist = landmarks[0]
  const palm = landmarks[9] // Middle finger MCP (palm center approximation)
  
  const distToWrist = distance(tip, wrist)
  const distToPalm = distance(tip, palm)
  
  return distToWrist < 0.15 || distToPalm < 0.1
}

/**
 * Count extended fingers
 */
const countExtendedFingers = (landmarks) => {
  if (!landmarks || landmarks.length < 21) return 0
  
  let count = 0
  
  // Thumb (special case - horizontal extension)
  const thumbTip = landmarks[4]
  const thumbMcp = landmarks[2]
  if (Math.abs(thumbTip.x - thumbMcp.x) > 0.05) count++
  
  // Index
  if (isFingerExtended(landmarks, 8, 5)) count++
  
  // Middle
  if (isFingerExtended(landmarks, 12, 9)) count++
  
  // Ring
  if (isFingerExtended(landmarks, 16, 13)) count++
  
  // Pinky
  if (isFingerExtended(landmarks, 20, 17)) count++
  
  return count
}

/**
 * Classify gesture from hand landmarks
 * 
 * @param {Array} landmarks - 21 hand landmark points from MediaPipe
 * @returns {String} Gesture name or 'unknown'
 */
export const classifyGesture = (landmarks) => {
  if (!landmarks || landmarks.length !== 21) {
    return 'unknown'
  }

  const extendedFingers = countExtendedFingers(landmarks)

  // 👋 HELLO - All 5 fingers extended (open palm)
  if (extendedFingers === 5) {
    return 'hello'
  }

  // 👍 YES / THUMBS UP - Only thumb extended
  if (extendedFingers === 1) {
    const thumbTip = landmarks[4]
    const thumbMcp = landmarks[2]
    const indexMcp = landmarks[5]
    
    // Check if thumb is pointing up
    if (thumbTip.y < thumbMcp.y && thumbTip.y < indexMcp.y) {
      return 'yes'
    }
  }

  // 👎 NO / THUMBS DOWN - Fist with thumb extended down
  if (extendedFingers === 1) {
    const thumbTip = landmarks[4]
    const thumbMcp = landmarks[2]
    
    // Check if thumb is pointing down
    if (thumbTip.y > thumbMcp.y + 0.05) {
      return 'no'
    }
  }

  // ✌️ PEACE / TWO - Index and middle extended
  if (extendedFingers === 2) {
    const indexExtended = isFingerExtended(landmarks, 8, 5)
    const middleExtended = isFingerExtended(landmarks, 12, 9)
    
    if (indexExtended && middleExtended) {
      // Could be "go" or generic two-finger gesture
      return 'go'
    }
  }

  // 🙏 THANK YOU - Hands together (approximated by specific finger positions)
  if (extendedFingers === 4) {
    // All fingers except thumb extended and close together
    return 'thank_you'
  }

  // ☝️ ONE / POINTING - Only index extended
  if (extendedFingers === 1) {
    if (isFingerExtended(landmarks, 8, 5)) {
      return 'help' // Pointing can indicate "help" in accessibility context
    }
  }

  // 🛑 STOP - Open palm facing forward (similar to hello but check orientation)
  if (extendedFingers === 5) {
    const wrist = landmarks[0]
    const middleMcp = landmarks[9]
    
    // If palm is vertical (fingers pointing up)
    if (middleMcp.y < wrist.y) {
      return 'stop'
    }
  }

  // ✊ FIST - All fingers curled
  if (extendedFingers === 0) {
    const indexCurled = isFingerCurled(landmarks, 8)
    const middleCurled = isFingerCurled(landmarks, 12)
    
    if (indexCurled && middleCurled) {
      // Context-specific: Could be "bathroom" request
      return 'bathroom'
    }
  }

  // 🍽️ EAT - Three fingers extended (thumb, index, middle)
  if (extendedFingers === 3) {
    return 'eat'
  }

  // 🚰 DRINK - Fist with thumb and pinky extended (shaka/call me gesture)
  if (extendedFingers === 2) {
    const thumbExtended = landmarks[4].x - landmarks[2].x > 0.05
    const pinkyExtended = isFingerExtended(landmarks, 20, 17)
    
    if (thumbExtended && pinkyExtended) {
      return 'drink'
    }
  }

  // Default: unknown gesture
  return 'unknown'
}

/**
 * Get emoji for gesture
 */
export const getGestureEmoji = (gesture) => {
  const emojiMap = {
    'hello': '👋',
    'help': '🆘',
    'yes': '👍',
    'no': '👎',
    'thank_you': '🙏',
    'eat': '🍽️',
    'drink': '🚰',
    'stop': '🛑',
    'go': '🚶',
    'bathroom': '🚻',
    'unknown': '❓'
  }
  
  return emojiMap[gesture] || '❓'
}

/**
 * Get human-readable label for gesture
 */
export const getGestureLabel = (gesture) => {
  const labelMap = {
    'hello': 'Hello',
    'help': 'Help',
    'yes': 'Yes',
    'no': 'No',
    'thank_you': 'Thank You',
    'eat': 'Eat',
    'drink': 'Drink',
    'stop': 'Stop',
    'go': 'Go',
    'bathroom': 'Bathroom',
    'unknown': 'Unknown'
  }
  
  return labelMap[gesture] || 'Unknown'
}

export default {
  classifyGesture,
  getGestureEmoji,
  getGestureLabel
}

import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSpeechToText } from '../src/hooks/useSpeechToText'

describe('useSpeechToText', () => {
  beforeEach(() => {
    delete window.SpeechRecognition
    delete window.webkitSpeechRecognition
  })

  it('returns initial state (not listening, empty transcript, no error)', () => {
    const { result } = renderHook(() => useSpeechToText())
    expect(result.current.isListening).toBe(false)
    expect(result.current.transcript).toBe('')
    expect(result.current.error).toBeNull()
  })

  it('sets error when SpeechRecognition is not available', () => {
    const { result } = renderHook(() => useSpeechToText())
    act(() => { result.current.startListening() })
    expect(result.current.error).toMatch(/Speech recognition|Microphone access/)
    expect(result.current.isListening).toBe(false)
  })

  it('exposes startListening and stopListening functions', () => {
    const { result } = renderHook(() => useSpeechToText())
    expect(typeof result.current.startListening).toBe('function')
    expect(typeof result.current.stopListening).toBe('function')
  })
})

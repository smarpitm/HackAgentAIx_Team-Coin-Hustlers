import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTextToSpeech } from '../src/hooks/useTextToSpeech'

describe('useTextToSpeech', () => {
  it('returns speak and stop functions', () => {
    const { result } = renderHook(() => useTextToSpeech())
    expect(typeof result.current.speak).toBe('function')
    expect(typeof result.current.stop).toBe('function')
  })

  it('speak does not throw when called with text', () => {
    const { result } = renderHook(() => useTextToSpeech())
    expect(() => result.current.speak('Hello')).not.toThrow()
  })

  it('stop does not throw when called', () => {
    const { result } = renderHook(() => useTextToSpeech())
    expect(() => result.current.stop()).not.toThrow()
  })
})

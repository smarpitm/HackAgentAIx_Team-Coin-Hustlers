import { describe, it, expect } from 'vitest'
import { GESTURES } from '../src/utils/gestureClassifier'

describe('gestureClassifier', () => {
  it('has GESTURES array with known gestures', () => {
    expect(Array.isArray(GESTURES)).toBe(true)
    expect(GESTURES.length).toBeGreaterThan(0)
    expect(GESTURES[0]).toHaveProperty('name')
    expect(GESTURES[0]).toHaveProperty('label')
    expect(GESTURES[0]).toHaveProperty('description')
  })

  it('contains hello gesture', () => {
    const hello = GESTURES.find(g => g.name === 'hello')
    expect(hello).toBeDefined()
    expect(hello.label).toContain('Hello')
  })

  it('contains help gesture', () => {
    const help = GESTURES.find(g => g.name === 'help')
    expect(help).toBeDefined()
    expect(help.label).toContain('Help')
  })

  it('all gestures have non-empty names and labels', () => {
    GESTURES.forEach(g => {
      expect(g.name).toBeTruthy()
      expect(g.label).toBeTruthy()
      expect(g.description).toBeTruthy()
    })
  })
})

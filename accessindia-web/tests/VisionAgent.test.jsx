import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VisionAgent } from '../src/components/Agents/VisionAgent'

describe('VisionAgent', () => {
  it('renders the main heading', () => {
    render(<VisionAgent />)
    expect(screen.getByText('Vision Agent')).toBeTruthy()
  })

  it('renders file upload zone', () => {
    render(<VisionAgent />)
    expect(screen.getByText('Upload Image')).toBeTruthy()
  })

  it('renders the empty state message', () => {
    render(<VisionAgent />)
    expect(screen.getByText('Upload an image to analyze.')).toBeTruthy()
  })
})

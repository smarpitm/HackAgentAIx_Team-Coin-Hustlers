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

  it('renders the description subtitle', () => {
    render(<VisionAgent />)
    expect(screen.getByText(/Extract text from images/i)).toBeTruthy()
  })
})

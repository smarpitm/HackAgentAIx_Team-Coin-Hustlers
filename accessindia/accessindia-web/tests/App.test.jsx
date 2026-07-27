import { describe, it, expect } from 'vitest'
import { render, screen, getAllByText } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App'

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getAllByText(/AccessIndia AI/i).length).toBeGreaterThan(0)
  })

  it('renders the skip-to-content link', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Skip to content')).toBeTruthy()
  })

  it('renders mobile navigation bar', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getAllByText('Chat').length).toBeGreaterThan(0)
  })
})

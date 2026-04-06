import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StarRating } from '../components/ui/StarRating'

describe('StarRating', () => {
  it('renders the correct number of stars', () => {
    render(<StarRating stars={3} max={5} />)
    const stars = screen.getAllByText('⭐')
    expect(stars).toHaveLength(5)
  })

  it('shows 0 filled stars when stars=0', () => {
    const { container } = render(<StarRating stars={0} max={3} />)
    const opaque = container.querySelectorAll('.opacity-100')
    expect(opaque).toHaveLength(0)
  })

  it('marks earned stars as full opacity', () => {
    const { container } = render(<StarRating stars={2} max={3} />)
    const full = container.querySelectorAll('.opacity-100')
    const dim = container.querySelectorAll('.opacity-25')
    expect(full).toHaveLength(2)
    expect(dim).toHaveLength(1)
  })

  it('sets correct aria-label', () => {
    render(<StarRating stars={2} max={3} />)
    expect(screen.getByLabelText('2 כוכבים מתוך 3')).toBeTruthy()
  })

  it('applies sm size class', () => {
    const { container } = render(<StarRating stars={1} max={3} size="sm" />)
    expect(container.firstChild).toHaveClass('text-sm')
  })

  it('applies lg size class', () => {
    const { container } = render(<StarRating stars={1} max={3} size="lg" />)
    expect(container.firstChild).toHaveClass('text-3xl')
  })

  it('defaults to md size', () => {
    const { container } = render(<StarRating stars={1} max={3} />)
    expect(container.firstChild).toHaveClass('text-xl')
  })

  it('renders max=3 by default', () => {
    render(<StarRating stars={2} />)
    const stars = screen.getAllByText('⭐')
    expect(stars).toHaveLength(3)
  })
})

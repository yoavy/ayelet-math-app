interface StarRatingProps {
  stars: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'text-sm', md: 'text-xl', lg: 'text-3xl' }

export function StarRating({ stars, max = 3, size = 'md' }: StarRatingProps) {
  return (
    <span className={`inline-flex gap-0.5 ${sizes[size]}`} aria-label={`${stars} כוכבים מתוך ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < stars ? 'opacity-100' : 'opacity-25'}>⭐</span>
      ))}
    </span>
  )
}

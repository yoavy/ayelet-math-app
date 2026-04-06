export interface Avatar {
  id: string
  emoji: string
  label: string
}

export const AVATARS: Avatar[] = [
  { id: 'star',      emoji: '🌟', label: 'כוכב' },
  { id: 'unicorn',   emoji: '🦄', label: 'חד קרן' },
  { id: 'butterfly', emoji: '🦋', label: 'פרפר' },
  { id: 'cat',       emoji: '🐱', label: 'חתולה' },
  { id: 'fox',       emoji: '🦊', label: 'שועלה' },
  { id: 'rainbow',   emoji: '🌈', label: 'קשת' },
  { id: 'rocket',    emoji: '🚀', label: 'רקטה' },
  { id: 'crown',     emoji: '👑', label: 'כתר' },
]

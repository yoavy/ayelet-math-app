import type { Title, Gender } from '../types'

export const TITLES: Title[] = [
  { id: 't1', nameHebrew: 'מתחילה',        nameHebrewMale: 'מתחיל',         requiredPoints: 0,    iconEmoji: '🌱' },
  { id: 't2', nameHebrew: 'ילדה חכמה',     nameHebrewMale: 'ילד חכם',        requiredPoints: 100,  iconEmoji: '⭐' },
  { id: 't3', nameHebrew: 'פותרת בעיות',   nameHebrewMale: 'פותר בעיות',     requiredPoints: 300,  iconEmoji: '🔢' },
  { id: 't4', nameHebrew: 'אלופת החשבון',  nameHebrewMale: 'אלוף החשבון',    requiredPoints: 600,  iconEmoji: '🏆' },
  { id: 't5', nameHebrew: 'גאון במספרים',  nameHebrewMale: 'גאון במספרים',   requiredPoints: 1200, iconEmoji: '🧠' },
  { id: 't6', nameHebrew: 'מלכת החשבון',   nameHebrewMale: 'מלך החשבון',     requiredPoints: 2500, iconEmoji: '👑' },
  { id: 't7', nameHebrew: 'אגדת המתמטיקה', nameHebrewMale: 'ענק המתמטיקה',  requiredPoints: 5000, iconEmoji: '💎' },
]

export function resolveTitle(totalPoints: number, gender: Gender = 'female'): Title {
  let current = TITLES[0]
  for (const title of TITLES) {
    if (totalPoints >= title.requiredPoints) current = title
  }
  // Return a copy with nameHebrew set to the gender-appropriate form
  if (gender === 'male' && current.nameHebrewMale) {
    return { ...current, nameHebrew: current.nameHebrewMale }
  }
  return current
}

/**
 * Maps common feminine Hebrew words/phrases to their masculine equivalents.
 * Used to transform stored female-form text for male users at display time.
 * Ordered longest-first so multi-word phrases match before single words.
 */
const FEMALE_TO_MALE: [string, string][] = [
  // multi-word first
  ['ילדה חכמה',      'ילד חכם'],
  ['גיבורת המתמטיקה','גיבור המתמטיקה'],
  ['גיבורת המספרים', 'גיבור המספרים'],
  ['אגדת המתמטיקה',  'ענק המתמטיקה'],
  ['אלופת החשבון',   'אלוף החשבון'],
  ['אלופת החיבור',   'אלוף החיבור'],
  ['אלופת החיסור',   'אלוף החיסור'],
  ['אלופת החילוק',   'אלוף החילוק'],
  ['אלופת האחוזים',  'אלוף האחוזים'],
  ['אלופת העשרוניים','אלוף העשרוניים'],
  ['מלכת החשבון',    'מלך החשבון'],
  ['מלכת הכפל',      'מלך הכפל'],
  ['מלכת השברים',    'מלך השברים'],
  ['שגרירת השברים',  'שגריר השברים'],
  ['בעלת השבר',      'בעל השבר'],
  ['אדריכלית המספרים','אדריכל המספרים'],
  ['פותרת בעיות',    'פותר בעיות'],
  ['חוקרת בעיות',    'חוקר בעיות'],
  ['קוראת בעיות',    'קורא בעיות'],
  ['מנהלת בעיות',    'מנהל בעיות'],
  ['גאונית הבעיות',  'גאון הבעיות'],
  ['מחשבת אחוזים',   'מחשב אחוזים'],
  // single words
  ['מתחילה',   'מתחיל'],
  ['מתקדמת',   'מתקדם'],
  ['בקיאה',    'בקיא'],
  ['מומחית',   'מומחה'],
  ['שוברת',    'שובר'],
  ['לוהטת',    'לוהט'],
  ['ברקית',    'ברקי'],
  ['עקבית',    'עקבי'],
]

/** Returns the male form of a Hebrew string, or the original if no mapping found. */
export function toMaleHebrew(text: string): string {
  for (const [female, male] of FEMALE_TO_MALE) {
    if (text.includes(female)) {
      return text.replace(female, male)
    }
  }
  return text
}

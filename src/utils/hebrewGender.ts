/**
 * Maps common feminine Hebrew words/phrases to their masculine equivalents.
 * Used to transform stored female-form text for male users at display time.
 * Ordered longest-first so multi-word phrases match before single words.
 */
const FEMALE_TO_MALE: [string, string][] = [
  // multi-word first
  ['ילדה חכמה',        'ילד חכם'],
  ['גיבורת המתמטיקה',  'גיבור המתמטיקה'],
  ['גיבורת המספרים',   'גיבור המספרים'],
  ['אגדת המתמטיקה',    'ענק המתמטיקה'],
  ['אלופת החשבון',     'אלוף החשבון'],
  ['אלופת החיבור',     'אלוף החיבור'],
  ['אלופת החיסור',     'אלוף החיסור'],
  ['אלופת החילוק',     'אלוף החילוק'],
  ['אלופת האחוזים',    'אלוף האחוזים'],
  ['אלופת העשרוניים',  'אלוף העשרוניים'],
  ['מלכת החשבון',      'מלך החשבון'],
  ['מלכת הכפל',        'מלך הכפל'],
  ['מלכת השברים',      'מלך השברים'],
  ['שגרירת השברים',    'שגריר השברים'],
  ['בעלת השבר',        'בעל השבר'],
  ['אדריכלית המספרים', 'אדריכל המספרים'],
  ['פותרת בעיות',      'פותר בעיות'],
  ['חוקרת בעיות',      'חוקר בעיות'],
  ['קוראת בעיות',      'קורא בעיות'],
  ['מנהלת בעיות',      'מנהל בעיות'],
  ['גאונית הבעיות',    'גאון הבעיות'],
  ['מחשבת אחוזים',     'מחשב אחוזים'],
  // learn-stage UI labels
  ['למדי את הנושא',    'למד את הנושא'],
  ['תלמדי את החומר',   'תלמד את החומר'],
  ['בואי נשחק',        'בוא נשחק'],
  ['קראי → זהי נתונים → זהי נשאל → פתרי', 'קרא → זהה נתונים → זהה נשאל → פתור'],
  ['קראי פעמיים',      'קרא פעמיים'],
  ['הכנסי את התשובה',  'הכנס את התשובה'],
  ['בדקי!',            'בדוק!'],
  ['ראי אם',           'ראה אם'],
  ['הכנסי',            'הכנס'],
  ['פתרי',             'פתור'],
  ['זהי נשאל',         'זהה נשאל'],
  ['זהי נתונים',       'זהה נתונים'],
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

/**
 * Returns the male form of a Hebrew string by replacing ALL female-form phrases.
 * Uses replaceAll so multiple gendered words in the same string are all transformed.
 */
export function toMaleHebrew(text: string): string {
  let result = text
  for (const [female, male] of FEMALE_TO_MALE) {
    if (result.includes(female)) {
      result = result.replaceAll(female, male)
    }
  }
  return result
}

import { useApp } from '../store/AppContext'
import { toMaleHebrew } from '../utils/hebrewGender'

export interface Theme {
  isMale: boolean
  // Gradients
  gradient: string          // e.g. "from-purple-500 to-pink-500"
  gradientBg: string        // full-screen background
  gradientLight: string     // light version for cards
  // Buttons
  primaryBtn: string        // full button bg+text classes
  // Chip / card accents
  chipBg: string
  chipText: string
  // Text & borders
  textPrimary: string
  borderColor: string
  borderColorMd: string     // slightly stronger border
  bgLight: string
  bgMuted: string           // for progress bar track, etc.
  // Progress bar fill
  progressBar: string       // gradient for progress bars
  // Level circles
  levelCircleActive: string // active/available level circle
  levelCircleComplete: string
  // Topic path connector
  pathColor: string
  // Hebrew strings
  topicsLabel: string
  shareLabel: string
  letsStart: string
  tryAgain: string
  welcomeTitle: string
  helloLabel: string
  genderSubtitle: string
  fractionHint: string
  inputPlaceholder: string
  // Gendered text transformer
  g: (text: string) => string
}

export function useTheme(): Theme {
  const { state } = useApp()
  const isMale = state.userProfile?.gender === 'male'

  if (isMale) {
    return {
      isMale: true,
      gradient: 'from-blue-500 to-cyan-400',
      gradientBg: 'from-blue-400 via-sky-400 to-cyan-300',
      gradientLight: 'from-blue-100 to-cyan-100',
      primaryBtn: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
      chipBg: 'bg-blue-50',
      chipText: 'text-blue-600',
      textPrimary: 'text-blue-700',
      borderColor: 'border-blue-100',
      borderColorMd: 'border-blue-200',
      bgLight: 'bg-blue-50',
      bgMuted: 'bg-blue-100',
      progressBar: 'from-blue-400 to-cyan-400',
      levelCircleActive: 'bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-md',
      levelCircleComplete: 'bg-blue-500 text-white',
      pathColor: 'bg-blue-100',
      topicsLabel: 'בחר נושא',
      shareLabel: 'שתף',
      letsStart: 'בוא נתחיל! 🌟',
      tryAgain: 'נסה שוב 🔄',
      welcomeTitle: 'ברוך הבא!',
      helloLabel: 'שלום,',
      genderSubtitle: 'אתה עומד להפוך לגיבור המתמטיקה!',
      fractionHint: 'לשבר: הקלד מונה/מכנה (למשל 3/4)',
      inputPlaceholder: 'הקלד תשובה...',
      g: toMaleHebrew,
    }
  }

  return {
    isMale: false,
    gradient: 'from-purple-500 to-pink-500',
    gradientBg: 'from-purple-400 via-pink-400 to-orange-300',
    gradientLight: 'from-purple-100 to-pink-100',
    primaryBtn: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    chipBg: 'bg-purple-50',
    chipText: 'text-purple-600',
    textPrimary: 'text-purple-700',
    borderColor: 'border-purple-100',
    borderColorMd: 'border-purple-200',
    bgLight: 'bg-purple-50',
    bgMuted: 'bg-purple-100',
    progressBar: 'from-purple-400 to-pink-400',
    levelCircleActive: 'bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-md',
    levelCircleComplete: 'bg-purple-500 text-white',
    pathColor: 'bg-purple-100',
    topicsLabel: 'בחרי נושא',
    shareLabel: 'שתפי',
    letsStart: 'בואי נתחיל! 🌟',
    tryAgain: 'נסי שוב 🔄',
    welcomeTitle: 'ברוכה הבאה!',
    helloLabel: 'שלום,',
    genderSubtitle: 'את עומדת להפוך לגיבורת המתמטיקה!',
    fractionHint: 'לשבר: הקלידי מונה/מכנה (למשל 3/4)',
    inputPlaceholder: 'הקלידי תשובה...',
    g: (text) => text,
  }
}

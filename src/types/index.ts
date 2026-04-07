// ─── Core Enums ───────────────────────────────────────────────────────────────

export type TopicId =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'fractions'
  | 'decimals'
  | 'geometry'
  | 'wordProblems'
  | 'percentages'

export type Gender = 'female' | 'male'
export type Difficulty = 'easy' | 'medium' | 'hard'

export type QuestionType =
  | 'numeric_input'
  | 'multiple_choice'
  | 'fill_blank'
  | 'word_problem'

export type BadgeRarity = 'bronze' | 'silver' | 'gold' | 'diamond'

export type LevelStatus = 'locked' | 'available' | 'in_progress' | 'completed'

// ─── User Profile ─────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  name: string
  avatarId: string
  createdAt: number
  onboardingComplete: boolean
  totalPoints: number
  currentTitle: string
  currentStreak: number
  maxStreak: number
  dailyStreak: number
  lastPlayedAt: number
  badgeIds: string[]
  parentPin: string | null
  gender: Gender
  difficulty: Difficulty
}

// ─── Topic ────────────────────────────────────────────────────────────────────

export interface Topic {
  id: TopicId
  nameHebrew: string
  emoji: string
  color: string
  bgColor: string
  levels: Level[]
}

// ─── Level ────────────────────────────────────────────────────────────────────

export interface DifficultyParams {
  minValue: number
  maxValue: number
  operandCount: 2 | 3
  allowNegativeResult: boolean
  allowDecimals: boolean
  decimalPlaces?: number
}

export interface Level {
  id: string
  topicId: TopicId
  levelNumber: 1 | 2 | 3 | 4 | 5
  nameHebrew: string
  titleHebrew: string
  questionsPerSession: number
  passingScore: number
  starThresholds: [number, number, number]
  allowedQuestionTypes: QuestionType[]
  timeLimitSeconds: number | null
  difficultyParams: DifficultyParams
}

// ─── Question ─────────────────────────────────────────────────────────────────

export interface Choice {
  id: string
  value: number | string
  label: string
}

export interface Question {
  id: string
  topicId: TopicId
  levelId: string
  type: QuestionType
  displayText: string
  expression?: string
  answer: number | string
  choices?: Choice[]
  hintText?: string
}

// ─── Score ────────────────────────────────────────────────────────────────────

export interface Score {
  levelId: string
  topicId: TopicId
  stars: 0 | 1 | 2 | 3
  pointsEarned: number
  correctCount: number
  totalCount: number
  bestStreak: number
  completedAt: number
  attempts: number
}

// ─── Badge ────────────────────────────────────────────────────────────────────

export interface BadgeCondition {
  type:
    | 'streak'
    | 'topic_complete'
    | 'all_stars'
    | 'total_points'
    | 'daily_streak'
    | 'speed_demon'
    | 'first_play'
  threshold: number
  topicId?: TopicId
}

export interface Badge {
  id: string
  nameHebrew: string
  nameHebrewMale?: string
  descriptionHebrew: string
  emoji: string
  rarity: BadgeRarity
  condition: BadgeCondition
}

// ─── Title ────────────────────────────────────────────────────────────────────

export interface Title {
  id: string
  nameHebrew: string
  nameHebrewMale?: string
  requiredPoints: number
  iconEmoji: string
}

// ─── Game Session ─────────────────────────────────────────────────────────────

export interface SessionQuestion {
  question: Question
  userAnswer: number | string | null
  isCorrect: boolean | null
  answeredAt: number | null
  timeSpentMs: number | null
  pointsAwarded: number
  hintsUsed: number
}

export interface GameSession {
  id: string
  topicId: TopicId
  levelId: string
  startedAt: number
  endedAt: number | null
  questions: SessionQuestion[]
  currentQuestionIndex: number
  currentStreak: number
  pointsThisSession: number
  streakMultiplier: number
  isComplete: boolean
  isPassed: boolean
}

// ─── Weekly / Daily Activity ──────────────────────────────────────────────────

export interface DailyActivity {
  date: string
  sessionsPlayed: number
  pointsEarned: number
  questionsAnswered: number
  correctAnswers: number
}

export interface WeeklyReport {
  weekStartDate: number
  weekEndDate: number
  totalSessionsPlayed: number
  totalPointsEarned: number
  badgesEarned: string[]
  averageAccuracy: number
  longestStreak: number
  topicsProgress: {
    topicId: TopicId
    sessionsPlayed: number
    levelsCompleted: number
    starsEarned: number
    pointsEarned: number
  }[]
}

// ─── Learn Stage ──────────────────────────────────────────────────────────────

export interface LearnChoice {
  id: string
  label: string
  value: string | number
}

export interface LearnValidationQuestion {
  /** Question prompt (Hebrew, female form — transformed via theme.g() at render time) */
  prompt: string
  /** Optional LTR math expression displayed below the prompt */
  expression?: string
  /** The correct answer */
  answer: string | number
  type: 'numeric_input' | 'multiple_choice'
  choices?: LearnChoice[]
  /** Shown after 2 wrong attempts */
  hintText?: string
}

export interface LearnSlide {
  id: string
  /** Explanation text (Hebrew, female form — transformed via theme.g() at render time) */
  explanationHebrew: string
  /** Visual example content (emoji string, math expression, or descriptive text) */
  visualExample?: string
  /** How to render the visual example */
  visualType?: 'expression' | 'text' | 'emoji_grid'
  validationQuestions: LearnValidationQuestion[]
}

export interface TopicLearnContent {
  topicId: TopicId
  /** Short subtitle shown on the learn page header (Hebrew, female form) */
  subtitleHebrew: string
  slides: LearnSlide[]
}

// ─── App State ────────────────────────────────────────────────────────────────

export interface AppState {
  userProfile: UserProfile | null
  scores: Record<string, Score>
  activeSession: GameSession | null
  pendingBadges: Badge[]
  weeklyData: DailyActivity[]
}

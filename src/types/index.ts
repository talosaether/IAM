// Habits
export interface Habit {
  id: number
  name: string
  icon: string
  frequency: 'daily' | 'weekly'
  groupId: number | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface HabitGroup {
  id: number
  name: string
  sortOrder: number
  createdAt: string
}

export interface HabitCompletion {
  id: number
  habitId: number
  completedDate: string
  createdAt: string
}

// Checklists
export interface Checklist {
  id: number
  name: string
  isTemplate: boolean
  createdAt: string
  updatedAt: string
}

export interface ChecklistItem {
  id: number
  checklistId: number
  text: string
  isCompleted: boolean
  sortOrder: number
  createdAt: string
}

// Meals
export type FoodCategory =
  | 'protein'
  | 'carbs'
  | 'vegetables'
  | 'fruits'
  | 'dairy'
  | 'fats'
  | 'other'

export interface Food {
  id: number
  name: string
  category: FoodCategory
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number | null
  servingSize: string
  isCustom: boolean
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface MealIdea {
  id: number
  name: string
  mealType: MealType
  description: string | null
  prepTime: number | null
  isFavorite: boolean
}

export interface MealIngredient {
  id: number
  mealId: number
  foodId: number
  quantity: number | null
  unit: string | null
}

// Exercise
export type SportType =
  | 'general'
  | 'basketball'
  | 'soccer'
  | 'running'
  | 'swimming'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface WorkoutProgram {
  id: number
  name: string
  sportType: SportType
  description: string | null
  difficulty: Difficulty
  durationWeeks: number
}

export interface WorkoutDay {
  id: number
  programId: number
  dayOfWeek: number
  weekNumber: number
  focusArea: string | null
}

export interface Exercise {
  id: number
  workoutDayId: number
  name: string
  sets: number | null
  reps: string | null
  durationSeconds: number | null
  restSeconds: number | null
  notes: string | null
  sortOrder: number
}

export interface WorkoutCompletion {
  id: number
  workoutDayId: number
  completedDate: string
  durationMinutes: number | null
  notes: string | null
  createdAt: string
}

// Settings
export type Theme = 'light' | 'dark' | 'system'
export type AgeGroup = 'teen' | 'adult'
export type SportFocus = 'general' | 'basketball' | 'soccer' | 'running' | 'swimming'

export interface Settings {
  id: number
  userName: string
  theme: Theme
  sportFocus: SportFocus
  ageGroup: AgeGroup
  createdAt: string
  updatedAt: string
}

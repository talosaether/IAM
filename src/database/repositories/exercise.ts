import { db } from '../index'
import { WORKOUT_PROGRAMS, getWorkoutProgram, type SportType, type AgeGroup, type ProgramData, type DayPlanData } from '../seeds/workouts'

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export interface WorkoutCompletion {
  id: number
  workoutDayId: number
  completedDate: string
  durationMinutes?: number
  notes?: string
  createdAt: string
}

export const exerciseRepository = {
  // ============ PROGRAMS ============

  getAllPrograms(): ProgramData[] {
    return WORKOUT_PROGRAMS
  },

  getProgram(sportType: SportType, ageGroup: AgeGroup): ProgramData | undefined {
    return getWorkoutProgram(sportType, ageGroup)
  },

  getProgramForSettings(sportType: string, ageGroup: string): ProgramData | undefined {
    return getWorkoutProgram(sportType as SportType, ageGroup as AgeGroup)
  },

  // ============ TODAY'S WORKOUT ============

  getTodaysWorkout(sportType: string, ageGroup: string): DayPlanData | null {
    const program = this.getProgramForSettings(sportType, ageGroup)
    if (!program) return null

    const today = new Date().getDay() // 0 = Sunday
    return program.days.find(d => d.dayOfWeek === today) || null
  },

  getWorkoutForDay(sportType: string, ageGroup: string, dayOfWeek: number): DayPlanData | null {
    const program = this.getProgramForSettings(sportType, ageGroup)
    if (!program) return null

    return program.days.find(d => d.dayOfWeek === dayOfWeek) || null
  },

  getDayName(dayOfWeek: number): string {
    return DAYS_OF_WEEK[dayOfWeek] || ''
  },

  // ============ COMPLETIONS ============

  async getCompletionsForDate(date: string): Promise<WorkoutCompletion[]> {
    return db.query<WorkoutCompletion>(
      `SELECT id, workout_day_id as workoutDayId, completed_date as completedDate,
              duration_minutes as durationMinutes, notes, created_at as createdAt
       FROM workout_completions
       WHERE completed_date = ?`,
      [date]
    )
  },

  async getCompletionsInRange(startDate: string, endDate: string): Promise<WorkoutCompletion[]> {
    return db.query<WorkoutCompletion>(
      `SELECT id, workout_day_id as workoutDayId, completed_date as completedDate,
              duration_minutes as durationMinutes, notes, created_at as createdAt
       FROM workout_completions
       WHERE completed_date >= ? AND completed_date <= ?
       ORDER BY completed_date ASC`,
      [startDate, endDate]
    )
  },

  async markCompleted(dayOfWeek: number, date: string, durationMinutes?: number, notes?: string): Promise<number> {
    // Use dayOfWeek as the workout_day_id for simplicity
    const result = await db.run(
      `INSERT INTO workout_completions (workout_day_id, completed_date, duration_minutes, notes)
       VALUES (?, ?, ?, ?)`,
      [dayOfWeek, date, durationMinutes || null, notes || null]
    )
    return result.lastInsertId
  },

  async removeCompletion(dayOfWeek: number, date: string): Promise<void> {
    await db.run(
      'DELETE FROM workout_completions WHERE workout_day_id = ? AND completed_date = ?',
      [dayOfWeek, date]
    )
  },

  async isCompletedOnDate(dayOfWeek: number, date: string): Promise<boolean> {
    const results = await db.query<{ count: number }>(
      'SELECT COUNT(*) as count FROM workout_completions WHERE workout_day_id = ? AND completed_date = ?',
      [dayOfWeek, date]
    )
    return (results[0]?.count ?? 0) > 0
  },

  async toggleCompletion(dayOfWeek: number, date: string): Promise<boolean> {
    const isCompleted = await this.isCompletedOnDate(dayOfWeek, date)
    if (isCompleted) {
      await this.removeCompletion(dayOfWeek, date)
      return false
    } else {
      await this.markCompleted(dayOfWeek, date)
      return true
    }
  },

  // ============ STREAK ============

  async getWeeklyStreak(): Promise<number> {
    // Count how many weeks in a row the user has completed at least one workout
    const today = new Date()
    let streak = 0
    let currentWeekStart = this.getWeekStart(today)

    while (true) {
      const weekEnd = new Date(currentWeekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)

      const completions = await this.getCompletionsInRange(
        currentWeekStart.toISOString().split('T')[0],
        weekEnd.toISOString().split('T')[0]
      )

      if (completions.length > 0) {
        streak++
        currentWeekStart.setDate(currentWeekStart.getDate() - 7)
      } else {
        break
      }
    }

    return streak
  },

  getWeekStart(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day
    d.setDate(diff)
    d.setHours(0, 0, 0, 0)
    return d
  },

  // ============ WEEK DATA ============

  async getWeekData(sportType: string, ageGroup: string): Promise<{
    days: Array<{
      dayOfWeek: number
      dayName: string
      date: string
      workout: DayPlanData | null
      isCompleted: boolean
      isToday: boolean
    }>
  }> {
    const today = new Date()
    const weekStart = this.getWeekStart(today)
    const program = this.getProgramForSettings(sportType, ageGroup)

    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      const dayOfWeek = date.getDay()

      const workout = program?.days.find(d => d.dayOfWeek === dayOfWeek) || null
      const isCompleted = await this.isCompletedOnDate(dayOfWeek, dateStr)
      const isToday = date.toDateString() === today.toDateString()

      days.push({
        dayOfWeek,
        dayName: DAYS_OF_WEEK[dayOfWeek],
        date: dateStr,
        workout,
        isCompleted,
        isToday
      })
    }

    return { days }
  }
}

import { db } from '../index'
import type { Habit, HabitGroup, HabitCompletion } from '../../types'

export interface HabitWithMeta extends Habit {
  completedToday: boolean
  currentStreak: number
}

export const habitsRepository = {
  // ============ HABITS ============

  async getAll(): Promise<Habit[]> {
    const habits = await db.query<Habit>(
      `SELECT id, name, icon, frequency, group_id as groupId, sort_order as sortOrder,
              is_active as isActive, created_at as createdAt, updated_at as updatedAt
       FROM habits
       WHERE is_active = 1
       ORDER BY sort_order ASC`
    )
    return habits
  },

  async getById(id: number): Promise<Habit | null> {
    const habits = await db.query<Habit>(
      `SELECT id, name, icon, frequency, group_id as groupId, sort_order as sortOrder,
              is_active as isActive, created_at as createdAt, updated_at as updatedAt
       FROM habits WHERE id = ?`,
      [id]
    )
    return habits[0] || null
  },

  async create(habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const maxOrder = await db.query<{ maxOrder: number }>(
      'SELECT COALESCE(MAX(sort_order), -1) as maxOrder FROM habits'
    )
    const sortOrder = (maxOrder[0]?.maxOrder ?? -1) + 1

    const result = await db.run(
      `INSERT INTO habits (name, icon, frequency, group_id, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [habit.name, habit.icon || 'check', habit.frequency || 'daily', habit.groupId || null, sortOrder]
    )
    return result.lastInsertId
  },

  async update(id: number, updates: Partial<Habit>): Promise<void> {
    const fields: string[] = []
    const values: any[] = []

    if (updates.name !== undefined) {
      fields.push('name = ?')
      values.push(updates.name)
    }
    if (updates.icon !== undefined) {
      fields.push('icon = ?')
      values.push(updates.icon)
    }
    if (updates.frequency !== undefined) {
      fields.push('frequency = ?')
      values.push(updates.frequency)
    }
    if (updates.groupId !== undefined) {
      fields.push('group_id = ?')
      values.push(updates.groupId)
    }
    if (updates.sortOrder !== undefined) {
      fields.push('sort_order = ?')
      values.push(updates.sortOrder)
    }

    if (fields.length > 0) {
      fields.push("updated_at = datetime('now')")
      values.push(id)
      await db.run(`UPDATE habits SET ${fields.join(', ')} WHERE id = ?`, values)
    }
  },

  async delete(id: number): Promise<void> {
    await db.run('DELETE FROM habits WHERE id = ?', [id])
  },

  async reorder(habitIds: number[]): Promise<void> {
    for (let i = 0; i < habitIds.length; i++) {
      await db.run('UPDATE habits SET sort_order = ? WHERE id = ?', [i, habitIds[i]])
    }
  },

  // ============ GROUPS ============

  async getGroups(): Promise<HabitGroup[]> {
    return db.query<HabitGroup>(
      `SELECT id, name, sort_order as sortOrder, created_at as createdAt
       FROM habit_groups ORDER BY sort_order ASC`
    )
  },

  async createGroup(name: string): Promise<number> {
    const maxOrder = await db.query<{ maxOrder: number }>(
      'SELECT COALESCE(MAX(sort_order), -1) as maxOrder FROM habit_groups'
    )
    const sortOrder = (maxOrder[0]?.maxOrder ?? -1) + 1

    const result = await db.run(
      'INSERT INTO habit_groups (name, sort_order) VALUES (?, ?)',
      [name, sortOrder]
    )
    return result.lastInsertId
  },

  async updateGroup(id: number, name: string): Promise<void> {
    await db.run('UPDATE habit_groups SET name = ? WHERE id = ?', [name, id])
  },

  async deleteGroup(id: number): Promise<void> {
    await db.run('UPDATE habits SET group_id = NULL WHERE group_id = ?', [id])
    await db.run('DELETE FROM habit_groups WHERE id = ?', [id])
  },

  // ============ COMPLETIONS ============

  async getCompletionsForDate(date: string): Promise<HabitCompletion[]> {
    return db.query<HabitCompletion>(
      `SELECT id, habit_id as habitId, completed_date as completedDate, created_at as createdAt
       FROM habit_completions WHERE completed_date = ?`,
      [date]
    )
  },

  async getCompletionsInRange(startDate: string, endDate: string): Promise<HabitCompletion[]> {
    return db.query<HabitCompletion>(
      `SELECT id, habit_id as habitId, completed_date as completedDate, created_at as createdAt
       FROM habit_completions
       WHERE completed_date >= ? AND completed_date <= ?`,
      [startDate, endDate]
    )
  },

  async toggleCompletion(habitId: number, date: string): Promise<boolean> {
    const existing = await db.query<HabitCompletion>(
      'SELECT id FROM habit_completions WHERE habit_id = ? AND completed_date = ?',
      [habitId, date]
    )

    if (existing.length > 0) {
      await db.run('DELETE FROM habit_completions WHERE habit_id = ? AND completed_date = ?', [habitId, date])
      return false
    } else {
      await db.run(
        'INSERT INTO habit_completions (habit_id, completed_date) VALUES (?, ?)',
        [habitId, date]
      )
      return true
    }
  },

  async isCompletedOnDate(habitId: number, date: string): Promise<boolean> {
    const result = await db.query<{ count: number }>(
      'SELECT COUNT(*) as count FROM habit_completions WHERE habit_id = ? AND completed_date = ?',
      [habitId, date]
    )
    return (result[0]?.count ?? 0) > 0
  },

  // ============ STREAKS ============

  async getStreak(habitId: number): Promise<number> {
    const today = new Date()
    let streak = 0
    let currentDate = new Date(today)

    // Check if completed today, if not start from yesterday
    const todayStr = currentDate.toISOString().split('T')[0]
    const completedToday = await this.isCompletedOnDate(habitId, todayStr)

    if (!completedToday) {
      currentDate.setDate(currentDate.getDate() - 1)
    }

    // Count consecutive days
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const completed = await this.isCompletedOnDate(habitId, dateStr)

      if (completed) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  },

  async getHabitsWithMeta(date: string): Promise<HabitWithMeta[]> {
    const habits = await this.getAll()
    const completions = await this.getCompletionsForDate(date)
    const completedIds = new Set(completions.map(c => c.habitId))

    const habitsWithMeta: HabitWithMeta[] = []

    for (const habit of habits) {
      const currentStreak = await this.getStreak(habit.id)
      habitsWithMeta.push({
        ...habit,
        completedToday: completedIds.has(habit.id),
        currentStreak
      })
    }

    return habitsWithMeta
  },

  async getTodayCompletionRate(): Promise<{ completed: number; total: number }> {
    const today = new Date().toISOString().split('T')[0]
    const habits = await this.getAll()
    const completions = await this.getCompletionsForDate(today)

    return {
      completed: completions.length,
      total: habits.length
    }
  }
}

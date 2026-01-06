import { db } from '../index'
import type { MealIdea, Food } from '../../types'
import { MEALS_SEED } from '../seeds/meals'
import { FOODS_SEED } from '../seeds/foods'

export type MealType = 'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface MealWithFavorite extends MealIdea {
  isFavorite: boolean
}

export const mealsRepository = {
  // ============ SEED DATA ============

  async seedIfEmpty(): Promise<void> {
    const meals = await this.getAllMeals()
    if (meals.length === 0) {
      // Seed meals
      for (const meal of MEALS_SEED) {
        await db.run(
          `INSERT INTO meal_ideas (name, meal_type, description, prep_time, is_favorite)
           VALUES (?, ?, ?, ?, 0)`,
          [meal.name, meal.mealType, meal.description, meal.prepTime]
        )
      }

      // Seed foods
      for (const food of FOODS_SEED) {
        await db.run(
          `INSERT INTO foods (name, category, calories, protein, carbs, fat, fiber, serving_size, is_custom)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
          [food.name, food.category, food.calories, food.protein, food.carbs, food.fat, food.fiber, food.servingSize]
        )
      }
    }
  },

  // ============ MEALS ============

  async getAllMeals(): Promise<MealWithFavorite[]> {
    return db.query<MealWithFavorite>(
      `SELECT id, name, meal_type as mealType, description, prep_time as prepTime,
              is_favorite as isFavorite
       FROM meal_ideas
       ORDER BY name ASC`
    )
  },

  async getMealsByType(type: MealType): Promise<MealWithFavorite[]> {
    if (type === 'all') {
      return this.getAllMeals()
    }
    return db.query<MealWithFavorite>(
      `SELECT id, name, meal_type as mealType, description, prep_time as prepTime,
              is_favorite as isFavorite
       FROM meal_ideas
       WHERE meal_type = ?
       ORDER BY name ASC`,
      [type]
    )
  },

  async getFavoriteMeals(): Promise<MealWithFavorite[]> {
    return db.query<MealWithFavorite>(
      `SELECT id, name, meal_type as mealType, description, prep_time as prepTime,
              is_favorite as isFavorite
       FROM meal_ideas
       WHERE is_favorite = 1
       ORDER BY name ASC`
    )
  },

  async toggleFavorite(mealId: number): Promise<boolean> {
    const meals = await db.query<{ isFavorite: number }>(
      'SELECT is_favorite as isFavorite FROM meal_ideas WHERE id = ?',
      [mealId]
    )
    const newValue = meals[0]?.isFavorite ? 0 : 1
    await db.run('UPDATE meal_ideas SET is_favorite = ? WHERE id = ?', [newValue, mealId])
    return newValue === 1
  },

  async searchMeals(query: string): Promise<MealWithFavorite[]> {
    const searchTerm = `%${query.toLowerCase()}%`
    return db.query<MealWithFavorite>(
      `SELECT id, name, meal_type as mealType, description, prep_time as prepTime,
              is_favorite as isFavorite
       FROM meal_ideas
       WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ?
       ORDER BY name ASC`,
      [searchTerm, searchTerm]
    )
  },

  // ============ FOODS ============

  async getAllFoods(): Promise<Food[]> {
    return db.query<Food>(
      `SELECT id, name, category, calories, protein, carbs, fat, fiber,
              serving_size as servingSize, is_custom as isCustom
       FROM foods
       ORDER BY name ASC`
    )
  },

  async getFoodsByCategory(category: string): Promise<Food[]> {
    return db.query<Food>(
      `SELECT id, name, category, calories, protein, carbs, fat, fiber,
              serving_size as servingSize, is_custom as isCustom
       FROM foods
       WHERE category = ?
       ORDER BY name ASC`,
      [category]
    )
  },

  async searchFoods(query: string): Promise<Food[]> {
    const searchTerm = `%${query.toLowerCase()}%`
    return db.query<Food>(
      `SELECT id, name, category, calories, protein, carbs, fat, fiber,
              serving_size as servingSize, is_custom as isCustom
       FROM foods
       WHERE LOWER(name) LIKE ?
       ORDER BY name ASC`,
      [searchTerm]
    )
  },

  async getFoodCategories(): Promise<string[]> {
    const results = await db.query<{ category: string }>(
      'SELECT DISTINCT category FROM foods ORDER BY category'
    )
    return results.map(r => r.category)
  }
}

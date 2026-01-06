import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mealsRepository, type MealWithFavorite, type MealType } from '../database/repositories/meals'
import type { Food } from '../types'

export const useMealsStore = defineStore('meals', () => {
  // State
  const meals = ref<MealWithFavorite[]>([])
  const foods = ref<Food[]>([])
  const activeFilter = ref<MealType>('all')
  const showFavoritesOnly = ref(false)
  const searchQuery = ref('')
  const isLoading = ref(false)
  const isSeeded = ref(false)

  // Getters
  const filteredMeals = computed(() => {
    let result = meals.value

    if (showFavoritesOnly.value) {
      result = result.filter(m => m.isFavorite)
    } else if (activeFilter.value !== 'all') {
      result = result.filter(m => m.mealType === activeFilter.value)
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.description?.toLowerCase().includes(query)
      )
    }

    return result
  })

  const mealsByType = computed(() => {
    const grouped: Record<string, MealWithFavorite[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: []
    }
    for (const meal of meals.value) {
      if (meal.mealType && grouped[meal.mealType]) {
        grouped[meal.mealType].push(meal)
      }
    }
    return grouped
  })

  const favoriteMeals = computed(() => meals.value.filter(m => m.isFavorite))
  const favoriteCount = computed(() => favoriteMeals.value.length)

  const foodsByCategory = computed(() => {
    const grouped: Record<string, Food[]> = {}
    for (const food of foods.value) {
      const category = food.category || 'other'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(food)
    }
    return grouped
  })

  const foodCategories = computed(() => Object.keys(foodsByCategory.value).sort())

  // Actions
  async function initialize() {
    if (!isSeeded.value) {
      await mealsRepository.seedIfEmpty()
      isSeeded.value = true
    }
  }

  async function loadMeals() {
    isLoading.value = true
    try {
      await initialize()
      meals.value = await mealsRepository.getAllMeals()
    } finally {
      isLoading.value = false
    }
  }

  async function loadFoods() {
    isLoading.value = true
    try {
      await initialize()
      foods.value = await mealsRepository.getAllFoods()
    } finally {
      isLoading.value = false
    }
  }

  async function loadAll() {
    isLoading.value = true
    try {
      await initialize()
      meals.value = await mealsRepository.getAllMeals()
      foods.value = await mealsRepository.getAllFoods()
    } finally {
      isLoading.value = false
    }
  }

  async function toggleFavorite(mealId: number) {
    const isFavorite = await mealsRepository.toggleFavorite(mealId)

    // Update local state
    const meal = meals.value.find(m => m.id === mealId)
    if (meal) {
      meal.isFavorite = isFavorite
    }

    return isFavorite
  }

  function setFilter(filter: MealType) {
    activeFilter.value = filter
    showFavoritesOnly.value = false
  }

  function setShowFavorites(show: boolean) {
    showFavoritesOnly.value = show
    if (show) {
      activeFilter.value = 'all'
    }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function clearSearch() {
    searchQuery.value = ''
  }

  return {
    // State
    meals,
    foods,
    activeFilter,
    showFavoritesOnly,
    searchQuery,
    isLoading,

    // Getters
    filteredMeals,
    mealsByType,
    favoriteMeals,
    favoriteCount,
    foodsByCategory,
    foodCategories,

    // Actions
    loadMeals,
    loadFoods,
    loadAll,
    toggleFavorite,
    setFilter,
    setShowFavorites,
    setSearchQuery,
    clearSearch
  }
})

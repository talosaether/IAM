<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Search, X, Heart, UtensilsCrossed, Apple } from 'lucide-vue-next'
import { useMealsStore } from '../stores/meals'
import MealCard from '../components/meals/MealCard.vue'
import FoodCard from '../components/meals/FoodCard.vue'
import PullToRefresh from '../components/common/PullToRefresh.vue'
import type { MealType } from '../database/repositories/meals'

type ViewTab = 'meals' | 'foods'
type MealFilter = MealType | 'favorites'

const mealsStore = useMealsStore()
const pullRefreshRef = ref<InstanceType<typeof PullToRefresh> | null>(null)
const isRefreshing = ref(false)

const activeTab = ref<ViewTab>('meals')
const activeFilter = ref<MealFilter>('all')
const searchQuery = ref('')
const showSearch = ref(false)

const meals = computed(() => mealsStore.filteredMeals)
const foods = computed(() => mealsStore.foods)
const foodsByCategory = computed(() => mealsStore.foodsByCategory)
const foodCategories = computed(() => mealsStore.foodCategories)
const isLoading = computed(() => mealsStore.isLoading)
const favoriteCount = computed(() => mealsStore.favoriteCount)

const mealFilters: { value: MealFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snacks' }
]

const categoryLabels: Record<string, string> = {
  fruits: 'Fruits',
  vegetables: 'Vegetables',
  protein: 'Protein',
  carbs: 'Grains & Carbs',
  dairy: 'Dairy',
  fats: 'Nuts & Fats',
  other: 'Other'
}

onMounted(() => {
  mealsStore.loadAll()
})

watch(activeFilter, (newFilter) => {
  if (newFilter === 'favorites') {
    mealsStore.setShowFavorites(true)
  } else {
    mealsStore.setFilter(newFilter as MealType)
  }
})

watch(searchQuery, (query) => {
  mealsStore.setSearchQuery(query)
})

function toggleSearch() {
  showSearch.value = !showSearch.value
  if (!showSearch.value) {
    searchQuery.value = ''
    mealsStore.clearSearch()
  }
}

function handleToggleFavorite(mealId: number) {
  mealsStore.toggleFavorite(mealId)
}

async function handleRefresh() {
  isRefreshing.value = true
  await mealsStore.loadAll()
  isRefreshing.value = false
  pullRefreshRef.value?.finishRefresh()
}
</script>

<template>
  <div class="meals-view pt-safe">
    <PullToRefresh ref="pullRefreshRef" :loading="isRefreshing" @refresh="handleRefresh">
    <div class="px-4 py-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Nutrition</h1>
        <button
          class="search-toggle"
          :class="{ active: showSearch }"
          @click="toggleSearch"
        >
          <Search v-if="!showSearch" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>
      </div>

      <!-- Search Bar -->
      <Transition name="slide">
        <div v-if="showSearch" class="search-bar mb-4">
          <Search class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search meals or foods..."
            class="search-input"
            autofocus
          />
          <button
            v-if="searchQuery"
            class="clear-btn"
            @click="searchQuery = ''"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </Transition>

      <!-- View Tabs -->
      <div class="view-tabs mb-4">
        <button
          class="view-tab"
          :class="{ active: activeTab === 'meals' }"
          @click="activeTab = 'meals'"
        >
          <UtensilsCrossed class="w-4 h-4" />
          Meal Ideas
        </button>
        <button
          class="view-tab"
          :class="{ active: activeTab === 'foods' }"
          @click="activeTab = 'foods'"
        >
          <Apple class="w-4 h-4" />
          Foods
        </button>
      </div>

      <!-- Meals Tab -->
      <template v-if="activeTab === 'meals'">
        <!-- Filter Tabs -->
        <div class="filter-tabs mb-4">
          <button
            v-for="filter in mealFilters"
            :key="filter.value"
            class="filter-tab"
            :class="{ active: activeFilter === filter.value }"
            @click="activeFilter = filter.value"
          >
            <Heart
              v-if="filter.value === 'favorites'"
              class="w-4 h-4 mr-1"
              :fill="activeFilter === 'favorites' ? 'currentColor' : 'none'"
            />
            {{ filter.label }}
            <span v-if="filter.value === 'favorites' && favoriteCount > 0" class="count-badge">
              {{ favoriteCount }}
            </span>
          </button>
        </div>

        <!-- Meal List -->
        <div v-if="meals.length > 0" class="space-y-3">
          <MealCard
            v-for="meal in meals"
            :key="meal.id"
            :meal="meal"
            @toggle-favorite="handleToggleFavorite"
          />
        </div>

        <!-- Empty State -->
        <div v-else-if="!isLoading" class="empty-state">
          <UtensilsCrossed class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p v-if="searchQuery" class="text-gray-500 dark:text-gray-400 text-center">
            No meals found for "{{ searchQuery }}"
          </p>
          <p v-else-if="activeFilter === 'favorites'" class="text-gray-500 dark:text-gray-400 text-center">
            No favorite meals yet.<br />
            Tap the heart icon on a meal to add it to favorites.
          </p>
          <p v-else class="text-gray-500 dark:text-gray-400 text-center">
            No meals available.
          </p>
        </div>
      </template>

      <!-- Foods Tab -->
      <template v-else>
        <div v-if="foods.length > 0" class="space-y-6">
          <div
            v-for="category in foodCategories"
            :key="category"
            class="category-section"
          >
            <h2 class="category-header">
              {{ categoryLabels[category] || category }}
            </h2>
            <div class="food-grid">
              <FoodCard
                v-for="food in foodsByCategory[category]"
                :key="food.id"
                :food="food"
              />
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!isLoading" class="empty-state">
          <Apple class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500 dark:text-gray-400 text-center">
            No foods available.
          </p>
        </div>
      </template>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="loading-spinner" />
      </div>
    </div>
    </PullToRefresh>
  </div>
</template>

<style scoped>
.meals-view {
  @apply min-h-full pb-20;
}

.search-toggle {
  @apply p-2 rounded-lg transition-colors;
  @apply text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800;
}

.search-toggle.active {
  @apply bg-primary text-white hover:bg-primary-dark;
}

.search-bar {
  @apply relative flex items-center;
}

.search-icon {
  @apply absolute left-4 w-5 h-5 text-gray-400;
}

.search-input {
  @apply w-full pl-12 pr-10 py-3 rounded-xl;
  @apply bg-gray-100 dark:bg-gray-800;
  @apply text-gray-900 dark:text-white;
  @apply outline-none border border-transparent focus:border-primary;
}

.clear-btn {
  @apply absolute right-3 p-1 rounded-full;
  @apply text-gray-400 hover:text-gray-600 dark:hover:text-gray-300;
}

.view-tabs {
  @apply flex gap-2 p-1 rounded-xl;
  @apply bg-gray-100 dark:bg-gray-800;
}

.view-tab {
  @apply flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg;
  @apply font-medium text-sm;
  @apply text-gray-600 dark:text-gray-400;
  @apply transition-all;
}

.view-tab.active {
  @apply bg-white dark:bg-surface-dark text-gray-900 dark:text-white shadow-sm;
}

.filter-tabs {
  @apply flex gap-2 overflow-x-auto pb-1;
  @apply -mx-4 px-4;
  scrollbar-width: none;
}

.filter-tabs::-webkit-scrollbar {
  display: none;
}

.filter-tab {
  @apply flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap;
  @apply bg-gray-100 dark:bg-gray-800;
  @apply text-gray-600 dark:text-gray-400;
  @apply transition-all active:scale-95;
}

.filter-tab.active {
  @apply bg-primary text-white;
}

.count-badge {
  @apply ml-1.5 px-1.5 py-0.5 text-xs rounded-full;
  @apply bg-white/20;
}

.category-section {
  @apply space-y-3;
}

.category-header {
  @apply text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide;
}

.food-grid {
  @apply grid gap-3;
  @apply grid-cols-1 sm:grid-cols-2;
}

.empty-state {
  @apply py-12 px-6 rounded-xl;
  @apply bg-surface-light dark:bg-surface-dark;
  @apply border border-gray-200 dark:border-gray-700;
}

.loading-spinner {
  @apply w-8 h-8 rounded-full animate-spin;
  border-width: 3px;
  border-color: theme('colors.gray.200');
  border-top-color: theme('colors.primary.DEFAULT');
}

.dark .loading-spinner {
  border-color: theme('colors.gray.700');
  border-top-color: theme('colors.primary.DEFAULT');
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

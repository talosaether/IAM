<script setup lang="ts">
import { computed } from 'vue'
import type { Food } from '../../types'

const props = defineProps<{
  food: Food
}>()

const categoryColors: Record<string, string> = {
  fruits: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  vegetables: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  protein: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  carbs: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  dairy: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  fats: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
}

const categoryClass = computed(() => {
  return categoryColors[props.food.category || 'other'] || categoryColors.other
})

const macros = computed(() => [
  { label: 'Protein', value: props.food.protein, unit: 'g', color: 'text-blue-500' },
  { label: 'Carbs', value: props.food.carbs, unit: 'g', color: 'text-yellow-500' },
  { label: 'Fat', value: props.food.fat, unit: 'g', color: 'text-red-500' },
  { label: 'Fiber', value: props.food.fiber, unit: 'g', color: 'text-green-500' }
].filter(m => m.value !== null && m.value !== undefined))
</script>

<template>
  <div class="food-card">
    <div class="flex items-start justify-between mb-2">
      <h3 class="font-semibold text-gray-900 dark:text-white">
        {{ food.name }}
      </h3>
      <span class="category-badge" :class="categoryClass">
        {{ food.category }}
      </span>
    </div>

    <!-- Serving Size -->
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
      {{ food.servingSize }}
    </p>

    <!-- Calories -->
    <div class="calories-display mb-3">
      <span class="text-2xl font-bold text-primary">{{ food.calories }}</span>
      <span class="text-sm text-gray-500 dark:text-gray-400 ml-1">kcal</span>
    </div>

    <!-- Macros -->
    <div class="macro-grid">
      <div
        v-for="macro in macros"
        :key="macro.label"
        class="macro-item"
      >
        <span class="macro-value" :class="macro.color">
          {{ macro.value }}{{ macro.unit }}
        </span>
        <span class="macro-label">{{ macro.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.food-card {
  @apply p-4 rounded-xl;
  @apply bg-surface-light dark:bg-surface-dark;
  @apply border border-gray-200 dark:border-gray-700;
}

.category-badge {
  @apply px-2 py-0.5 text-xs font-medium rounded-full capitalize;
}

.calories-display {
  @apply flex items-baseline;
}

.macro-grid {
  @apply grid grid-cols-4 gap-2;
}

.macro-item {
  @apply text-center;
}

.macro-value {
  @apply block text-sm font-semibold;
}

.macro-label {
  @apply block text-xs text-gray-500 dark:text-gray-400;
}
</style>

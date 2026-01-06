<script setup lang="ts">
import { computed, ref } from 'vue'
import { Heart, Clock, ChevronDown, ChevronUp } from 'lucide-vue-next'
import type { MealWithFavorite } from '../../database/repositories/meals'
import { useHaptics } from '@/composables/useHaptics'

const props = defineProps<{
  meal: MealWithFavorite
}>()

const emit = defineEmits<{
  toggleFavorite: [mealId: number]
}>()

const { lightImpact, mediumImpact } = useHaptics()

const isExpanded = ref(false)

const mealTypeColors: Record<string, string> = {
  breakfast: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  lunch: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  dinner: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  snack: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
}

const mealTypeClass = computed(() => {
  return mealTypeColors[props.meal.mealType || 'snack'] || mealTypeColors.snack
})

const ingredients = computed(() => {
  if (!props.meal.description) return []
  return props.meal.description.split(',').map(i => i.trim())
})

async function toggleExpand() {
  await lightImpact()
  isExpanded.value = !isExpanded.value
}

async function handleFavorite(e: Event) {
  e.stopPropagation()
  await mediumImpact()
  emit('toggleFavorite', props.meal.id)
}
</script>

<template>
  <div
    class="meal-card"
    :class="{ expanded: isExpanded }"
    @click="toggleExpand"
  >
    <div class="flex items-start gap-3">
      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <h3 class="font-semibold text-gray-900 dark:text-white truncate">
            {{ meal.name }}
          </h3>
          <span class="meal-type-badge" :class="mealTypeClass">
            {{ meal.mealType }}
          </span>
        </div>

        <!-- Prep Time -->
        <div class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <Clock class="w-4 h-4" />
          <span>{{ meal.prepTime }} min</span>
        </div>
      </div>

      <!-- Favorite Button -->
      <button
        class="favorite-btn"
        :class="{ active: meal.isFavorite }"
        @click="handleFavorite"
      >
        <Heart
          class="w-5 h-5"
          :fill="meal.isFavorite ? 'currentColor' : 'none'"
        />
      </button>

      <!-- Expand Indicator -->
      <button class="expand-btn">
        <ChevronDown
          v-if="!isExpanded"
          class="w-5 h-5 text-gray-400"
        />
        <ChevronUp v-else class="w-5 h-5 text-gray-400" />
      </button>
    </div>

    <!-- Expanded Content -->
    <Transition name="expand">
      <div v-if="isExpanded" class="ingredients-section">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ingredients:
        </h4>
        <div class="ingredient-list">
          <span
            v-for="(ingredient, idx) in ingredients"
            :key="idx"
            class="ingredient-chip"
          >
            {{ ingredient }}
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.meal-card {
  @apply p-4 rounded-xl cursor-pointer;
  @apply bg-surface-light dark:bg-surface-dark;
  @apply border border-gray-200 dark:border-gray-700;
  @apply transition-all;
}

.meal-card:hover {
  @apply border-gray-300 dark:border-gray-600;
}

.meal-card.expanded {
  @apply border-primary/30;
}

.meal-type-badge {
  @apply px-2 py-0.5 text-xs font-medium rounded-full capitalize flex-shrink-0;
}

.favorite-btn {
  @apply p-2 -m-2 rounded-lg transition-colors;
  @apply text-gray-400 hover:text-red-500;
}

.favorite-btn.active {
  @apply text-red-500;
}

.expand-btn {
  @apply p-1 -mr-1;
}

.ingredients-section {
  @apply mt-4 pt-4 border-t border-gray-200 dark:border-gray-700;
}

.ingredient-list {
  @apply flex flex-wrap gap-2;
}

.ingredient-chip {
  @apply px-3 py-1 text-sm rounded-full;
  @apply bg-gray-100 dark:bg-gray-800;
  @apply text-gray-700 dark:text-gray-300;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
  padding-top: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 200px;
}
</style>

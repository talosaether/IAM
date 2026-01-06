<script setup lang="ts">
import { computed } from 'vue'
import { Check, Dumbbell, Zap, Target, Coffee, MessageCircle } from 'lucide-vue-next'
import type { DayPlanData, ExerciseData } from '../../database/seeds/workouts'
import { useHaptics } from '@/composables/useHaptics'

const props = defineProps<{
  workout: DayPlanData
  isCompleted: boolean
  dayName: string
  date: string
}>()

const emit = defineEmits<{
  toggleComplete: []
}>()

const { successNotification, lightImpact } = useHaptics()

const blockTypeIcons: Record<string, any> = {
  strength: Dumbbell,
  cardio: Zap,
  skill: Target
}

const blockTypeColors: Record<string, string> = {
  strength: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
  cardio: 'text-red-500 bg-red-100 dark:bg-red-900/30',
  skill: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30'
}

const isRestDay = computed(() => {
  const focus = props.workout.focusArea.toLowerCase()
  return focus.includes('rest') || focus.includes('recovery')
})

function formatExercise(exercise: ExerciseData): string {
  const parts = []

  if (exercise.sets) {
    if (exercise.reps) {
      parts.push(`${exercise.sets} × ${exercise.reps}`)
    } else if (exercise.duration) {
      parts.push(`${exercise.sets} × ${exercise.duration}`)
    } else {
      parts.push(`${exercise.sets} sets`)
    }
  } else if (exercise.reps) {
    parts.push(exercise.reps)
  } else if (exercise.duration) {
    parts.push(exercise.duration)
  }

  return parts.join(' ')
}
</script>

<template>
  <div class="workout-detail">
    <!-- Header -->
    <div class="header">
      <div>
        <p class="day-label">{{ dayName }}</p>
        <h2 class="workout-name">{{ workout.name }}</h2>
        <p class="focus-area">{{ workout.focusArea }}</p>
      </div>
      <button
        class="complete-btn"
        :class="{ completed: isCompleted }"
        @click="async () => { isCompleted ? await lightImpact() : await successNotification(); emit('toggleComplete') }"
      >
        <Check class="w-6 h-6" />
      </button>
    </div>

    <!-- Coach Tip -->
    <div class="coach-tip">
      <MessageCircle class="w-5 h-5 text-primary flex-shrink-0" />
      <p>{{ workout.coachTip }}</p>
    </div>

    <!-- Rest Day -->
    <div v-if="isRestDay" class="rest-message">
      <Coffee class="w-12 h-12 text-gray-400 mb-3" />
      <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
        Recovery Day
      </h3>
      <p class="text-gray-500 dark:text-gray-400 text-center">
        Take it easy today. Rest is when your body gets stronger.
      </p>
    </div>

    <!-- Workout Blocks -->
    <div v-else class="blocks">
      <div
        v-for="(block, idx) in workout.blocks"
        :key="idx"
        class="block"
      >
        <div class="block-header">
          <div
            class="block-icon"
            :class="blockTypeColors[block.type]"
          >
            <component :is="blockTypeIcons[block.type] || Target" class="w-4 h-4" />
          </div>
          <h3 class="block-name">{{ block.name }}</h3>
          <span class="block-type">{{ block.type }}</span>
        </div>

        <div class="exercises">
          <div
            v-for="(exercise, exIdx) in block.exercises"
            :key="exIdx"
            class="exercise"
          >
            <span class="exercise-name">{{ exercise.name }}</span>
            <span class="exercise-details">{{ formatExercise(exercise) }}</span>
            <p v-if="exercise.notes" class="exercise-notes">{{ exercise.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.workout-detail {
  @apply space-y-4;
}

.header {
  @apply flex items-start justify-between gap-4 p-4 rounded-xl;
  @apply bg-surface-light dark:bg-surface-dark;
  @apply border border-gray-200 dark:border-gray-700;
}

.day-label {
  @apply text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide;
}

.workout-name {
  @apply text-xl font-bold text-gray-900 dark:text-white;
}

.focus-area {
  @apply text-sm text-primary;
}

.complete-btn {
  @apply w-12 h-12 rounded-full flex items-center justify-center;
  @apply border-2 border-gray-300 dark:border-gray-600;
  @apply text-gray-400 transition-all;
  @apply hover:border-primary hover:text-primary;
  @apply active:scale-95;
}

.complete-btn.completed {
  @apply bg-primary border-primary text-white;
}

.coach-tip {
  @apply flex items-start gap-3 p-4 rounded-xl;
  @apply bg-primary/5 border border-primary/20;
}

.coach-tip p {
  @apply text-sm text-gray-700 dark:text-gray-300 italic;
}

.rest-message {
  @apply flex flex-col items-center py-12 px-6 rounded-xl;
  @apply bg-surface-light dark:bg-surface-dark;
  @apply border border-gray-200 dark:border-gray-700;
}

.blocks {
  @apply space-y-4;
}

.block {
  @apply p-4 rounded-xl;
  @apply bg-surface-light dark:bg-surface-dark;
  @apply border border-gray-200 dark:border-gray-700;
}

.block-header {
  @apply flex items-center gap-3 mb-4;
}

.block-icon {
  @apply w-8 h-8 rounded-lg flex items-center justify-center;
}

.block-name {
  @apply flex-1 font-semibold text-gray-900 dark:text-white;
}

.block-type {
  @apply text-xs font-medium uppercase tracking-wide;
  @apply text-gray-500 dark:text-gray-400;
}

.exercises {
  @apply space-y-3;
}

.exercise {
  @apply flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2;
  @apply border-b border-gray-100 dark:border-gray-800 last:border-0;
}

.exercise-name {
  @apply font-medium text-gray-800 dark:text-gray-200;
}

.exercise-details {
  @apply text-sm text-primary font-medium;
}

.exercise-notes {
  @apply w-full text-xs text-gray-500 dark:text-gray-400;
}
</style>

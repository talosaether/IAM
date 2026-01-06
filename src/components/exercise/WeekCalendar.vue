<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import type { DayPlanData } from '../../database/seeds/workouts'

interface WeekDayData {
  dayOfWeek: number
  dayName: string
  date: string
  workout: DayPlanData | null
  isCompleted: boolean
  isToday: boolean
}

defineProps<{
  days: WeekDayData[]
  selectedDay: WeekDayData | null
}>()

const emit = defineEmits<{
  selectDay: [day: WeekDayData]
}>()

const dayAbbreviations = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function getDayNumber(date: string): number {
  return new Date(date).getDate()
}

function isRestDay(day: WeekDayData): boolean {
  if (!day.workout) return true
  const focus = day.workout.focusArea.toLowerCase()
  return focus.includes('rest') || focus.includes('recovery')
}
</script>

<template>
  <div class="week-calendar">
    <div
      v-for="day in days"
      :key="day.date"
      class="day-cell"
      :class="{
        selected: selectedDay?.date === day.date,
        today: day.isToday,
        completed: day.isCompleted,
        rest: isRestDay(day)
      }"
      @click="emit('selectDay', day)"
    >
      <span class="day-name">{{ dayAbbreviations[day.dayOfWeek] }}</span>
      <div class="day-indicator">
        <Check v-if="day.isCompleted" class="w-4 h-4" />
        <span v-else class="day-number">{{ getDayNumber(day.date) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.week-calendar {
  @apply flex justify-between gap-1 p-2;
  @apply bg-surface-light dark:bg-surface-dark;
  @apply border border-gray-200 dark:border-gray-700;
  @apply rounded-xl;
}

.day-cell {
  @apply flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg;
  @apply cursor-pointer transition-all;
}

.day-cell:hover {
  @apply bg-gray-100 dark:bg-gray-800;
}

.day-cell.selected {
  @apply bg-primary/10;
}

.day-cell.today .day-indicator {
  @apply ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-surface-dark;
}

.day-name {
  @apply text-xs font-medium text-gray-500 dark:text-gray-400;
}

.day-indicator {
  @apply w-8 h-8 rounded-full flex items-center justify-center;
  @apply bg-gray-100 dark:bg-gray-800;
  @apply text-gray-700 dark:text-gray-300;
  @apply text-sm font-medium;
  @apply transition-all;
}

.day-cell.completed .day-indicator {
  @apply bg-primary text-white;
}

.day-cell.rest .day-indicator {
  @apply bg-gray-50 dark:bg-gray-900 text-gray-400;
}

.day-cell.selected .day-indicator {
  @apply ring-2 ring-primary;
}
</style>

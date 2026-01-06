<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useExerciseStore } from '@/stores/exercise'
import { Flame, Award, Dumbbell } from 'lucide-vue-next'
import WeekCalendar from '@/components/exercise/WeekCalendar.vue'
import WorkoutDetail from '@/components/exercise/WorkoutDetail.vue'
import PullToRefresh from '@/components/common/PullToRefresh.vue'

const settingsStore = useSettingsStore()
const exerciseStore = useExerciseStore()
const pullRefreshRef = ref<InstanceType<typeof PullToRefresh> | null>(null)
const isRefreshing = ref(false)

const weekData = computed(() => exerciseStore.weekData)
const selectedDay = computed(() => exerciseStore.selectedDay)
const currentProgram = computed(() => exerciseStore.currentProgram)
const weeklyStreak = computed(() => exerciseStore.weeklyStreak)
const weekCompletedCount = computed(() => exerciseStore.weekCompletedCount)
const weekTotalWorkouts = computed(() => exerciseStore.weekTotalWorkouts)
const isLoading = computed(() => exerciseStore.isLoading)

onMounted(() => {
  exerciseStore.loadProgram()
})

function handleSelectDay(day: any) {
  exerciseStore.selectDay(day)
}

async function handleToggleComplete() {
  if (selectedDay.value) {
    await exerciseStore.toggleDayCompletion(
      selectedDay.value.dayOfWeek,
      selectedDay.value.date
    )
  }
}

async function handleRefresh() {
  isRefreshing.value = true
  await exerciseStore.loadProgram()
  isRefreshing.value = false
  pullRefreshRef.value?.finishRefresh()
}
</script>

<template>
  <div class="exercise-view pt-safe">
    <PullToRefresh ref="pullRefreshRef" :loading="isRefreshing" @refresh="handleRefresh">
    <div class="px-4 py-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Exercise</h1>
        <div class="flex items-center gap-2">
          <Flame class="w-5 h-5 text-orange-500" />
          <span class="font-semibold text-gray-700 dark:text-gray-300">
            {{ weeklyStreak }} week{{ weeklyStreak !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>

      <!-- Week Calendar -->
      <WeekCalendar
        :days="weekData"
        :selected-day="selectedDay"
        class="mb-4"
        @select-day="handleSelectDay"
      />

      <!-- Stats Row -->
      <div class="stats-row mb-4">
        <div class="stat-card">
          <Award class="w-5 h-5 text-primary" />
          <div>
            <p class="stat-value">{{ weekCompletedCount }}/{{ weekTotalWorkouts }}</p>
            <p class="stat-label">This Week</p>
          </div>
        </div>
        <div class="stat-card">
          <Dumbbell class="w-5 h-5 text-primary" />
          <div>
            <p class="stat-value capitalize">{{ settingsStore.sportFocus }}</p>
            <p class="stat-label capitalize">{{ settingsStore.ageGroup }} Program</p>
          </div>
        </div>
      </div>

      <!-- Selected Day Workout -->
      <div v-if="selectedDay?.workout">
        <WorkoutDetail
          :workout="selectedDay.workout"
          :is-completed="selectedDay.isCompleted"
          :day-name="selectedDay.dayName"
          :date="selectedDay.date"
          @toggle-complete="handleToggleComplete"
        />
      </div>

      <!-- No Program Selected -->
      <div v-else-if="!currentProgram && !isLoading" class="empty-state">
        <Dumbbell class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 dark:text-gray-400 text-center">
          No workout program found.<br />
          Check your settings to select a sport focus.
        </p>
      </div>

      <!-- Loading -->
      <div v-else-if="isLoading" class="flex justify-center py-12">
        <div class="loading-spinner" />
      </div>
    </div>
    </PullToRefresh>
  </div>
</template>

<style scoped>
.exercise-view {
  @apply min-h-full pb-20;
}

.stats-row {
  @apply grid grid-cols-2 gap-3;
}

.stat-card {
  @apply flex items-center gap-3 p-4 rounded-xl;
  @apply bg-surface-light dark:bg-surface-dark;
  @apply border border-gray-200 dark:border-gray-700;
}

.stat-value {
  @apply font-semibold text-gray-900 dark:text-white;
}

.stat-label {
  @apply text-xs text-gray-500 dark:text-gray-400;
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
</style>

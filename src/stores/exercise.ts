import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { exerciseRepository } from '../database/repositories/exercise'
import { useSettingsStore } from './settings'
import type { ProgramData, DayPlanData } from '../database/seeds/workouts'

interface WeekDayData {
  dayOfWeek: number
  dayName: string
  date: string
  workout: DayPlanData | null
  isCompleted: boolean
  isToday: boolean
}

export const useExerciseStore = defineStore('exercise', () => {
  // State
  const currentProgram = ref<ProgramData | null>(null)
  const todaysWorkout = ref<DayPlanData | null>(null)
  const weekData = ref<WeekDayData[]>([])
  const weeklyStreak = ref(0)
  const isLoading = ref(false)
  const selectedDay = ref<WeekDayData | null>(null)

  // Getters
  const hasWorkoutToday = computed(() => {
    return todaysWorkout.value !== null &&
           todaysWorkout.value.focusArea !== 'Rest & Mobility' &&
           todaysWorkout.value.focusArea !== 'Recovery'
  })

  const todayCompleted = computed(() => {
    const today = weekData.value.find(d => d.isToday)
    return today?.isCompleted ?? false
  })

  const weekCompletedCount = computed(() => {
    return weekData.value.filter(d => d.isCompleted).length
  })

  const weekTotalWorkouts = computed(() => {
    return weekData.value.filter(d =>
      d.workout &&
      d.workout.focusArea !== 'Rest & Mobility' &&
      d.workout.focusArea !== 'Recovery'
    ).length
  })

  // Actions
  async function loadProgram() {
    isLoading.value = true
    try {
      const settingsStore = useSettingsStore()
      const sport = settingsStore.sportFocus
      const age = settingsStore.ageGroup

      currentProgram.value = exerciseRepository.getProgramForSettings(sport, age) || null
      todaysWorkout.value = exerciseRepository.getTodaysWorkout(sport, age)

      const week = await exerciseRepository.getWeekData(sport, age)
      weekData.value = week.days

      weeklyStreak.value = await exerciseRepository.getWeeklyStreak()

      // Set selected day to today by default
      selectedDay.value = weekData.value.find(d => d.isToday) || null
    } finally {
      isLoading.value = false
    }
  }

  async function toggleDayCompletion(dayOfWeek: number, date: string) {
    const isNowCompleted = await exerciseRepository.toggleCompletion(dayOfWeek, date)

    // Update local state
    const day = weekData.value.find(d => d.dayOfWeek === dayOfWeek && d.date === date)
    if (day) {
      day.isCompleted = isNowCompleted
    }

    // Update streak
    weeklyStreak.value = await exerciseRepository.getWeeklyStreak()

    return isNowCompleted
  }

  function selectDay(day: WeekDayData) {
    selectedDay.value = day
  }

  function selectToday() {
    selectedDay.value = weekData.value.find(d => d.isToday) || null
  }

  return {
    // State
    currentProgram,
    todaysWorkout,
    weekData,
    weeklyStreak,
    isLoading,
    selectedDay,

    // Getters
    hasWorkoutToday,
    todayCompleted,
    weekCompletedCount,
    weekTotalWorkouts,

    // Actions
    loadProgram,
    toggleDayCompletion,
    selectDay,
    selectToday
  }
})

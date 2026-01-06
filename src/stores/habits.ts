import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { habitsRepository, type HabitWithMeta } from '../database/repositories/habits'
import type { Habit, HabitGroup } from '../types'

export const useHabitsStore = defineStore('habits', () => {
  // State
  const habits = ref<HabitWithMeta[]>([])
  const groups = ref<HabitGroup[]>([])
  const isLoading = ref(false)
  const selectedDate = ref(new Date().toISOString().split('T')[0])

  // Getters
  const habitsByGroup = computed(() => {
    const grouped: Map<number | null, HabitWithMeta[]> = new Map()
    grouped.set(null, []) // Ungrouped habits

    for (const group of groups.value) {
      grouped.set(group.id, [])
    }

    for (const habit of habits.value) {
      const groupId = habit.groupId || null
      if (!grouped.has(groupId)) {
        grouped.set(groupId, [])
      }
      grouped.get(groupId)!.push(habit)
    }

    return grouped
  })

  const todayCompletionRate = computed(() => {
    if (habits.value.length === 0) return 0
    const completed = habits.value.filter(h => h.completedToday).length
    return Math.round((completed / habits.value.length) * 100)
  })

  const completedCount = computed(() => {
    return habits.value.filter(h => h.completedToday).length
  })

  const totalCount = computed(() => {
    return habits.value.length
  })

  const longestStreak = computed(() => {
    if (habits.value.length === 0) return 0
    return Math.max(...habits.value.map(h => h.currentStreak))
  })

  // Actions
  async function loadHabits() {
    isLoading.value = true
    try {
      habits.value = await habitsRepository.getHabitsWithMeta(selectedDate.value)
      groups.value = await habitsRepository.getGroups()
    } finally {
      isLoading.value = false
    }
  }

  async function addHabit(habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = await habitsRepository.create(habit)
    await loadHabits()
    return id
  }

  async function updateHabit(id: number, updates: Partial<Habit>) {
    await habitsRepository.update(id, updates)
    await loadHabits()
  }

  async function deleteHabit(id: number) {
    await habitsRepository.delete(id)
    await loadHabits()
  }

  async function toggleCompletion(habitId: number) {
    const isNowCompleted = await habitsRepository.toggleCompletion(habitId, selectedDate.value)

    // Update local state immediately for responsive UI
    const habit = habits.value.find(h => h.id === habitId)
    if (habit) {
      habit.completedToday = isNowCompleted
      if (isNowCompleted) {
        habit.currentStreak++
      } else {
        habit.currentStreak = Math.max(0, habit.currentStreak - 1)
      }
    }

    return isNowCompleted
  }

  async function reorderHabits(habitIds: number[]) {
    await habitsRepository.reorder(habitIds)
    await loadHabits()
  }

  async function addGroup(name: string) {
    const id = await habitsRepository.createGroup(name)
    await loadHabits()
    return id
  }

  async function updateGroup(id: number, name: string) {
    await habitsRepository.updateGroup(id, name)
    await loadHabits()
  }

  async function deleteGroup(id: number) {
    await habitsRepository.deleteGroup(id)
    await loadHabits()
  }

  function setSelectedDate(date: string) {
    selectedDate.value = date
    loadHabits()
  }

  return {
    // State
    habits,
    groups,
    isLoading,
    selectedDate,

    // Getters
    habitsByGroup,
    todayCompletionRate,
    completedCount,
    totalCount,
    longestStreak,

    // Actions
    loadHabits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    reorderHabits,
    addGroup,
    updateGroup,
    deleteGroup,
    setSelectedDate
  }
})

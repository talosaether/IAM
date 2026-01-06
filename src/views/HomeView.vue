<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useHabitsStore } from '@/stores/habits'
import { Sparkles, Flame, Target, TrendingUp, ChevronRight } from 'lucide-vue-next'

const router = useRouter()
const settingsStore = useSettingsStore()
const habitsStore = useHabitsStore()

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Stay focused and never give up.", author: "Unknown" }
]

const currentQuote = ref(quotes[0])

const completedCount = computed(() => habitsStore.completedCount)
const totalCount = computed(() => habitsStore.totalCount)
const completionRate = computed(() => habitsStore.todayCompletionRate)
const longestStreak = computed(() => habitsStore.longestStreak)

const progressColor = computed(() => {
  if (completionRate.value === 100) return 'text-green-500'
  if (completionRate.value >= 50) return 'text-primary'
  return 'text-gray-500'
})

onMounted(() => {
  // Get quote of the day based on date
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  )
  currentQuote.value = quotes[dayOfYear % quotes.length]

  // Load habits data
  habitsStore.loadHabits()
})

function goToHabits() {
  router.push('/habits')
}

function goToExercise() {
  router.push('/exercise')
}
</script>

<template>
  <div class="home-view pt-safe">
    <div class="px-4 py-6">
      <!-- Greeting -->
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {{ settingsStore.greeting }}
      </h1>

      <!-- Quote Card -->
      <div class="quote-card mb-6">
        <div class="flex items-start gap-3">
          <Sparkles class="text-primary flex-shrink-0 mt-1" :size="20" />
          <div>
            <p class="text-sm italic text-gray-700 dark:text-gray-300 mb-2">
              "{{ currentQuote.text }}"
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              — {{ currentQuote.author }}
            </p>
          </div>
        </div>
      </div>

      <!-- Today's Progress -->
      <div
        class="progress-card mb-4 cursor-pointer"
        @click="goToHabits"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <Target class="w-5 h-5 text-primary" />
            <span class="font-semibold text-gray-900 dark:text-white">Today's Habits</span>
          </div>
          <div class="flex items-center gap-1 text-gray-400">
            <span class="text-sm">{{ completedCount }}/{{ totalCount }}</span>
            <ChevronRight class="w-4 h-4" />
          </div>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${completionRate}%` }"
          />
        </div>
        <p v-if="totalCount === 0" class="text-sm text-gray-500 dark:text-gray-400 mt-3">
          No habits yet. Tap to add your first!
        </p>
        <p v-else-if="completionRate === 100" class="text-sm text-green-500 mt-3">
          All habits completed! Great job!
        </p>
        <p v-else class="text-sm text-gray-500 dark:text-gray-400 mt-3">
          {{ completedCount }} of {{ totalCount }} habits completed today
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="stat-card" @click="goToHabits">
          <div class="flex items-center gap-2 mb-2">
            <TrendingUp class="w-5 h-5" :class="progressColor" />
            <span class="text-sm text-gray-500 dark:text-gray-400">Completion</span>
          </div>
          <p class="text-3xl font-bold" :class="progressColor">
            {{ completionRate }}%
          </p>
        </div>
        <div class="stat-card" @click="goToHabits">
          <div class="flex items-center gap-2 mb-2">
            <Flame class="w-5 h-5 text-orange-500" />
            <span class="text-sm text-gray-500 dark:text-gray-400">Best Streak</span>
          </div>
          <p class="text-3xl font-bold text-orange-500">
            {{ longestStreak }}
            <span class="text-sm font-normal text-gray-500">days</span>
          </p>
        </div>
      </div>

      <!-- Today's Workout Preview -->
      <div
        class="section-card cursor-pointer"
        @click="goToExercise"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Today's Workout</h2>
          <ChevronRight class="w-5 h-5 text-gray-400" />
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Tap to view your workout program
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  @apply min-h-full pb-20;
}

.quote-card {
  @apply p-4 rounded-xl;
  @apply bg-surface-light dark:bg-surface-dark;
  @apply border border-gray-200 dark:border-gray-700;
}

.progress-card {
  @apply p-4 rounded-xl;
  @apply bg-surface-light dark:bg-surface-dark;
  @apply border border-gray-200 dark:border-gray-700;
  @apply transition-transform active:scale-[0.99];
}

.progress-bar {
  @apply h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden;
}

.progress-fill {
  @apply h-full rounded-full bg-primary transition-all duration-500;
}

.stat-card {
  @apply p-4 rounded-xl cursor-pointer;
  @apply bg-surface-light dark:bg-surface-dark;
  @apply border border-gray-200 dark:border-gray-700;
  @apply transition-transform active:scale-[0.98];
}

.section-card {
  @apply p-4 rounded-xl;
  @apply bg-surface-light dark:bg-surface-dark;
  @apply border border-gray-200 dark:border-gray-700;
  @apply transition-transform active:scale-[0.99];
}
</style>

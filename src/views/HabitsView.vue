<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Plus, GripVertical, Calendar } from 'lucide-vue-next'
import { useHabitsStore } from '../stores/habits'
import HabitList from '../components/habits/HabitList.vue'
import HabitForm from '../components/habits/HabitForm.vue'
import PullToRefresh from '../components/common/PullToRefresh.vue'
import type { HabitWithMeta } from '../database/repositories/habits'
import type { Habit } from '../types'

const habitsStore = useHabitsStore()
const pullRefreshRef = ref<InstanceType<typeof PullToRefresh> | null>(null)
const isRefreshing = ref(false)

const showAddModal = ref(false)
const editingHabit = ref<HabitWithMeta | null>(null)
const reorderMode = ref(false)
const showDeleteConfirm = ref(false)
const habitToDelete = ref<number | null>(null)

const isLoading = computed(() => habitsStore.isLoading)
const habits = computed(() => habitsStore.habits)
const groups = computed(() => habitsStore.groups)
const todayCompletionRate = computed(() => habitsStore.todayCompletionRate)
const completedCount = computed(() => habitsStore.completedCount)
const totalCount = computed(() => habitsStore.totalCount)

onMounted(() => {
  habitsStore.loadHabits()
})

function handleAddClick() {
  editingHabit.value = null
  showAddModal.value = true
}

function handleEdit(habit: HabitWithMeta) {
  editingHabit.value = habit
  showAddModal.value = true
}

function handleDeleteClick(habitId: number) {
  habitToDelete.value = habitId
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  if (habitToDelete.value) {
    await habitsStore.deleteHabit(habitToDelete.value)
  }
  showDeleteConfirm.value = false
  habitToDelete.value = null
}

async function handleSave(habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) {
  if (editingHabit.value) {
    await habitsStore.updateHabit(editingHabit.value.id, habitData)
  } else {
    await habitsStore.addHabit(habitData)
  }
}

async function handleToggle(habitId: number) {
  await habitsStore.toggleCompletion(habitId)
}

async function handleReorder(habitIds: number[]) {
  await habitsStore.reorderHabits(habitIds)
}

function toggleReorderMode() {
  reorderMode.value = !reorderMode.value
}

async function handleRefresh() {
  isRefreshing.value = true
  await habitsStore.loadHabits()
  isRefreshing.value = false
  pullRefreshRef.value?.finishRefresh()
}
</script>

<template>
  <div class="habits-view pt-safe">
    <PullToRefresh ref="pullRefreshRef" :loading="isRefreshing" @refresh="handleRefresh">
    <div class="px-4 py-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Habits</h1>
        <div class="flex items-center gap-2">
          <button
            v-if="habits.length > 1"
            class="reorder-button"
            :class="{ active: reorderMode }"
            @click="toggleReorderMode"
            title="Reorder habits"
          >
            <GripVertical class="w-5 h-5" />
          </button>
          <button
            class="add-button"
            @click="handleAddClick"
          >
            <Plus class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Progress Card -->
      <div v-if="habits.length > 0" class="progress-card mb-6">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Progress</span>
          <span class="text-sm font-bold text-primary">{{ completedCount }}/{{ totalCount }}</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${todayCompletionRate}%` }"
          />
        </div>
      </div>

      <!-- Habit List -->
      <HabitList
        v-if="habits.length > 0"
        :habits="habits"
        :groups="groups"
        :reorder-enabled="reorderMode"
        @toggle="handleToggle"
        @edit="handleEdit"
        @delete="handleDeleteClick"
        @reorder="handleReorder"
      />

      <!-- Empty State -->
      <div v-else-if="!isLoading" class="empty-state">
        <Calendar class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 dark:text-gray-400 text-center">
          No habits yet.<br />
          Tap + to add your first habit!
        </p>
      </div>

      <!-- Loading State -->
      <div v-else class="flex justify-center py-12">
        <div class="loading-spinner" />
      </div>
    </div>
    </PullToRefresh>

    <!-- Add/Edit Modal -->
    <HabitForm
      :show="showAddModal"
      :habit="editingHabit"
      :groups="groups"
      @close="showAddModal = false"
      @save="handleSave"
    />

    <!-- Delete Confirmation -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showDeleteConfirm"
          class="modal-backdrop"
          @click.self="showDeleteConfirm = false"
        >
          <div class="confirm-dialog">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete Habit?
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              This will permanently delete this habit and all its completion history.
            </p>
            <div class="flex gap-3">
              <button
                class="flex-1 py-3 rounded-xl font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                @click="showDeleteConfirm = false"
              >
                Cancel
              </button>
              <button
                class="flex-1 py-3 rounded-xl font-medium bg-red-500 text-white"
                @click="confirmDelete"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.habits-view {
  @apply min-h-full pb-20;
}

.add-button {
  @apply w-11 h-11 rounded-full flex items-center justify-center;
  @apply bg-primary text-white;
  @apply active:opacity-80 active:scale-95;
  @apply transition-transform;
}

.reorder-button {
  @apply w-11 h-11 rounded-full flex items-center justify-center;
  @apply bg-gray-100 dark:bg-gray-800 text-gray-500;
  @apply active:scale-95 transition-all;
}

.reorder-button.active {
  @apply bg-primary text-white;
}

.progress-card {
  @apply p-4 rounded-xl;
  @apply bg-surface-light dark:bg-surface-dark;
  @apply border border-gray-200 dark:border-gray-700;
}

.progress-bar {
  @apply h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden;
}

.progress-fill {
  @apply h-full rounded-full bg-primary transition-all duration-300;
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

.modal-backdrop {
  @apply fixed inset-0 z-50 flex items-center justify-center;
  @apply bg-black/50 backdrop-blur-sm px-4;
}

.confirm-dialog {
  @apply w-full max-w-sm p-6 rounded-2xl;
  @apply bg-white dark:bg-surface-dark;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .confirm-dialog,
.modal-leave-active .confirm-dialog {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .confirm-dialog,
.modal-leave-to .confirm-dialog {
  transform: scale(0.95);
}
</style>

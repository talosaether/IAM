<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X } from 'lucide-vue-next'
import {
  Check,
  Circle,
  Star,
  Heart,
  Zap,
  Coffee,
  Moon,
  Sun,
  Droplets,
  Dumbbell,
  BookOpen,
  Music,
  Smile,
  Target,
  Trophy,
  Clock,
  Leaf,
  Brain,
  Flame
} from 'lucide-vue-next'
import type { Habit, HabitGroup } from '../../types'

const props = defineProps<{
  show: boolean
  habit?: Habit | null
  groups: HabitGroup[]
}>()

const emit = defineEmits<{
  close: []
  save: [habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>]
}>()

const name = ref('')
const icon = ref('check')
const frequency = ref<'daily' | 'weekly'>('daily')
const groupId = ref<number | null>(null)

const isEditing = computed(() => !!props.habit)

const iconOptions = [
  { value: 'check', icon: Check, label: 'Check' },
  { value: 'circle', icon: Circle, label: 'Circle' },
  { value: 'star', icon: Star, label: 'Star' },
  { value: 'heart', icon: Heart, label: 'Heart' },
  { value: 'zap', icon: Zap, label: 'Energy' },
  { value: 'coffee', icon: Coffee, label: 'Coffee' },
  { value: 'moon', icon: Moon, label: 'Moon' },
  { value: 'sun', icon: Sun, label: 'Sun' },
  { value: 'droplets', icon: Droplets, label: 'Water' },
  { value: 'dumbbell', icon: Dumbbell, label: 'Exercise' },
  { value: 'book-open', icon: BookOpen, label: 'Reading' },
  { value: 'music', icon: Music, label: 'Music' },
  { value: 'smile', icon: Smile, label: 'Mood' },
  { value: 'target', icon: Target, label: 'Goal' },
  { value: 'trophy', icon: Trophy, label: 'Achievement' },
  { value: 'clock', icon: Clock, label: 'Time' },
  { value: 'leaf', icon: Leaf, label: 'Nature' },
  { value: 'brain', icon: Brain, label: 'Mind' },
  { value: 'flame', icon: Flame, label: 'Fire' }
]

watch(() => props.show, (newVal) => {
  if (newVal && props.habit) {
    // Populate form with existing habit data
    name.value = props.habit.name
    icon.value = props.habit.icon || 'check'
    frequency.value = props.habit.frequency || 'daily'
    groupId.value = props.habit.groupId || null
  } else if (newVal) {
    // Reset form for new habit
    name.value = ''
    icon.value = 'check'
    frequency.value = 'daily'
    groupId.value = null
  }
})

function handleClose() {
  emit('close')
}

function handleSave() {
  if (!name.value.trim()) return

  emit('save', {
    name: name.value.trim(),
    icon: icon.value,
    frequency: frequency.value,
    groupId: groupId.value,
    sortOrder: 0,
    isActive: true
  })

  handleClose()
}

function handleBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    handleClose()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="modal-backdrop"
        @click="handleBackdropClick"
      >
        <div class="modal-content">
          <!-- Header -->
          <div class="modal-header">
            <h2 class="modal-title">
              {{ isEditing ? 'Edit Habit' : 'New Habit' }}
            </h2>
            <button class="close-btn" @click="handleClose">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <!-- Name Input -->
            <div class="form-group">
              <label class="form-label">Name</label>
              <input
                v-model="name"
                type="text"
                class="form-input"
                placeholder="Enter habit name..."
                autofocus
                @keyup.enter="handleSave"
              />
            </div>

            <!-- Icon Picker -->
            <div class="form-group">
              <label class="form-label">Icon</label>
              <div class="icon-grid">
                <button
                  v-for="opt in iconOptions"
                  :key="opt.value"
                  class="icon-option"
                  :class="{ selected: icon === opt.value }"
                  :title="opt.label"
                  @click="icon = opt.value"
                >
                  <component :is="opt.icon" class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Frequency -->
            <div class="form-group">
              <label class="form-label">Frequency</label>
              <div class="frequency-options">
                <button
                  class="frequency-btn"
                  :class="{ selected: frequency === 'daily' }"
                  @click="frequency = 'daily'"
                >
                  Daily
                </button>
                <button
                  class="frequency-btn"
                  :class="{ selected: frequency === 'weekly' }"
                  @click="frequency = 'weekly'"
                >
                  Weekly
                </button>
              </div>
            </div>

            <!-- Group (optional) -->
            <div v-if="groups.length > 0" class="form-group">
              <label class="form-label">Group (optional)</label>
              <select v-model="groupId" class="form-input">
                <option :value="null">No group</option>
                <option
                  v-for="group in groups"
                  :key="group.id"
                  :value="group.id"
                >
                  {{ group.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button class="btn-secondary" @click="handleClose">
              Cancel
            </button>
            <button
              class="btn-primary"
              :disabled="!name.trim()"
              @click="handleSave"
            >
              {{ isEditing ? 'Save Changes' : 'Add Habit' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  @apply fixed inset-0 z-50 flex items-end sm:items-center justify-center;
  @apply bg-black/50 backdrop-blur-sm;
}

.modal-content {
  @apply w-full sm:max-w-md bg-white dark:bg-surface-dark;
  @apply rounded-t-2xl sm:rounded-2xl shadow-xl;
  @apply max-h-[90vh] overflow-hidden flex flex-col;
}

.modal-header {
  @apply flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700;
}

.modal-title {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.close-btn {
  @apply p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700;
}

.modal-body {
  @apply p-4 space-y-4 overflow-y-auto;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.form-input {
  @apply w-full px-4 py-3 rounded-xl;
  @apply bg-gray-100 dark:bg-gray-800;
  @apply border border-transparent focus:border-primary;
  @apply text-gray-900 dark:text-white;
  @apply outline-none transition-colors;
}

.icon-grid {
  @apply grid grid-cols-6 gap-2;
}

.icon-option {
  @apply w-10 h-10 rounded-lg flex items-center justify-center;
  @apply bg-gray-100 dark:bg-gray-800;
  @apply text-gray-500 dark:text-gray-400;
  @apply transition-all hover:bg-gray-200 dark:hover:bg-gray-700;
}

.icon-option.selected {
  @apply bg-primary text-white;
}

.frequency-options {
  @apply flex gap-2;
}

.frequency-btn {
  @apply flex-1 py-3 rounded-xl font-medium;
  @apply bg-gray-100 dark:bg-gray-800;
  @apply text-gray-600 dark:text-gray-400;
  @apply transition-all;
}

.frequency-btn.selected {
  @apply bg-primary text-white;
}

.modal-footer {
  @apply flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700;
}

.btn-secondary {
  @apply flex-1 py-3 rounded-xl font-medium;
  @apply bg-gray-100 dark:bg-gray-800;
  @apply text-gray-600 dark:text-gray-400;
  @apply hover:bg-gray-200 dark:hover:bg-gray-700;
  @apply transition-colors;
}

.btn-primary {
  @apply flex-1 py-3 rounded-xl font-medium;
  @apply bg-primary text-white;
  @apply hover:bg-primary-dark;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
  @apply transition-colors;
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: translateY(100%);
}

@media (min-width: 640px) {
  .modal-enter-from .modal-content,
  .modal-leave-to .modal-content {
    transform: translateY(20px) scale(0.95);
  }
}
</style>

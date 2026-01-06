<script setup lang="ts">
import { computed } from 'vue'
import {
  Check,
  Flame,
  GripVertical,
  Pencil,
  Trash2,
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
  Brain
} from 'lucide-vue-next'
import type { HabitWithMeta } from '../../database/repositories/habits'
import { useHaptics } from '@/composables/useHaptics'

const props = defineProps<{
  habit: HabitWithMeta
  dragHandle?: boolean
}>()

const emit = defineEmits<{
  toggle: [habitId: number]
  edit: [habit: HabitWithMeta]
  delete: [habitId: number]
}>()

const { successNotification, lightImpact, warningNotification } = useHaptics()

const iconMap: Record<string, any> = {
  check: Check,
  circle: Circle,
  star: Star,
  heart: Heart,
  zap: Zap,
  coffee: Coffee,
  moon: Moon,
  sun: Sun,
  droplets: Droplets,
  dumbbell: Dumbbell,
  'book-open': BookOpen,
  music: Music,
  smile: Smile,
  target: Target,
  trophy: Trophy,
  clock: Clock,
  leaf: Leaf,
  brain: Brain,
  flame: Flame
}

const IconComponent = computed(() => iconMap[props.habit.icon || 'check'] || Check)

async function handleToggle() {
  if (props.habit.completedToday) {
    await lightImpact()
  } else {
    await successNotification()
  }
  emit('toggle', props.habit.id)
}

async function handleEdit() {
  await lightImpact()
  emit('edit', props.habit)
}

async function handleDelete() {
  await warningNotification()
  emit('delete', props.habit.id)
}
</script>

<template>
  <div
    class="habit-card group"
    :class="{ completed: habit.completedToday }"
  >
    <!-- Drag Handle -->
    <div v-if="dragHandle" class="drag-handle">
      <GripVertical class="w-5 h-5 text-gray-400" />
    </div>

    <!-- Completion Button -->
    <button
      class="completion-btn"
      :class="{ completed: habit.completedToday }"
      @click="handleToggle"
    >
      <component
        :is="IconComponent"
        class="w-5 h-5"
      />
    </button>

    <!-- Habit Info -->
    <div class="flex-1 min-w-0">
      <h3 class="habit-name" :class="{ completed: habit.completedToday }">
        {{ habit.name }}
      </h3>
      <div v-if="habit.currentStreak > 0" class="streak">
        <Flame class="w-3.5 h-3.5 text-orange-500" />
        <span>{{ habit.currentStreak }} day{{ habit.currentStreak !== 1 ? 's' : '' }}</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="actions">
      <button class="action-btn" @click="handleEdit" title="Edit">
        <Pencil class="w-4 h-4" />
      </button>
      <button class="action-btn delete" @click="handleDelete" title="Delete">
        <Trash2 class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.habit-card {
  @apply flex items-center gap-3 p-4 rounded-xl transition-all duration-200;
  @apply bg-surface-light dark:bg-surface-dark;
  @apply border border-gray-200 dark:border-gray-700;
}

.habit-card.completed {
  @apply bg-primary/10 border-primary/30;
}

.drag-handle {
  @apply cursor-grab active:cursor-grabbing touch-none;
  @apply opacity-0 group-hover:opacity-100 transition-opacity;
}

.completion-btn {
  @apply w-10 h-10 rounded-full flex items-center justify-center transition-all;
  @apply border-2 border-gray-300 dark:border-gray-600;
  @apply text-gray-400 dark:text-gray-500;
  @apply hover:border-primary hover:text-primary;
  @apply active:scale-95;
}

.completion-btn.completed {
  @apply bg-primary border-primary text-white;
}

.habit-name {
  @apply font-medium text-gray-900 dark:text-white truncate;
}

.habit-name.completed {
  @apply text-primary;
}

.streak {
  @apply flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5;
}

.actions {
  @apply flex items-center gap-1;
  @apply opacity-0 group-hover:opacity-100 transition-opacity;
}

.action-btn {
  @apply p-2 rounded-lg transition-colors;
  @apply text-gray-400 hover:text-gray-600 dark:hover:text-gray-300;
  @apply hover:bg-gray-100 dark:hover:bg-gray-700;
}

.action-btn.delete {
  @apply hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20;
}

/* Mobile: always show actions */
@media (max-width: 640px) {
  .actions {
    @apply opacity-100;
  }
  .drag-handle {
    @apply opacity-100;
  }
}
</style>

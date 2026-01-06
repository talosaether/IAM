<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRight, Trash2, Pencil, Copy } from 'lucide-vue-next'
import type { ChecklistWithItems } from '../../database/repositories/checklists'

const props = defineProps<{
  checklist: ChecklistWithItems
}>()

const emit = defineEmits<{
  click: [checklist: ChecklistWithItems]
  edit: [checklist: ChecklistWithItems]
  delete: [checklistId: number]
  duplicate: [checklist: ChecklistWithItems]
}>()

const progressPercent = computed(() => {
  if (props.checklist.totalCount === 0) return 0
  return Math.round((props.checklist.completedCount / props.checklist.totalCount) * 100)
})

const isComplete = computed(() => {
  return props.checklist.totalCount > 0 && props.checklist.completedCount === props.checklist.totalCount
})

function handleClick() {
  emit('click', props.checklist)
}

function handleEdit(e: Event) {
  e.stopPropagation()
  emit('edit', props.checklist)
}

function handleDelete(e: Event) {
  e.stopPropagation()
  emit('delete', props.checklist.id)
}

function handleDuplicate(e: Event) {
  e.stopPropagation()
  emit('duplicate', props.checklist)
}
</script>

<template>
  <div
    class="checklist-card group"
    :class="{ complete: isComplete }"
    @click="handleClick"
  >
    <div class="flex-1 min-w-0">
      <!-- Name and Template Badge -->
      <div class="flex items-center gap-2 mb-2">
        <h3 class="font-semibold text-gray-900 dark:text-white truncate">
          {{ checklist.name }}
        </h3>
        <span
          v-if="checklist.isTemplate"
          class="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary"
        >
          Template
        </span>
      </div>

      <!-- Progress -->
      <div class="flex items-center gap-3">
        <div class="flex-1 progress-bar">
          <div
            class="progress-fill"
            :class="{ complete: isComplete }"
            :style="{ width: `${progressPercent}%` }"
          />
        </div>
        <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {{ checklist.completedCount }}/{{ checklist.totalCount }}
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-1 ml-3">
      <button
        class="action-btn"
        @click="handleEdit"
        title="Rename"
      >
        <Pencil class="w-4 h-4" />
      </button>
      <button
        v-if="checklist.isTemplate"
        class="action-btn"
        @click="handleDuplicate"
        title="Create from template"
      >
        <Copy class="w-4 h-4" />
      </button>
      <button
        class="action-btn delete"
        @click="handleDelete"
        title="Delete"
      >
        <Trash2 class="w-4 h-4" />
      </button>
      <ChevronRight class="w-5 h-5 text-gray-400 ml-1" />
    </div>
  </div>
</template>

<style scoped>
.checklist-card {
  @apply flex items-center p-4 rounded-xl cursor-pointer;
  @apply bg-surface-light dark:bg-surface-dark;
  @apply border border-gray-200 dark:border-gray-700;
  @apply transition-all active:scale-[0.99];
}

.checklist-card.complete {
  @apply bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800;
}

.progress-bar {
  @apply h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden;
}

.progress-fill {
  @apply h-full rounded-full bg-primary transition-all duration-300;
}

.progress-fill.complete {
  @apply bg-green-500;
}

.action-btn {
  @apply p-2 rounded-lg transition-colors;
  @apply text-gray-400 hover:text-gray-600 dark:hover:text-gray-300;
  @apply hover:bg-gray-100 dark:hover:bg-gray-700;
  @apply opacity-0 group-hover:opacity-100;
}

.action-btn.delete {
  @apply hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20;
}

@media (max-width: 640px) {
  .action-btn {
    @apply opacity-100;
  }
}
</style>

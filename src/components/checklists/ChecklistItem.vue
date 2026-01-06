<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { Check, GripVertical, Trash2 } from 'lucide-vue-next'
import type { ChecklistItem } from '../../types'
import { useHaptics } from '@/composables/useHaptics'

const props = defineProps<{
  item: ChecklistItem
  dragHandle?: boolean
}>()

const emit = defineEmits<{
  toggle: [itemId: number]
  update: [itemId: number, text: string]
  delete: [itemId: number]
}>()

const { lightImpact, successNotification } = useHaptics()

const isEditing = ref(false)
const editText = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

watch(isEditing, (val) => {
  if (val) {
    editText.value = props.item.text
    nextTick(() => {
      inputRef.value?.focus()
      inputRef.value?.select()
    })
  }
})

async function handleToggle() {
  if (props.item.isCompleted) {
    await lightImpact()
  } else {
    await successNotification()
  }
  emit('toggle', props.item.id)
}

function startEdit() {
  isEditing.value = true
}

function saveEdit() {
  if (editText.value.trim() && editText.value !== props.item.text) {
    emit('update', props.item.id, editText.value.trim())
  }
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    saveEdit()
  } else if (e.key === 'Escape') {
    cancelEdit()
  }
}

function handleDelete() {
  emit('delete', props.item.id)
}
</script>

<template>
  <div
    class="checklist-item group"
    :class="{ completed: item.isCompleted }"
  >
    <!-- Drag Handle -->
    <div v-if="dragHandle" class="drag-handle">
      <GripVertical class="w-5 h-5 text-gray-400" />
    </div>

    <!-- Checkbox -->
    <button
      class="checkbox"
      :class="{ checked: item.isCompleted }"
      @click="handleToggle"
    >
      <Check v-if="item.isCompleted" class="w-4 h-4" />
    </button>

    <!-- Text -->
    <div class="flex-1 min-w-0">
      <input
        v-if="isEditing"
        ref="inputRef"
        v-model="editText"
        type="text"
        class="edit-input"
        @blur="saveEdit"
        @keydown="handleKeydown"
      />
      <span
        v-else
        class="item-text"
        :class="{ completed: item.isCompleted }"
        @dblclick="startEdit"
      >
        {{ item.text }}
      </span>
    </div>

    <!-- Delete Button -->
    <button
      class="delete-btn"
      @click="handleDelete"
      title="Delete item"
    >
      <Trash2 class="w-4 h-4" />
    </button>
  </div>
</template>

<style scoped>
.checklist-item {
  @apply flex items-center gap-3 py-3 px-2 rounded-lg;
  @apply transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50;
}

.drag-handle {
  @apply cursor-grab active:cursor-grabbing touch-none;
  @apply opacity-0 group-hover:opacity-100 transition-opacity;
}

.checkbox {
  @apply w-6 h-6 rounded-md flex items-center justify-center;
  @apply border-2 border-gray-300 dark:border-gray-600;
  @apply text-white transition-all;
  @apply hover:border-primary;
  @apply flex-shrink-0;
}

.checkbox.checked {
  @apply bg-primary border-primary;
}

.item-text {
  @apply text-gray-900 dark:text-white cursor-default;
}

.item-text.completed {
  @apply line-through text-gray-400 dark:text-gray-500;
}

.edit-input {
  @apply w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800;
  @apply text-gray-900 dark:text-white outline-none;
  @apply border border-primary;
}

.delete-btn {
  @apply p-1.5 rounded-lg transition-colors;
  @apply text-gray-400 hover:text-red-500;
  @apply hover:bg-red-50 dark:hover:bg-red-900/20;
  @apply opacity-0 group-hover:opacity-100;
}

@media (max-width: 640px) {
  .drag-handle,
  .delete-btn {
    @apply opacity-100;
  }
}
</style>

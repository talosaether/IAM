<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { ArrowLeft, Plus, Trash2, MoreVertical } from 'lucide-vue-next'
import draggable from 'vuedraggable'
import ChecklistItem from './ChecklistItem.vue'
import type { ChecklistWithItems } from '../../database/repositories/checklists'

const props = defineProps<{
  checklist: ChecklistWithItems
}>()

const emit = defineEmits<{
  back: []
  toggleItem: [itemId: number]
  updateItem: [itemId: number, text: string]
  deleteItem: [itemId: number]
  addItem: [text: string]
  reorderItems: [itemIds: number[]]
  clearCompleted: []
}>()

const newItemText = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const showMenu = ref(false)

const progressPercent = computed(() => {
  if (props.checklist.totalCount === 0) return 0
  return Math.round((props.checklist.completedCount / props.checklist.totalCount) * 100)
})

const hasCompleted = computed(() => props.checklist.completedCount > 0)

const sortedItems = computed(() => {
  return [...props.checklist.items].sort((a, b) => a.sortOrder - b.sortOrder)
})

function handleBack() {
  emit('back')
}

function handleAddItem() {
  if (newItemText.value.trim()) {
    emit('addItem', newItemText.value.trim())
    newItemText.value = ''
    nextTick(() => inputRef.value?.focus())
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    handleAddItem()
  }
}

function handleToggleItem(itemId: number) {
  emit('toggleItem', itemId)
}

function handleUpdateItem(itemId: number, text: string) {
  emit('updateItem', itemId, text)
}

function handleDeleteItem(itemId: number) {
  emit('deleteItem', itemId)
}

function handleDragEnd() {
  const itemIds = sortedItems.value.map(item => item.id)
  emit('reorderItems', itemIds)
}

function handleClearCompleted() {
  emit('clearCompleted')
  showMenu.value = false
}

function toggleMenu() {
  showMenu.value = !showMenu.value
}
</script>

<template>
  <div class="checklist-detail">
    <!-- Header -->
    <div class="header">
      <button class="back-btn" @click="handleBack">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h1 class="title">{{ checklist.name }}</h1>
      <div class="relative">
        <button class="menu-btn" @click="toggleMenu">
          <MoreVertical class="w-5 h-5" />
        </button>
        <Transition name="menu">
          <div v-if="showMenu" class="dropdown-menu" @click.stop>
            <button
              class="menu-item"
              :disabled="!hasCompleted"
              @click="handleClearCompleted"
            >
              <Trash2 class="w-4 h-4" />
              Clear completed
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Progress -->
    <div class="progress-section">
      <div class="flex justify-between text-sm mb-2">
        <span class="text-gray-600 dark:text-gray-400">Progress</span>
        <span class="font-medium text-gray-900 dark:text-white">
          {{ checklist.completedCount }}/{{ checklist.totalCount }}
        </span>
      </div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>
    </div>

    <!-- Add Item -->
    <div class="add-item-section">
      <input
        ref="inputRef"
        v-model="newItemText"
        type="text"
        placeholder="Add new item..."
        class="add-input"
        @keydown="handleKeydown"
      />
      <button
        class="add-btn"
        :disabled="!newItemText.trim()"
        @click="handleAddItem"
      >
        <Plus class="w-5 h-5" />
      </button>
    </div>

    <!-- Items List -->
    <div class="items-list">
      <draggable
        :list="sortedItems"
        item-key="id"
        handle=".drag-handle"
        ghost-class="item-ghost"
        animation="150"
        @end="handleDragEnd"
      >
        <template #item="{ element }">
          <ChecklistItem
            :item="element"
            :drag-handle="true"
            @toggle="handleToggleItem"
            @update="handleUpdateItem"
            @delete="handleDeleteItem"
          />
        </template>
      </draggable>

      <!-- Empty State -->
      <div v-if="checklist.items.length === 0" class="empty-state">
        <p class="text-gray-500 dark:text-gray-400 text-center">
          No items yet. Add your first item above!
        </p>
      </div>
    </div>

    <!-- Click outside to close menu -->
    <div
      v-if="showMenu"
      class="fixed inset-0 z-10"
      @click="showMenu = false"
    />
  </div>
</template>

<style scoped>
.checklist-detail {
  @apply h-full flex flex-col;
}

.header {
  @apply flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-gray-700;
}

.back-btn {
  @apply p-2 -ml-2 rounded-lg text-gray-600 dark:text-gray-400;
  @apply hover:bg-gray-100 dark:hover:bg-gray-800;
}

.title {
  @apply flex-1 text-lg font-semibold text-gray-900 dark:text-white truncate;
}

.menu-btn {
  @apply p-2 rounded-lg text-gray-600 dark:text-gray-400;
  @apply hover:bg-gray-100 dark:hover:bg-gray-800;
}

.dropdown-menu {
  @apply absolute right-0 top-full mt-1 z-20;
  @apply w-48 py-1 rounded-lg shadow-lg;
  @apply bg-white dark:bg-surface-dark;
  @apply border border-gray-200 dark:border-gray-700;
}

.menu-item {
  @apply w-full flex items-center gap-2 px-4 py-2.5 text-left;
  @apply text-gray-700 dark:text-gray-300;
  @apply hover:bg-gray-100 dark:hover:bg-gray-800;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.progress-section {
  @apply px-4 py-4 border-b border-gray-200 dark:border-gray-700;
}

.progress-bar {
  @apply h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden;
}

.progress-fill {
  @apply h-full rounded-full bg-primary transition-all duration-300;
}

.add-item-section {
  @apply flex gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700;
}

.add-input {
  @apply flex-1 px-4 py-3 rounded-xl;
  @apply bg-gray-100 dark:bg-gray-800;
  @apply text-gray-900 dark:text-white;
  @apply outline-none border border-transparent focus:border-primary;
}

.add-btn {
  @apply w-12 h-12 rounded-xl flex items-center justify-center;
  @apply bg-primary text-white;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
  @apply active:scale-95 transition-transform;
}

.items-list {
  @apply flex-1 overflow-y-auto px-2 py-2;
}

.empty-state {
  @apply py-12 px-4;
}

:deep(.item-ghost) {
  @apply opacity-50 bg-primary/10;
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, ClipboardList, X } from 'lucide-vue-next'
import { useChecklistsStore } from '../stores/checklists'
import ChecklistCard from '../components/checklists/ChecklistCard.vue'
import ChecklistDetail from '../components/checklists/ChecklistDetail.vue'
import PullToRefresh from '../components/common/PullToRefresh.vue'
import type { ChecklistWithItems } from '../database/repositories/checklists'

const checklistsStore = useChecklistsStore()
const pullRefreshRef = ref<InstanceType<typeof PullToRefresh> | null>(null)
const isRefreshing = ref(false)

const showAddModal = ref(false)
const showDeleteConfirm = ref(false)
const newListName = ref('')
const checklistToDelete = ref<number | null>(null)
const editingChecklist = ref<ChecklistWithItems | null>(null)
const isRenaming = ref(false)

const checklists = computed(() => checklistsStore.checklists)
const activeChecklist = computed(() => checklistsStore.activeChecklist)
const isLoading = computed(() => checklistsStore.isLoading)

onMounted(() => {
  checklistsStore.loadChecklists()
})

function openAddModal() {
  newListName.value = ''
  isRenaming.value = false
  editingChecklist.value = null
  showAddModal.value = true
}

function openRenameModal(checklist: ChecklistWithItems) {
  newListName.value = checklist.name
  isRenaming.value = true
  editingChecklist.value = checklist
  showAddModal.value = true
}

async function handleSave() {
  if (!newListName.value.trim()) return

  if (isRenaming.value && editingChecklist.value) {
    await checklistsStore.updateChecklist(editingChecklist.value.id, newListName.value.trim())
  } else {
    await checklistsStore.createChecklist(newListName.value.trim())
  }

  showAddModal.value = false
}

function handleDeleteClick(checklistId: number) {
  checklistToDelete.value = checklistId
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  if (checklistToDelete.value) {
    await checklistsStore.deleteChecklist(checklistToDelete.value)
  }
  showDeleteConfirm.value = false
  checklistToDelete.value = null
}

function handleChecklistClick(checklist: ChecklistWithItems) {
  checklistsStore.setActiveChecklist(checklist)
  checklistsStore.loadChecklist(checklist.id)
}

async function handleDuplicate(checklist: ChecklistWithItems) {
  await checklistsStore.createFromTemplate(checklist.id, `${checklist.name} (copy)`)
}

function handleBack() {
  checklistsStore.setActiveChecklist(null)
}

async function handleToggleItem(itemId: number) {
  await checklistsStore.toggleItem(itemId)
}

async function handleUpdateItem(itemId: number, text: string) {
  await checklistsStore.updateItem(itemId, text)
}

async function handleDeleteItem(itemId: number) {
  await checklistsStore.deleteItem(itemId)
}

async function handleAddItem(text: string) {
  if (activeChecklist.value) {
    await checklistsStore.addItem(activeChecklist.value.id, text)
  }
}

async function handleReorderItems(itemIds: number[]) {
  if (activeChecklist.value) {
    await checklistsStore.reorderItems(activeChecklist.value.id, itemIds)
  }
}

async function handleClearCompleted() {
  if (activeChecklist.value) {
    await checklistsStore.clearCompleted(activeChecklist.value.id)
  }
}

async function handleRefresh() {
  isRefreshing.value = true
  await checklistsStore.loadChecklists()
  isRefreshing.value = false
  pullRefreshRef.value?.finishRefresh()
}
</script>

<template>
  <div class="checklists-view pt-safe">
    <!-- Detail View -->
    <ChecklistDetail
      v-if="activeChecklist"
      :checklist="activeChecklist"
      @back="handleBack"
      @toggle-item="handleToggleItem"
      @update-item="handleUpdateItem"
      @delete-item="handleDeleteItem"
      @add-item="handleAddItem"
      @reorder-items="handleReorderItems"
      @clear-completed="handleClearCompleted"
    />

    <!-- List View -->
    <PullToRefresh v-else ref="pullRefreshRef" :loading="isRefreshing" @refresh="handleRefresh">
    <div class="px-4 py-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Checklists</h1>
        <button
          class="add-button"
          @click="openAddModal"
        >
          <Plus class="w-6 h-6" />
        </button>
      </div>

      <!-- Checklists -->
      <div v-if="checklists.length > 0" class="space-y-3">
        <ChecklistCard
          v-for="checklist in checklists"
          :key="checklist.id"
          :checklist="checklist"
          @click="handleChecklistClick"
          @edit="openRenameModal"
          @delete="handleDeleteClick"
          @duplicate="handleDuplicate"
        />
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading" class="empty-state">
        <ClipboardList class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 dark:text-gray-400 text-center">
          No checklists yet.<br />
          Tap + to create your first checklist!
        </p>
      </div>

      <!-- Loading -->
      <div v-else class="flex justify-center py-12">
        <div class="loading-spinner" />
      </div>
    </div>
    </PullToRefresh>

    <!-- Add/Rename Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showAddModal"
          class="modal-backdrop"
          @click.self="showAddModal = false"
        >
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ isRenaming ? 'Rename Checklist' : 'New Checklist' }}
              </h2>
              <button class="close-btn" @click="showAddModal = false">
                <X class="w-5 h-5" />
              </button>
            </div>
            <div class="p-4">
              <input
                v-model="newListName"
                type="text"
                placeholder="Checklist name..."
                class="form-input"
                autofocus
                @keyup.enter="handleSave"
              />
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" @click="showAddModal = false">
                Cancel
              </button>
              <button
                class="btn-primary"
                :disabled="!newListName.trim()"
                @click="handleSave"
              >
                {{ isRenaming ? 'Save' : 'Create' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

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
              Delete Checklist?
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              This will permanently delete this checklist and all its items.
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
.checklists-view {
  @apply min-h-full pb-20;
}

.add-button {
  @apply w-11 h-11 rounded-full flex items-center justify-center;
  @apply bg-primary text-white;
  @apply active:opacity-80 active:scale-95;
  @apply transition-transform;
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
  @apply fixed inset-0 z-50 flex items-end sm:items-center justify-center;
  @apply bg-black/50 backdrop-blur-sm;
}

.modal-content {
  @apply w-full sm:max-w-md bg-white dark:bg-surface-dark;
  @apply rounded-t-2xl sm:rounded-2xl shadow-xl;
}

.modal-header {
  @apply flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700;
}

.close-btn {
  @apply p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700;
}

.form-input {
  @apply w-full px-4 py-3 rounded-xl;
  @apply bg-gray-100 dark:bg-gray-800;
  @apply text-gray-900 dark:text-white;
  @apply outline-none border border-transparent focus:border-primary;
}

.modal-footer {
  @apply flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700;
}

.btn-secondary {
  @apply flex-1 py-3 rounded-xl font-medium;
  @apply bg-gray-100 dark:bg-gray-800;
  @apply text-gray-600 dark:text-gray-400;
}

.btn-primary {
  @apply flex-1 py-3 rounded-xl font-medium;
  @apply bg-primary text-white;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.confirm-dialog {
  @apply w-full max-w-sm p-6 rounded-2xl mx-4;
  @apply bg-white dark:bg-surface-dark;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-content,
.modal-enter-active .confirm-dialog,
.modal-leave-active .modal-content,
.modal-leave-active .confirm-dialog {
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

.modal-enter-from .confirm-dialog,
.modal-leave-to .confirm-dialog {
  transform: scale(0.95);
}

@media (min-width: 640px) {
  .modal-enter-from .modal-content,
  .modal-leave-to .modal-content {
    transform: translateY(20px) scale(0.95);
  }
}
</style>

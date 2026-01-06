import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { checklistsRepository, type ChecklistWithItems } from '../database/repositories/checklists'

export const useChecklistsStore = defineStore('checklists', () => {
  // State
  const checklists = ref<ChecklistWithItems[]>([])
  const activeChecklist = ref<ChecklistWithItems | null>(null)
  const isLoading = ref(false)

  // Getters
  const templates = computed(() => checklists.value.filter(c => c.isTemplate))
  const regularLists = computed(() => checklists.value.filter(c => !c.isTemplate))

  const totalItems = computed(() => {
    return checklists.value.reduce((sum, c) => sum + c.totalCount, 0)
  })

  const totalCompleted = computed(() => {
    return checklists.value.reduce((sum, c) => sum + c.completedCount, 0)
  })

  // Actions
  async function loadChecklists() {
    isLoading.value = true
    try {
      checklists.value = await checklistsRepository.getAllWithItems()
    } finally {
      isLoading.value = false
    }
  }

  async function loadChecklist(id: number) {
    isLoading.value = true
    try {
      activeChecklist.value = await checklistsRepository.getByIdWithItems(id)
    } finally {
      isLoading.value = false
    }
  }

  async function createChecklist(name: string, isTemplate = false) {
    const id = await checklistsRepository.create(name, isTemplate)
    await loadChecklists()
    return id
  }

  async function updateChecklist(id: number, name: string) {
    await checklistsRepository.update(id, name)
    await loadChecklists()
    if (activeChecklist.value?.id === id) {
      await loadChecklist(id)
    }
  }

  async function deleteChecklist(id: number) {
    await checklistsRepository.delete(id)
    if (activeChecklist.value?.id === id) {
      activeChecklist.value = null
    }
    await loadChecklists()
  }

  async function addItem(checklistId: number, text: string) {
    const itemId = await checklistsRepository.addItem(checklistId, text)
    await loadChecklists()
    if (activeChecklist.value?.id === checklistId) {
      await loadChecklist(checklistId)
    }
    return itemId
  }

  async function updateItem(itemId: number, text: string) {
    await checklistsRepository.updateItem(itemId, text)
    await loadChecklists()
    if (activeChecklist.value) {
      await loadChecklist(activeChecklist.value.id)
    }
  }

  async function toggleItem(itemId: number) {
    const isCompleted = await checklistsRepository.toggleItem(itemId)

    // Update local state immediately
    if (activeChecklist.value) {
      const item = activeChecklist.value.items.find(i => i.id === itemId)
      if (item) {
        item.isCompleted = isCompleted
        activeChecklist.value.completedCount = activeChecklist.value.items.filter(i => i.isCompleted).length
      }
    }

    // Also update in main list
    for (const checklist of checklists.value) {
      const item = checklist.items.find(i => i.id === itemId)
      if (item) {
        item.isCompleted = isCompleted
        checklist.completedCount = checklist.items.filter(i => i.isCompleted).length
        break
      }
    }

    return isCompleted
  }

  async function deleteItem(itemId: number) {
    await checklistsRepository.deleteItem(itemId)
    await loadChecklists()
    if (activeChecklist.value) {
      await loadChecklist(activeChecklist.value.id)
    }
  }

  async function reorderItems(checklistId: number, itemIds: number[]) {
    await checklistsRepository.reorderItems(itemIds)
    if (activeChecklist.value?.id === checklistId) {
      await loadChecklist(checklistId)
    }
  }

  async function clearCompleted(checklistId: number) {
    await checklistsRepository.clearCompleted(checklistId)
    await loadChecklists()
    if (activeChecklist.value?.id === checklistId) {
      await loadChecklist(checklistId)
    }
  }

  async function createFromTemplate(templateId: number, name: string) {
    const id = await checklistsRepository.createFromTemplate(templateId, name)
    await loadChecklists()
    return id
  }

  function setActiveChecklist(checklist: ChecklistWithItems | null) {
    activeChecklist.value = checklist
  }

  return {
    // State
    checklists,
    activeChecklist,
    isLoading,

    // Getters
    templates,
    regularLists,
    totalItems,
    totalCompleted,

    // Actions
    loadChecklists,
    loadChecklist,
    createChecklist,
    updateChecklist,
    deleteChecklist,
    addItem,
    updateItem,
    toggleItem,
    deleteItem,
    reorderItems,
    clearCompleted,
    createFromTemplate,
    setActiveChecklist
  }
})

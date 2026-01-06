<script setup lang="ts">
import { computed } from 'vue'
import draggable from 'vuedraggable'
import HabitCard from './HabitCard.vue'
import type { HabitWithMeta } from '../../database/repositories/habits'
import type { HabitGroup } from '../../types'

const props = defineProps<{
  habits: HabitWithMeta[]
  groups: HabitGroup[]
  reorderEnabled?: boolean
}>()

const emit = defineEmits<{
  toggle: [habitId: number]
  edit: [habit: HabitWithMeta]
  delete: [habitId: number]
  reorder: [habitIds: number[]]
}>()

// Group habits by their groupId
const habitsByGroup = computed(() => {
  const grouped: Map<number | null, HabitWithMeta[]> = new Map()

  // Initialize with null for ungrouped
  grouped.set(null, [])

  // Initialize with group IDs
  for (const group of props.groups) {
    grouped.set(group.id, [])
  }

  // Distribute habits
  for (const habit of props.habits) {
    const groupId = habit.groupId || null
    if (!grouped.has(groupId)) {
      grouped.set(groupId, [])
    }
    grouped.get(groupId)!.push(habit)
  }

  return grouped
})

const groupOrder = computed(() => {
  // Return groups in order, with ungrouped at the end
  const order: (HabitGroup | null)[] = [...props.groups]
  order.push(null) // Ungrouped at the end
  return order
})

function getGroupName(group: HabitGroup | null): string {
  return group?.name || 'Other'
}

function handleToggle(habitId: number) {
  emit('toggle', habitId)
}

function handleEdit(habit: HabitWithMeta) {
  emit('edit', habit)
}

function handleDelete(habitId: number) {
  emit('delete', habitId)
}

function handleDragEnd() {
  // Collect all habit IDs in their new order
  const allHabitIds: number[] = []
  for (const group of groupOrder.value) {
    const groupId = group?.id ?? null
    const groupHabits = habitsByGroup.value.get(groupId) || []
    allHabitIds.push(...groupHabits.map(h => h.id))
  }
  emit('reorder', allHabitIds)
}
</script>

<template>
  <div class="habit-list">
    <template v-for="group in groupOrder" :key="group?.id ?? 'ungrouped'">
      <div
        v-if="habitsByGroup.get(group?.id ?? null)?.length"
        class="habit-group"
      >
        <!-- Group Header -->
        <h3 v-if="groups.length > 0" class="group-header">
          {{ getGroupName(group) }}
        </h3>

        <!-- Draggable List -->
        <draggable
          v-if="reorderEnabled"
          :list="habitsByGroup.get(group?.id ?? null) || []"
          item-key="id"
          handle=".drag-handle"
          ghost-class="habit-ghost"
          animation="150"
          @end="handleDragEnd"
        >
          <template #item="{ element }">
            <HabitCard
              :habit="element"
              :drag-handle="true"
              @toggle="handleToggle"
              @edit="handleEdit"
              @delete="handleDelete"
            />
          </template>
        </draggable>

        <!-- Static List -->
        <div v-else class="habit-stack">
          <HabitCard
            v-for="habit in habitsByGroup.get(group?.id ?? null)"
            :key="habit.id"
            :habit="habit"
            @toggle="handleToggle"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.habit-list {
  @apply space-y-6;
}

.habit-group {
  @apply space-y-3;
}

.group-header {
  @apply text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide;
  @apply px-1;
}

.habit-stack {
  @apply space-y-3;
}

/* Draggable ghost styling */
:deep(.habit-ghost) {
  @apply opacity-50 bg-primary/20;
}

:deep(.sortable-drag) {
  @apply opacity-100 !important;
}
</style>

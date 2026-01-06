<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tabRoutes } from '@/router'
import {
  Home,
  CheckCircle,
  ListChecks,
  Utensils,
  Dumbbell,
  Settings
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const activeTab = computed(() => route.name as string)

const iconComponents: Record<string, any> = {
  'home': Home,
  'check-circle': CheckCircle,
  'list-checks': ListChecks,
  'utensils': Utensils,
  'dumbbell': Dumbbell,
  'settings': Settings
}

const tabs = computed(() =>
  tabRoutes.map(r => ({
    name: r.name as string,
    icon: r.meta?.icon as string,
    path: r.path
  }))
)

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <nav class="tab-bar">
    <button
      v-for="tab in tabs"
      :key="tab.name"
      class="tab-item"
      :class="{ active: tab.name === activeTab }"
      @click="navigateTo(tab.path)"
    >
      <component
        :is="iconComponents[tab.icon]"
        class="tab-icon"
        :size="24"
      />
      <span class="tab-label">{{ tab.name }}</span>
    </button>
  </nav>
</template>

<style scoped>
.tab-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: 8px 0;
  padding-bottom: max(8px, env(safe-area-inset-bottom));
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  color: var(--color-text-tertiary);
  padding: 4px 12px;
  cursor: pointer;
  transition: color 0.2s;
  -webkit-tap-highlight-color: transparent;
}

.tab-item:active {
  opacity: 0.7;
}

.tab-item.active {
  color: #10b981;
}

.tab-icon {
  margin-bottom: 2px;
}

.tab-label {
  font-size: 10px;
  font-weight: 500;
}
</style>

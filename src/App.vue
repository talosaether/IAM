<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import TabBar from '@/components/common/TabBar.vue'
import { useSettingsStore } from '@/stores/settings'

const route = useRoute()
const settingsStore = useSettingsStore()

const showTabBar = computed(() => route.meta?.tab !== false)

onMounted(async () => {
  await settingsStore.loadSettings()
})
</script>

<template>
  <div class="app" :class="{ dark: settingsStore.effectiveTheme === 'dark' }">
    <div class="app-content">
      <router-view v-slot="{ Component }">
        <keep-alive :include="['HomeView', 'HabitsView']">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>

    <TabBar v-if="showTabBar" />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  background-color: var(--color-background);
}

.app-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
</style>

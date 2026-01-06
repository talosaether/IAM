import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type Theme = 'light' | 'dark' | 'system'
export type AgeGroup = 'teen' | 'adult'
export type SportFocus = 'general' | 'basketball' | 'soccer' | 'running' | 'swimming'

export interface Settings {
  userName: string
  theme: Theme
  sportFocus: SportFocus
  ageGroup: AgeGroup
}

export const useSettingsStore = defineStore('settings', () => {
  // State
  const userName = ref('')
  const theme = ref<Theme>('system')
  const sportFocus = ref<SportFocus>('general')
  const ageGroup = ref<AgeGroup>('adult')
  const isLoaded = ref(false)

  // Getters
  const effectiveTheme = computed(() => {
    if (theme.value === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme.value
  })

  const greeting = computed(() => {
    const hour = new Date().getHours()
    let timeGreeting = 'Good evening'
    if (hour < 12) timeGreeting = 'Good morning'
    else if (hour < 17) timeGreeting = 'Good afternoon'

    return userName.value ? `${timeGreeting}, ${userName.value}` : timeGreeting
  })

  // Actions
  async function loadSettings() {
    // TODO: Load from SQLite
    // For now, load from localStorage as fallback
    const stored = localStorage.getItem('iam_settings')
    if (stored) {
      const settings = JSON.parse(stored) as Partial<Settings>
      userName.value = settings.userName ?? ''
      theme.value = settings.theme ?? 'system'
      sportFocus.value = settings.sportFocus ?? 'general'
      ageGroup.value = settings.ageGroup ?? 'adult'
    }
    isLoaded.value = true
  }

  async function saveSettings() {
    // TODO: Save to SQLite
    // For now, save to localStorage as fallback
    localStorage.setItem('iam_settings', JSON.stringify({
      userName: userName.value,
      theme: theme.value,
      sportFocus: sportFocus.value,
      ageGroup: ageGroup.value
    }))
  }

  async function updateProfile(updates: Partial<Settings>) {
    if (updates.userName !== undefined) userName.value = updates.userName
    if (updates.theme !== undefined) theme.value = updates.theme
    if (updates.sportFocus !== undefined) sportFocus.value = updates.sportFocus
    if (updates.ageGroup !== undefined) ageGroup.value = updates.ageGroup
    await saveSettings()
  }

  async function setTheme(newTheme: Theme) {
    theme.value = newTheme
    await saveSettings()
  }

  async function clearAllData() {
    // TODO: Clear SQLite database
    localStorage.clear()
    userName.value = ''
    theme.value = 'system'
    sportFocus.value = 'general'
    ageGroup.value = 'adult'
  }

  // Watch for system theme changes
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      // Trigger reactivity update for system theme
      if (theme.value === 'system') {
        theme.value = 'system'
      }
    })
  }

  return {
    // State
    userName,
    theme,
    sportFocus,
    ageGroup,
    isLoaded,
    // Getters
    effectiveTheme,
    greeting,
    // Actions
    loadSettings,
    saveSettings,
    updateProfile,
    setTheme,
    clearAllData
  }
})

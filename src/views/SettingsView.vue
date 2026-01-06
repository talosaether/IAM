<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSettingsStore, type Theme, type SportFocus, type AgeGroup } from '@/stores/settings'
import { useDataExport } from '@/composables/useDataExport'
import { useHaptics } from '@/composables/useHaptics'
import {
  User,
  Palette,
  Target,
  Users,
  Download,
  Upload,
  Trash2,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Check,
  X
} from 'lucide-vue-next'

const settingsStore = useSettingsStore()
const { exportToFile, importFromFile } = useDataExport()
const { lightImpact, successNotification, warningNotification, errorNotification } = useHaptics()

const showNameModal = ref(false)
const showThemeModal = ref(false)
const showSportModal = ref(false)
const showAgeModal = ref(false)
const showClearConfirm = ref(false)
const showExportSuccess = ref(false)
const showImportSuccess = ref(false)
const exportError = ref('')
const importError = ref('')
const isExporting = ref(false)
const isImporting = ref(false)

const editName = ref('')

const themeOptions: { value: Theme; label: string; icon: any }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor }
]

const sportOptions: { value: SportFocus; label: string }[] = [
  { value: 'general', label: 'General Fitness' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'soccer', label: 'Soccer' },
  { value: 'running', label: 'Running' },
  { value: 'swimming', label: 'Swimming' }
]

const ageOptions: { value: AgeGroup; label: string }[] = [
  { value: 'teen', label: 'Teen (13-17)' },
  { value: 'adult', label: 'Adult (18+)' }
]

const currentThemeLabel = computed(() =>
  themeOptions.find(t => t.value === settingsStore.theme)?.label ?? 'System'
)

const currentSportLabel = computed(() =>
  sportOptions.find(s => s.value === settingsStore.sportFocus)?.label ?? 'General Fitness'
)

const currentAgeLabel = computed(() =>
  ageOptions.find(a => a.value === settingsStore.ageGroup)?.label ?? 'Adult'
)

function openNameModal() {
  editName.value = settingsStore.userName
  showNameModal.value = true
}

function saveName() {
  settingsStore.updateProfile({ userName: editName.value.trim() })
  showNameModal.value = false
}

function selectTheme(theme: Theme) {
  settingsStore.setTheme(theme)
  showThemeModal.value = false
}

function selectSport(sport: SportFocus) {
  settingsStore.updateProfile({ sportFocus: sport })
  showSportModal.value = false
}

function selectAge(age: AgeGroup) {
  settingsStore.updateProfile({ ageGroup: age })
  showAgeModal.value = false
}

async function handleExport() {
  await lightImpact()
  isExporting.value = true
  exportError.value = ''

  const result = await exportToFile()

  isExporting.value = false
  if (result.success) {
    await successNotification()
    showExportSuccess.value = true
    setTimeout(() => { showExportSuccess.value = false }, 3000)
  } else {
    await errorNotification()
    exportError.value = result.error || 'Export failed'
    setTimeout(() => { exportError.value = '' }, 5000)
  }
}

async function handleImport() {
  await lightImpact()
  isImporting.value = true
  importError.value = ''

  const result = await importFromFile()

  isImporting.value = false
  if (result.success) {
    await successNotification()
    showImportSuccess.value = true
    setTimeout(() => {
      showImportSuccess.value = false
      window.location.reload() // Reload to apply imported data
    }, 1500)
  } else if (result.error !== 'Cancelled') {
    await errorNotification()
    importError.value = result.error || 'Import failed'
    setTimeout(() => { importError.value = '' }, 5000)
  }
}

async function handleClearData() {
  await warningNotification()
  await settingsStore.clearAllData()
  showClearConfirm.value = false
  window.location.reload()
}
</script>

<template>
  <div class="settings-view pt-safe">
    <div class="px-4 py-6">
      <h1 class="text-2xl font-bold mb-6">Settings</h1>

      <!-- Profile Section -->
      <div class="section mb-6">
        <h2 class="section-title">Profile</h2>
        <div class="settings-card">
          <button class="setting-row" @click="openNameModal">
            <div class="setting-left">
              <User :size="20" class="setting-icon" />
              <span>Name</span>
            </div>
            <div class="setting-right">
              <span class="setting-value">{{ settingsStore.userName || 'Not set' }}</span>
              <ChevronRight :size="20" class="chevron" />
            </div>
          </button>
        </div>
      </div>

      <!-- Appearance Section -->
      <div class="section mb-6">
        <h2 class="section-title">Appearance</h2>
        <div class="settings-card">
          <button class="setting-row" @click="showThemeModal = true">
            <div class="setting-left">
              <Palette :size="20" class="setting-icon" />
              <span>Theme</span>
            </div>
            <div class="setting-right">
              <span class="setting-value">{{ currentThemeLabel }}</span>
              <ChevronRight :size="20" class="chevron" />
            </div>
          </button>
        </div>
      </div>

      <!-- Workout Preferences Section -->
      <div class="section mb-6">
        <h2 class="section-title">Workout Preferences</h2>
        <div class="settings-card">
          <button class="setting-row" @click="showSportModal = true">
            <div class="setting-left">
              <Target :size="20" class="setting-icon" />
              <span>Sport Focus</span>
            </div>
            <div class="setting-right">
              <span class="setting-value">{{ currentSportLabel }}</span>
              <ChevronRight :size="20" class="chevron" />
            </div>
          </button>
          <div class="divider"></div>
          <button class="setting-row" @click="showAgeModal = true">
            <div class="setting-left">
              <Users :size="20" class="setting-icon" />
              <span>Age Group</span>
            </div>
            <div class="setting-right">
              <span class="setting-value">{{ currentAgeLabel }}</span>
              <ChevronRight :size="20" class="chevron" />
            </div>
          </button>
        </div>
      </div>

      <!-- Data Section -->
      <div class="section mb-6">
        <h2 class="section-title">Data</h2>
        <div class="settings-card">
          <button class="setting-row" :disabled="isExporting" @click="handleExport">
            <div class="setting-left">
              <Download :size="20" class="setting-icon" :class="{ spinning: isExporting }" />
              <span>{{ isExporting ? 'Exporting...' : 'Export Data' }}</span>
            </div>
            <div class="setting-right">
              <Check v-if="showExportSuccess" :size="20" class="text-green-500" />
              <X v-else-if="exportError" :size="20" class="text-red-500" />
              <ChevronRight v-else :size="20" class="chevron" />
            </div>
          </button>
          <div class="divider"></div>
          <button class="setting-row" :disabled="isImporting" @click="handleImport">
            <div class="setting-left">
              <Upload :size="20" class="setting-icon" :class="{ spinning: isImporting }" />
              <span>{{ isImporting ? 'Importing...' : 'Import Data' }}</span>
            </div>
            <div class="setting-right">
              <Check v-if="showImportSuccess" :size="20" class="text-green-500" />
              <X v-else-if="importError" :size="20" class="text-red-500" />
              <ChevronRight v-else :size="20" class="chevron" />
            </div>
          </button>
          <div class="divider"></div>
          <button class="setting-row danger" @click="showClearConfirm = true">
            <div class="setting-left">
              <Trash2 :size="20" class="setting-icon" />
              <span>Clear All Data</span>
            </div>
            <ChevronRight :size="20" class="chevron" />
          </button>
        </div>
        <!-- Error messages -->
        <p v-if="exportError" class="error-message">{{ exportError }}</p>
        <p v-if="importError" class="error-message">{{ importError }}</p>
      </div>

      <!-- About Section -->
      <div class="section">
        <h2 class="section-title">About</h2>
        <div class="settings-card">
          <div class="about-row">
            <span class="text-gray-500 dark:text-gray-400">Version</span>
            <span>1.0.0</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Name Modal -->
    <div v-if="showNameModal" class="modal-overlay" @click.self="showNameModal = false">
      <div class="modal">
        <h3 class="modal-title">Your Name</h3>
        <input
          v-model="editName"
          type="text"
          placeholder="Enter your name"
          class="modal-input"
          @keyup.enter="saveName"
        />
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="showNameModal = false">Cancel</button>
          <button class="modal-btn confirm" @click="saveName">Save</button>
        </div>
      </div>
    </div>

    <!-- Theme Modal -->
    <div v-if="showThemeModal" class="modal-overlay" @click.self="showThemeModal = false">
      <div class="modal">
        <h3 class="modal-title">Choose Theme</h3>
        <div class="option-list">
          <button
            v-for="option in themeOptions"
            :key="option.value"
            class="option-item"
            :class="{ selected: settingsStore.theme === option.value }"
            @click="selectTheme(option.value)"
          >
            <component :is="option.icon" :size="20" />
            <span>{{ option.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Sport Modal -->
    <div v-if="showSportModal" class="modal-overlay" @click.self="showSportModal = false">
      <div class="modal">
        <h3 class="modal-title">Sport Focus</h3>
        <div class="option-list">
          <button
            v-for="option in sportOptions"
            :key="option.value"
            class="option-item"
            :class="{ selected: settingsStore.sportFocus === option.value }"
            @click="selectSport(option.value)"
          >
            <span>{{ option.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Age Modal -->
    <div v-if="showAgeModal" class="modal-overlay" @click.self="showAgeModal = false">
      <div class="modal">
        <h3 class="modal-title">Age Group</h3>
        <div class="option-list">
          <button
            v-for="option in ageOptions"
            :key="option.value"
            class="option-item"
            :class="{ selected: settingsStore.ageGroup === option.value }"
            @click="selectAge(option.value)"
          >
            <span>{{ option.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Clear Confirm Modal -->
    <div v-if="showClearConfirm" class="modal-overlay" @click.self="showClearConfirm = false">
      <div class="modal">
        <h3 class="modal-title">Clear All Data?</h3>
        <p class="modal-text">This will delete all your habits, checklists, and progress. This action cannot be undone.</p>
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="showClearConfirm = false">Cancel</button>
          <button class="modal-btn danger" @click="handleClearData">Clear Data</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  min-height: 100%;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  margin-bottom: 8px;
  padding-left: 4px;
}

.settings-card {
  background-color: var(--color-surface);
  border-radius: 12px;
  overflow: hidden;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px;
  background: none;
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.setting-row:active {
  background-color: var(--color-border);
}

.setting-row.danger {
  color: #ef4444;
}

.setting-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.setting-icon {
  color: var(--color-text-secondary);
}

.setting-row.danger .setting-icon {
  color: #ef4444;
}

.setting-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.setting-value {
  color: var(--color-text-tertiary);
  font-size: 14px;
}

.chevron {
  color: var(--color-text-tertiary);
}

.divider {
  height: 1px;
  background-color: var(--color-border);
  margin-left: 52px;
}

.about-row {
  display: flex;
  justify-content: space-between;
  padding: 16px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 100;
}

.modal {
  background-color: var(--color-surface-elevated);
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 320px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
}

.modal-text {
  color: var(--color-text-secondary);
  font-size: 14px;
  text-align: center;
  margin-bottom: 20px;
}

.modal-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-background);
  color: var(--color-text-primary);
  font-size: 16px;
  margin-bottom: 16px;
}

.modal-input:focus {
  outline: none;
  border-color: #10b981;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.modal-btn.cancel {
  background-color: var(--color-border);
  color: var(--color-text-primary);
}

.modal-btn.confirm {
  background-color: #10b981;
  color: white;
}

.modal-btn.danger {
  background-color: #ef4444;
  color: white;
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: none;
  color: var(--color-text-primary);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.option-item.selected {
  border-color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
}

.option-item:active {
  opacity: 0.7;
}

.setting-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-message {
  color: #ef4444;
  font-size: 12px;
  margin-top: 8px;
  padding-left: 4px;
}

.setting-row:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

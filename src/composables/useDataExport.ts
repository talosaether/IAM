import { Capacitor } from '@capacitor/core'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import { exportData, importData } from '../database'

const APP_NAME = 'IAM'

function getExportFileName(): string {
  const date = new Date().toISOString().split('T')[0]
  return `${APP_NAME}_backup_${date}.json`
}

export function useDataExport() {
  /**
   * Export data to a file and share it (native) or download it (web)
   */
  async function exportToFile(): Promise<{ success: boolean; error?: string }> {
    try {
      const jsonData = exportData()
      const fileName = getExportFileName()

      if (Capacitor.isNativePlatform()) {
        // Write to filesystem first
        const result = await Filesystem.writeFile({
          path: fileName,
          data: jsonData,
          directory: Directory.Cache,
          encoding: Encoding.UTF8
        })

        // Share the file
        await Share.share({
          title: `${APP_NAME} Backup`,
          text: 'Your IAM app backup',
          url: result.uri,
          dialogTitle: 'Export your data'
        })
      } else {
        // Web: Create and download blob
        const blob = new Blob([jsonData], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }

      return { success: true }
    } catch (error: any) {
      console.error('Export failed:', error)
      return { success: false, error: error.message || 'Export failed' }
    }
  }

  /**
   * Import data from a file
   * On native, opens file picker. On web, creates file input.
   */
  async function importFromFile(): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      // Create file input
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'application/json,.json'

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) {
          resolve({ success: false, error: 'No file selected' })
          return
        }

        try {
          const text = await file.text()
          const success = importData(text)
          if (success) {
            resolve({ success: true })
          } else {
            resolve({ success: false, error: 'Invalid backup file' })
          }
        } catch (error: any) {
          resolve({ success: false, error: error.message || 'Failed to read file' })
        }
      }

      input.oncancel = () => {
        resolve({ success: false, error: 'Cancelled' })
      }

      input.click()
    })
  }

  /**
   * Get data summary for display
   */
  function getDataSummary(): { habits: number; checklists: number; completions: number } {
    try {
      const data = JSON.parse(exportData())
      return {
        habits: data.habits?.length || 0,
        checklists: data.checklists?.length || 0,
        completions: data.habit_completions?.length || 0
      }
    } catch {
      return { habits: 0, checklists: 0, completions: 0 }
    }
  }

  return {
    exportToFile,
    importFromFile,
    getDataSummary
  }
}

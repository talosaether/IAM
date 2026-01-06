import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

// Check if we're on a native platform
const isNative = () => {
  return typeof window !== 'undefined' &&
    (window as any).Capacitor?.isNativePlatform?.() === true
}

export function useHaptics() {
  /**
   * Light impact - for subtle UI interactions
   * Use for: toggling switches, selecting items
   */
  async function lightImpact() {
    if (!isNative()) return
    try {
      await Haptics.impact({ style: ImpactStyle.Light })
    } catch (e) {
      // Silently fail on web
    }
  }

  /**
   * Medium impact - for standard interactions
   * Use for: button presses, completing actions
   */
  async function mediumImpact() {
    if (!isNative()) return
    try {
      await Haptics.impact({ style: ImpactStyle.Medium })
    } catch (e) {
      // Silently fail on web
    }
  }

  /**
   * Heavy impact - for significant actions
   * Use for: deletions, major state changes
   */
  async function heavyImpact() {
    if (!isNative()) return
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy })
    } catch (e) {
      // Silently fail on web
    }
  }

  /**
   * Success notification - for successful completions
   * Use for: habit completion, task done
   */
  async function successNotification() {
    if (!isNative()) return
    try {
      await Haptics.notification({ type: NotificationType.Success })
    } catch (e) {
      // Silently fail on web
    }
  }

  /**
   * Warning notification - for warnings
   * Use for: about to delete, invalid input
   */
  async function warningNotification() {
    if (!isNative()) return
    try {
      await Haptics.notification({ type: NotificationType.Warning })
    } catch (e) {
      // Silently fail on web
    }
  }

  /**
   * Error notification - for errors
   * Use for: failed actions, errors
   */
  async function errorNotification() {
    if (!isNative()) return
    try {
      await Haptics.notification({ type: NotificationType.Error })
    } catch (e) {
      // Silently fail on web
    }
  }

  /**
   * Selection changed - for picker/selection changes
   * Use for: scrolling through options, reordering
   */
  async function selectionChanged() {
    if (!isNative()) return
    try {
      await Haptics.selectionChanged()
    } catch (e) {
      // Silently fail on web
    }
  }

  return {
    lightImpact,
    mediumImpact,
    heavyImpact,
    successNotification,
    warningNotification,
    errorNotification,
    selectionChanged
  }
}

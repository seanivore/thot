// Thot v2 - Content Persistence
// Saves content to localStorage with debouncing

const CONTENT_KEY = 'thot:content'
const DEBOUNCE_MS = 500

let saveTimeout: number | null = null

/**
 * Save content to localStorage with debounce
 * Waits 500ms after last keystroke before saving
 */
export function saveContent(content: string): void {
  if (saveTimeout !== null) {
    clearTimeout(saveTimeout)
  }

  saveTimeout = window.setTimeout(() => {
    try {
      localStorage.setItem(CONTENT_KEY, content)
      saveTimeout = null
    } catch (e) {
      // localStorage might be full or disabled
      console.warn('Failed to save content:', e)
    }
  }, DEBOUNCE_MS)
}

/**
 * Load content from localStorage
 * Returns empty string if nothing saved
 */
export function loadContent(): string {
  try {
    return localStorage.getItem(CONTENT_KEY) ?? ''
  } catch (e) {
    console.warn('Failed to load content:', e)
    return ''
  }
}

/**
 * Force immediate save (e.g., before page unload)
 */
export function forceSave(content: string): void {
  if (saveTimeout !== null) {
    clearTimeout(saveTimeout)
    saveTimeout = null
  }

  try {
    localStorage.setItem(CONTENT_KEY, content)
  } catch (e) {
    console.warn('Failed to force save content:', e)
  }
}

/**
 * Check if there's any saved content
 */
export function hasSavedContent(): boolean {
  try {
    return localStorage.getItem(CONTENT_KEY) !== null
  } catch {
    return false
  }
}

/**
 * Clear saved content
 */
export function clearContent(): void {
  try {
    localStorage.removeItem(CONTENT_KEY)
  } catch (e) {
    console.warn('Failed to clear content:', e)
  }
}

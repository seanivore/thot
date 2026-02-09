// Thot v2 - Editor State Persistence
// Saves and restores cursor position and scroll position

const STATE_KEY = 'thot:state'
const DEBOUNCE_MS = 250

export interface EditorStateData {
  cursorPos: number
  scrollTop: number
}

let saveTimeout: number | null = null

/**
 * Save editor state with debounce
 */
export function saveState(state: EditorStateData): void {
  if (saveTimeout !== null) {
    clearTimeout(saveTimeout)
  }

  saveTimeout = window.setTimeout(() => {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state))
      saveTimeout = null
    } catch (e) {
      console.warn('Failed to save state:', e)
    }
  }, DEBOUNCE_MS)
}

/**
 * Load editor state from localStorage
 */
export function loadState(): EditorStateData | null {
  try {
    const saved = localStorage.getItem(STATE_KEY)
    if (!saved) return null

    const parsed = JSON.parse(saved)

    // Validate the shape
    if (typeof parsed.cursorPos === 'number' && typeof parsed.scrollTop === 'number') {
      return parsed as EditorStateData
    }

    return null
  } catch (e) {
    console.warn('Failed to load state:', e)
    return null
  }
}

/**
 * Force immediate save
 */
export function forceSaveState(state: EditorStateData): void {
  if (saveTimeout !== null) {
    clearTimeout(saveTimeout)
    saveTimeout = null
  }

  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state))
  } catch (e) {
    console.warn('Failed to force save state:', e)
  }
}

/**
 * Clear saved state
 */
export function clearState(): void {
  try {
    localStorage.removeItem(STATE_KEY)
  } catch (e) {
    console.warn('Failed to clear state:', e)
  }
}

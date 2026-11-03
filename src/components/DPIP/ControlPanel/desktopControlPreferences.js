const storageKey = 'desktopControlPanel'
export const desktopControlPositions = ['left', 'center', 'right']
const defaults = { collapsed: false, position: 'center' }

export const readDesktopControlPreferences = () => {
    if (typeof window === 'undefined') return defaults
    try {
        const stored = localStorage.getItem(storageKey)
        if (!stored) return defaults
        const preferences = JSON.parse(stored)
        if (
            typeof preferences?.collapsed !== 'boolean' ||
            !desktopControlPositions.includes(preferences?.position)
        ) {
            throw new Error('Invalid desktop control panel preferences.')
        }
        return { collapsed: preferences.collapsed, position: preferences.position }
    } catch (error) {
        console.error('Error restoring desktop control panel preferences:', error)
        return defaults
    }
}

export const saveDesktopControlPreferences = preferences => {
    try {
        localStorage.setItem(storageKey, JSON.stringify(preferences))
    } catch (error) {
        console.error('Error saving desktop control panel preferences:', error)
    }
}

import { useSyncExternalStore } from 'react'
import debounce from 'lodash/debounce'

const defaultSize = {
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    deviceType: 'desktop'
}

const getSize = () => {
    if (typeof window === 'undefined') {
        return defaultSize
    }

    const width = window.innerWidth

    return {
        width,
        height: window.innerHeight,
        isMobile: width <= 768,
        isTablet: width > 768 && width < 1280,
        isDesktop: width >= 1280,
        deviceType: width <= 768 ? 'mobile' : width < 1280 ? 'tablet' : 'desktop'
    }
}

let currentSize = getSize()
const listeners = new Set()

const hasWindowSizeChanged = (nextSize) => (
    nextSize.width !== currentSize.width ||
    nextSize.height !== currentSize.height ||
    nextSize.isMobile !== currentSize.isMobile ||
    nextSize.isTablet !== currentSize.isTablet ||
    nextSize.isDesktop !== currentSize.isDesktop ||
    nextSize.deviceType !== currentSize.deviceType
)

const notifySizeChange = debounce(() => {
    const nextSize = getSize()

    if (!hasWindowSizeChanged(nextSize)) {
        return
    }

    currentSize = nextSize
    listeners.forEach(listener => listener())
}, 150)

const getSnapshot = () => {
    const nextSize = getSize()

    if (hasWindowSizeChanged(nextSize)) {
        currentSize = nextSize
    }

    return currentSize
}

const subscribe = listener => {
    listeners.add(listener)

    if (listeners.size === 1 && typeof window !== 'undefined') {
        window.addEventListener('resize', notifySizeChange)
    }

    return () => {
        listeners.delete(listener)

        if (listeners.size === 0 && typeof window !== 'undefined') {
            notifySizeChange.cancel()
            window.removeEventListener('resize', notifySizeChange)
        }
    }
}

export const useWindowSize = () => {
    return useSyncExternalStore(subscribe, getSnapshot, () => defaultSize)
}
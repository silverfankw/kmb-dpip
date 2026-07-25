import { useState, useEffect, useMemo } from 'react'
import debounce from 'lodash/debounce'

const getSize = () => {
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

export const useWindowSize = () => {
    const [size, setSize] = useState(getSize())

    const handleResize = useMemo(
        () => debounce(() => {
            setSize(getSize())
        }, 150),
        []
    )

    useEffect(() => {
        window.addEventListener('resize', handleResize)
        return () => {
            handleResize.cancel()
            window.removeEventListener('resize', handleResize)
        }
    }, [handleResize])

    return size
}
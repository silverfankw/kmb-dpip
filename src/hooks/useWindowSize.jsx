import { useState, useEffect, useMemo } from 'react'
import debounce from 'lodash/debounce'

export const useWindowSize = () => {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= 768
    })

    const handleResize = useMemo(
        () => debounce(() => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
                isMobile: window.innerWidth <= 768
            })
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
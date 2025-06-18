import { useEffect, useRef, useCallback } from "react"

export const useKeyboardNavigation = ({
    onPrev,
    onNext,
    onHome,
    onEnd,
    isActive = true,
    debounceMs = 50,
    isDisabled = false,
}) => {

    const debounceRef = useRef(null)

    const handleKeyboardControl = useCallback(
        (key) => {
            if (debounceRef.current || isDisabled) return

            switch (key) {
                case "ArrowLeft":
                    onPrev?.()
                    break
                case "ArrowRight":
                    onNext?.()
                    break
                case "Home":
                    onHome?.()
                    break
                case "End":
                    onEnd?.()
                    break
                default:
                    return
            }

            debounceRef.current = setTimeout(() => {
                debounceRef.current = null
            }, debounceMs)
        },
        [onPrev, onNext, onHome, onEnd, debounceMs, isDisabled]
    )

    useEffect(() => {
        if (!isActive) return
        const handleKeyDown = (e) => handleKeyboardControl(e.key)
        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            if (debounceRef.current) {
                clearTimeout(debounceRef.current)
                debounceRef.current = null
            }
        }
    }, [handleKeyboardControl, isActive])
}
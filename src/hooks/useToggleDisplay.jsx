import { useEffect } from "react"

export const useToggleDisplay = (refA, refB, interval, deps = []) => {
    useEffect(() => {
        if (refA.current && refB.current) {
            refA.current.style.display = "block"
            refB.current.style.display = "none"
        }
        const toggle = () => {
            if (refA.current && refB.current) {
                const isAVisible = refA.current.style.display !== "none"
                refA.current.style.display = isAVisible ? "none" : "block"
                refB.current.style.display = isAVisible ? "block" : "none"
            }
        }
        const timer = setInterval(toggle, interval)
        return () => clearInterval(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
}
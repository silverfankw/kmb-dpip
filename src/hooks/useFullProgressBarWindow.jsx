import { useMemo } from "react"

export const useFullProgressBarWindow = (stopLength, currentStopIndex, rangeSize, rangeSlide) => {
    return useMemo(() => {
        if (stopLength <= rangeSize) {
            return [0, stopLength]
        }
        if (currentStopIndex < rangeSlide) {
            return [0, rangeSize]
        }
        if (currentStopIndex >= stopLength - rangeSize) {
            return [stopLength - rangeSize, stopLength]
        }
        return [currentStopIndex - rangeSlide + 1, currentStopIndex - rangeSlide + 1 + rangeSize]
    }, [stopLength, currentStopIndex, rangeSize, rangeSlide])
}
import { useMemo } from "react"

/*
* A hook to return the start and end stop index of the full progress bar window.
*
* ------------- Props description ----------------
* 1) stopLength: total number of stops
* 2) currentStopIndex: current stop index
* 3) rangeSize: number of stops to display in the progress bar
* 4) slideThreshold: the stop index to trigger moving another slide of progress bar
* ------------------------------------------------
*
* Case examples are available at the end of this document.
*
*/

export const useFullProgressBarWindow = (stopLength, currentStopIndex, rangeSize, slideThreshold) => {
    return useMemo(() => {

        // When the total number of stops is less than or equal to the range size, return interval of all stops
        if (stopLength <= rangeSize) {
            return [0, stopLength]
        }

        // When the current stop index is within the slide threshold, return the interval between first stop and threshold index
        if (currentStopIndex < slideThreshold) {
            return [0, rangeSize]
        }

        // Check if progress slide is needed to switch by checking if current stop index is over the new threshold,
        // Return the interval between new start index to last stop
        const newSlideStartIndex = stopLength - rangeSize
        if (currentStopIndex >= newSlideStartIndex) {
            return [newSlideStartIndex, stopLength]
        }

        // Default case: return interval based on current stop index and slide threshold
        const slideStartIndex = currentStopIndex - slideThreshold + 1
        const slideEndIndex = slideStartIndex + rangeSize
        return [slideStartIndex, slideEndIndex]
    }, [stopLength, currentStopIndex, rangeSize, slideThreshold])
}


/* 
* ---------------------- Case Example 1 --------------------------

* Case 1: KMB Route 53 - Yuen Long (Yoho Mall) to Tsuen Wan Nina Tower
* Bus Stops Reference: https://hkbus.fandom.com/wiki/%E4%B9%9D%E5%B7%B453%E7%B7%9A#%E8%A1%8C%E8%BB%8A%E8%B7%AF%E7%B7%9A
*   Case 1a: Initial Load
*       Props 1 -> stopLength = 74 (Total # of Stops)
*       Props 2 -> currentStopIndex = 0 (Since it's the first stop)
*       Props 3 -> rangeSize = 32 (based on splitProgressBarCriteria in StopFullProgressBar.jsx)
*       Props 4 -> slideThreshold = 25 (80% of rangeSize and floored)
*       Step 1: Check if stopLength <= rangeSize -> (74 <= 32) ? No
*       Step 2: Check if currentStopIndex < slideThreshold -> (0 < 25) ? Yes
*   Result return -> [0, 32] (Display stops from index 0 to 31, 元朗形點 to 何福堂書院)
*
*   Case 1b: Browsing progress in between stops
*       Props 1 -> stopLength = 74
*       Props 2 -> currentStopIndex = 30 (Assuming the display now is at stop index 30, 井財街) 
*       Props 3 -> rangeSize = 32 
*       Props 4 -> slideThreshold = 25
*       Step 1: Check if stopLength <= rangeSize -> (74 <= 32) ? No
*       Step 2: Check if currentStopIndex < slideThreshold -> (30 < 25) ? No
*       Step 3: Check if currentStopIndex >= newSlideStartIndex -> (30 >= 42) ? No
*   Result in default case return -> [6, 38] (Display stops from index 6 to 37, 元朗公園 to 青山灣)
*
*   Case 1c: Nearing the end of the route (last slide of progress bar)
*       Props 1 -> stopLength = 74
*       Props 2 -> currentStopIndex = 70 (Assuming the display now is at stop index 70, 荃景圍天橋)
*       Props 3 -> rangeSize = 32
*       Props 4 -> slideThreshold = 25
*       Step 1: Check if stopLength <= rangeSize -> (74 <= 32) ? No
*       Step 2: Check if currentStopIndex < slideThreshold -> (70 < 25) ? No
*       Step 3: Check if currentStopIndex >= newSlideStartIndex -> (70 >= 42) ? Yes
*   Result in default case return -> [42, 74] (Display stops from index 42 to 73, 小秀村 to 如心廣場巴士總站)
*
* ----------------------------------------------------------------
*
* ---------------------- Case Example 2 --------------------------
*
* Case 2: KMB Route N241 - Hung Hom Station to Cheung Wang
* Bus Stops Reference: https://hkbus.fandom.com/wiki/%E4%B9%9D%E5%B7%B4N241%E7%B7%9A#%E5%BE%80%E9%9D%92%E8%A1%A3%EF%BC%88%E9%95%B7%E5%AE%8F%E9%82%A8%EF%BC%89
*   Case 2a: Initial Load
*       Props 1 -> stopLength = 57 (Total # of Stops)
*       Props 2 -> currentStopIndex = 0 (Since it's the first stop)
*       Props 3 -> rangeSize = 32 (based on splitProgressBarCriteria in StopFullProgressBar.jsx)
*       Props 4 -> slideThreshold = 25 (80% of rangeSize and floored)
*       Step 1: Check if stopLength <= rangeSize -> (57 <= 32) ? No
*       Step 2: Check if currentStopIndex < slideThreshold -> (0 < 25) ? Yes
*   Result return -> [0, 32] (Display stops from index 0 to 31, 紅磡站 to 九華徑)
*
*   Case 2b: Browsing progress in between stops
*       Props 1 -> stopLength = 57
*       Props 2 -> currentStopIndex = 29 (Assuming the display now is at stop index 28, 美孚巴士總站)
*       Props 3 -> rangeSize = 32
*       Props 4 -> slideThreshold = 25
*       Step 1: Check if stopLength <= rangeSize -> (57 <= 32) ? No
*       Step 2: Check if currentStopIndex < slideThreshold -> (29 < 25) ? No
*       Step 3: Check if currentStopIndex >= newSlideStartIndex -> (29 >= 25) ? Yes
*   Result return -> [26, 57] (Display stops from index 26 to 56, 元州商場 to 長宏巴士總站)
* 
* ----------------------------------------------------------------
*
* ---------------------- Case Example 3 --------------------------
*
* Case 3: KMB Route 33 - Yau Tong to Tsuen Wan West Station
* Bus Stops Reference: https://hkbus.fandom.com/wiki/%E4%B9%9D%E5%B7%B433%E7%B7%9A#%E5%BE%80%E8%8D%83%E7%81%A3%E8%A5%BF%E7%AB%99
*   Case 3a: Initial Load
*       Props 1 -> stopLength = 19 (Total # of Stops)
*       Props 2 -> currentStopIndex = 0 (Since it's the first stop)
*       Props 3 -> rangeSize = 32 (based on splitProgressBarCriteria in StopFullProgressBar.jsx)
*       Props 4 -> slideThreshold = 25 (80% of rangeSize and floored)
*       Step 1: Check if stopLength <= rangeSize -> (19 <= 32) ? Yes
*   Result return -> [0, 19] (Display stops from index 0 to 18, 油塘巴士總站 to 荃灣西站巴士總站落客站)
* 
*   Case 3b: Browsing progress in between stops
*       Props 1 -> stopLength = 19
*       Props 2 -> currentStopIndex = 10 (Assuming the display now is at stop index 10, 九龍灣臨華街)
*       Props 3 -> rangeSize = 32
*       Props 4 -> slideThreshold = 25
*       Step 1: Check if stopLength <= rangeSize -> (19 <= 32) ? Yes
*   Result return -> [0, 19] (Display stops from index 0 to 18, 油塘巴士總站 to 荃灣西站巴士總站落客站)
* ----------------------------------------------------------------
*/
import { useRef, useState, useEffect, useCallback } from "react"


export const DpipNextStop = ({ rowIndex, stopZh, stopEn, currentStopIndex }) => {

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [nameContainerWidth, setNameContainerWidth] = useState(0)
    const [zhTextWidth, setZhTextWidth] = useState(0)
    const [enTextWidth, setEnTextWidth] = useState(0)


    const handleWindowSizeChange = () => setWindowWidth(window.innerWidth)

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange)
        return () => window.removeEventListener('resize', handleWindowSizeChange)
    }, [])

    const nameContainerRef = useCallback(node => {
        if (node != null)
            setNameContainerWidth(node.getBoundingClientRect().width)
    }, [])

    const stopNameZhRef = useCallback(node => {
        if (node != null)
            setZhTextWidth(node.getBoundingClientRect().width)
    }, [stopZh])

    const stopNameEnRef = useCallback(node => {
        if (node != null)
            setEnTextWidth(node.getBoundingClientRect().width)
    }, [stopEn])

    const computeStopNameWidth = (type) => {
        const currentTextWidth = type == "zh" ? zhTextWidth : enTextWidth

        // When stops name longer than container, adjust name font size with one line display
        if (currentTextWidth > nameContainerWidth) {
            const emRatio = type == "zh" ? 3.25 : 1.5
            const overflowRatio = currentTextWidth / nameContainerWidth
            const currentFontSize =
                windowWidth <= 540 ? 8 :
                    windowWidth <= 767 ? 10 :
                        windowWidth <= 1024 ? 12 :
                            windowWidth <= 1280 ? 16 : 16
            const newFontSize = currentFontSize * emRatio / overflowRatio

            // if (type == "zh") {
            //     console.log(`Window: ${windowWidth} container: ${nameContainerWidth}, text: ${currentTextWidth}, ratio: ${overflowRatio}, Change to ${newFontSize} px`)
            // }

            return {
                fontSize: `${newFontSize}px`,
                whiteSpace: "normal",
            }
        }
    }


    return (
        <div ref={nameContainerRef} className={`dpip-screen-next-stop-row-${rowIndex + 1}`} >
            <div
                ref={stopNameZhRef}
                key={`next-stop-detail-zh-${currentStopIndex + 1}`}
                className='next-stop-detail-zh'
                style={computeStopNameWidth("zh")}>
                {stopZh}
            </div>
            <div ref={stopNameEnRef}
                key={`next-stop-detail-en-${currentStopIndex + 1}`}
                className='next-stop-detail-en'
                style={computeStopNameWidth("en")}>
                {stopEn}
            </div>
        </div>
    )
}
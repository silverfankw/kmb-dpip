import './App.css'
import { useState, useCallback, useRef, useEffect } from 'react'

// Regex check chinese character for font size adjustment
// const pattern = /([\u4e00-\u9fff\u3400-\u4dbf\ufa0e\ufa0f\ufa11\ufa13\ufa14\ufa1f\ufa21\ufa23\ufa24\ufa27\ufa28\ufa29\u3006\u3007]|[\ud840-\ud868\ud86a-\ud879\ud880-\ud887][\udc00-\udfff]|\ud869[\udc00-\udedf\udf00-\udfff]|\ud87a[\udc00-\udfef]|\ud888[\udc00-\udfaf])([\ufe00-\ufe0f]|\udb40[\udd00-\uddef])?/gm;

// const computeNextStopFontSize = (stopName) => {
//     const zhCharLength = stopName?.match(pattern)?.length ?? 0
//     if (zhCharLength > 0) {
//         if (zhCharLength >= 14) return { "fontSize": "26px", "overflow": "hidden" }
//         else if (zhCharLength.length >= 10) { return { "fontSize": "32px" } }
//     }
//     else if (stopName?.length >= 40)
//         return { "fontSize": "16px" }
// }


{/* DPIP secondary screen with only 3 next stops */ }
export const DPIPSecScreen = ({ stops, currentStopIndex }) => {

    const handleWindowSizeChange = () => setWindowWidth(window.innerWidth)

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange)
        return () => window.removeEventListener('resize', handleWindowSizeChange)
    }, [])

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [nameContainerWidth, setNameContainerWidth] = useState(0)
    const [zhTextWidth, setZhTextWidth] = useState(0)
    const [enTextWidth, setEnTextWidth] = useState(0)


    const nameContainerRef = useCallback(node => {
        if (node != null)
            setNameContainerWidth(node.getBoundingClientRect().width)
    }, [stops])

    const stopNameZhRef = useCallback(node => {
        if (node != null)
            setZhTextWidth(node.getBoundingClientRect().width)
    }, [stops, currentStopIndex])

    const stopNameEnRef = useCallback(node => {
        if (node != null)
            setEnTextWidth(node.getBoundingClientRect().width)
    }, [stops, currentStopIndex])

    const computeStopNameWidth = (type) => {
        const currentTextWidth = type == "zh" ? zhTextWidth : enTextWidth

        // When stops name longer than container, adjust name font size with one line display
        if (currentTextWidth > nameContainerWidth) {
            const emRatio = type == "zh" ? 4.5 : 2
            const overflowRatio = currentTextWidth / nameContainerWidth
            const currentFontSize =
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

    // useEffect(() => console.log(windowWidth), [windowWidth])

    return (
        <>
            <div className='dpip-monitor-screen' >
                <div className='dpip-monitor-container'>
                    <div className="dpip-secondary-monitor-bg">
                        <div className='dpip-screen-this-stop-row'>
                            <div
                                ref={nameContainerRef}
                                className='this-stop-detail-zh-container'>
                                <span
                                    ref={stopNameZhRef}
                                    className="this-stop-detail-zh"
                                    style={computeStopNameWidth("zh")}
                                >
                                    {stops?.[currentStopIndex]?.zh}
                                </span>
                            </div>
                            <div
                                className='this-stop-detail-en-container'>
                                <span
                                    ref={stopNameEnRef}
                                    className='this-stop-detail-en'
                                    style={computeStopNameWidth("en")}
                                >
                                    {stops?.[currentStopIndex]?.en}
                                </span>
                            </div>

                        </div>
                        {stops?.slice(currentStopIndex + 1, currentStopIndex + 3)?.map((stop, index) => {
                            return (
                                <div className={`dpip-screen-next-stop-row-${index + 1}`} >
                                    <div
                                        key={`next-stop-detail-zh-${currentStopIndex + 1}`}
                                        className='next-stop-detail-zh'
                                        style={{}}>
                                        {stop.zh}
                                    </div>
                                    <div className='next-stop-detail-en'
                                        key={`next-stop-detail-zh-${currentStopIndex + 2}`}
                                        style={{}}>
                                        {stop.en}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}
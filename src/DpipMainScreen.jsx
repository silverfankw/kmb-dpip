import './App.css'
import { useRef, useState, useCallback, useEffect, useLayoutEffect } from "react"
import Arrow from "../src/arrow.svg?react"
import { debounce } from '../util/util'

{/* DPIP main screen with full details */ }
export const DPIPMainScreen = ({ detail, currentStopIndex, currentBg }) => {

    const stopNameZh = detail?.stops?.[currentStopIndex]?.zh
    const stopNameEn = detail?.stops?.[currentStopIndex]?.en

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [stopNameContainerWidth, setStopNameContainerWidth] = useState(0)
    const [stopNameZhWidth, setStopNameZhWidth] = useState(0)
    const [stopNameEnWidth, setStopNameEnWidth] = useState(0)
    const [destNameContainerWidth, setDestNameContainerWidth] = useState(0)
    const [destNameWidth, setDestNameWidth] = useState(0)
    const [bigStopContent, setBigStopContent] = useState(stopNameZh)

    const bgList = ["url(./dpip-main-screen.svg)", "url(./dpip-main-screen-stop.svg)"]

    const handleWindowSizeChange = () => setWindowWidth(window.innerWidth)

    useEffect(() => {
        // Listen to window resize
        window.addEventListener('resize', handleWindowSizeChange)
        return () => window.removeEventListener('resize', handleWindowSizeChange)
    }, [])

    useEffect(() => {
        setBigStopContent(stopNameZh)
        // Switch the content after 3 seconds
        const interval = setInterval(() => {
            setBigStopContent(prevContent =>
                prevContent === detail?.stops?.[currentStopIndex]?.zh ?
                    detail?.stops?.[currentStopIndex]?.en :
                    detail?.stops?.[currentStopIndex]?.zh)
        }, 4000)
        return () => { clearInterval(interval) }
    }, [detail, currentStopIndex])


    const destNameContainerRef = useCallback(node => {
        if (node != null)
            setDestNameContainerWidth(node.getBoundingClientRect().width)
    }, [])

    const destNameRef = useCallback(node => {
        if (node != null) {
            // This is to remove adjusted font size style
            node.removeAttribute("style")
            setDestNameWidth(node.getBoundingClientRect().width)
        }
    }, [detail])

    const stopNameContainerRef = useCallback(node => {
        if (node != null)
            setStopNameContainerWidth(node.getBoundingClientRect().width)
    }, [])

    const stopNameZhRef = useCallback(node => {
        if (node != null) {
            // This is to remove adjusted font size style
            node.removeAttribute("style")
            setStopNameZhWidth(node.getBoundingClientRect().width)
        }
    }, [detail, currentStopIndex])

    const stopNameEnRef = useCallback(node => {
        if (node != null) {
            // This is to remove adjusted font size style
            node.removeAttribute("style")
            setStopNameEnWidth(node.getBoundingClientRect().width)
        }
    }, [detail, currentStopIndex])


    const nextStopIndex = currentStopIndex + 1
    const nextNextStopIndex = nextStopIndex + 1
    const lastStopIndex = detail?.stops?.length - 1

    const adjustRouteFontSize = route => {
        switch (route?.length) {
            case 1:
                return { "left": "2.25em" }
            case 2:
                return { "left": "2em" }
            case 3:
                return { "left": "1.65em" }
            case 4:
                return { "left": "1.4125em" }
            default:
                return { "left": "1.85em" }
        }
    }

    const adjustDestFontSize = () => {
        // console.log(`${destNameWidth} in adjust function`)
        if (destNameWidth > destNameContainerWidth) {
            const emRatio = 1.75
            const overflowRatio = destNameWidth / destNameContainerWidth
            const currentFontSize =
                windowWidth <= 540 ? 8 :
                    windowWidth <= 767 ? 10 :
                        windowWidth <= 1024 ? 12 :
                            windowWidth <= 1280 ? 16 : 16
            const newFontSize = currentFontSize * emRatio / overflowRatio

            // console.log(`* container: ${destNameContainerWidth}, text: ${destNameWidth}, ratio: ${overflowRatio}, Change to ${newFontSize} px`)

            return {
                fontSize: `${newFontSize}px`,
                // whiteSpace: "normal",
            }
        }
    }

    const adjustStopFontSize = () => {
        // console.log(`container: ${stopNameContainerWidth}, text: ${stopNameZhWidth}`)

        // When stops name longer than container, adjust name font size with one line display
        if (stopNameZhWidth > stopNameContainerWidth) {
            const emRatio = 4.5
            const overflowRatio = stopNameZhWidth / stopNameContainerWidth
            const currentFontSize =
                windowWidth <= 540 ? 8 :
                    windowWidth <= 767 ? 10 :
                        windowWidth <= 1024 ? 12 :
                            windowWidth <= 1280 ? 16 : 16
            const newFontSize = currentFontSize * emRatio / overflowRatio

            // console.log(`container: ${stopNameContainerWidth}, text: ${stopNameZhWidth}, ratio: ${overflowRatio}, Change to ${newFontSize} px`)

            return {
                fontSize: `${newFontSize}px`,
            }
        }
    }

    return (
        <>
            <div className='dpip-monitor-screen'>
                <div className='dpip-monitor-container'>
                    <div style={{ backgroundImage: bgList[currentBg] }} className="dpip-main-monitor-bg">

                        {/* Route and destination info */}
                        <section className="dpip-main-route-section">
                            <div style={adjustRouteFontSize(detail?.route)}
                                className='dpip-route-display'>
                                {detail?.route}
                            </div>
                            <div className="dpip-main-route-arrow">
                                <Arrow />
                            </div>
                            <div
                                ref={destNameContainerRef}
                                className='dpip-main-dest-info'>
                                <div
                                    ref={destNameRef}
                                    style={adjustDestFontSize()}
                                    className="dpip-main-dest-info-zh">
                                    {detail?.stops?.[lastStopIndex].zh}
                                    {/* {detail?.dest_tc} */}
                                </div>
                                <div className="dpip-main-dest-info-en">
                                    {detail?.stops?.[lastStopIndex].en}
                                    {/* {detail?.dest_en} */}
                                </div>
                            </div>
                        </section>

                        {/* Next 3 stops info */}
                        <section className="dpip-main-stop-detail-section">
                            <div className='dpip-main-this-stop-name'>
                                <div className='dpip-main-stop-name-zh'>{detail?.stops?.[currentStopIndex]?.zh}</div>
                                <div className='dpip-main-stop-name-en'>{detail?.stops?.[currentStopIndex]?.en}</div>
                            </div>
                            <div className='dpip-main-next-stop-name'>
                                <div className='dpip-main-stop-name-zh'>{detail?.stops?.[nextStopIndex]?.zh}</div>
                                <div className='dpip-main-stop-name-en'>{detail?.stops?.[nextStopIndex]?.en}</div>
                            </div>
                            <div className='dpip-main-next-next-stop-name'>
                                <div className='dpip-main-stop-name-zh'>{detail?.stops?.[nextNextStopIndex]?.zh}</div>
                                <div className='dpip-main-stop-name-en'>{detail?.stops?.[nextNextStopIndex]?.en}</div>
                            </div>
                        </section>

                        <section
                            ref={stopNameContainerRef}
                            className="dpip-main-this-stop-big-name-container">
                            {bigStopContent === stopNameZh ?
                                <span
                                    ref={stopNameZhRef}
                                    style={adjustStopFontSize()}
                                    className="dpip-main-this-stop-big-name-zh"
                                >
                                    {bigStopContent}
                                </span> :
                                <span
                                    ref={stopNameEnRef}
                                    // style={adjustStopFontSize()}
                                    className="dpip-main-this-stop-big-name-en"
                                >
                                    {bigStopContent}
                                </span>}
                        </section>

                        {/* Driver info */}
                        <section className="dpip-main-driver-section">
                            九巴仔正為您服務 &nbsp; KMB Boy is serving you
                            &nbsp;&nbsp; 員工編號 &nbsp;Emp. No: 1933
                        </section>
                    </div>
                </div>
            </div>
        </>

    )
}
import './App.css'
import { useState, useCallback, useEffect } from "react"
import Arrow from "../public/arrow.svg?react"

{/* DPIP main screen with full details */ }
export const DPIPMainScreen = ({ detail, currentStopIndex }) => {

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [stopNameContainerWidth, setStopNameContainerWidth] = useState(0)
    const [stopNameWidth, setStopNameWidth] = useState(0)

    const handleWindowSizeChange = () => setWindowWidth(window.innerWidth)

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange)
        return () => window.removeEventListener('resize', handleWindowSizeChange)
    }, [])

    const stopNameContainerRef = useCallback(node => {
        if (node != null)
            setStopNameContainerWidth(node.getBoundingClientRect().width)
    }, [])

    const stopNameRef = useCallback(node => {
        if (node != null)
            setStopNameWidth(node.getBoundingClientRect().width)
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

    const adjustStopFontSize = () => {
        // console.log(stopNameWidth, stopNameContainerWidth)
        // When stops name longer than container, adjust name font size with one line display
        if (stopNameWidth > stopNameContainerWidth) {
            const emRatio = 4.5
            const overflowRatio = stopNameWidth / stopNameContainerWidth
            const currentFontSize =
                windowWidth <= 540 ? 8 :
                    windowWidth <= 767 ? 10 :
                        windowWidth <= 1024 ? 12 :
                            windowWidth <= 1280 ? 16 : 16
            const newFontSize = currentFontSize * emRatio / overflowRatio

            console.log(`container: ${stopNameContainerWidth}, text: ${stopNameWidth}, ratio: ${overflowRatio}, Change to ${newFontSize} px`)

            return {
                fontSize: `${newFontSize}px`,
                whiteSpace: "normal",
            }
        }
    }

    return (
        <>
            <div className='dpip-monitor-screen'>
                <div className='dpip-monitor-container'>
                    <div className="dpip-main-monitor-bg">

                        {/* Route and destination info */}
                        <div className="dpip-main-route-section">
                            <div style={
                                adjustRouteFontSize(detail?.route)}
                                className='dpip-route-display'>
                                {detail?.route}
                            </div>
                            <div className="dpip-main-route-arrow">
                                <Arrow />
                            </div>
                            <div className='dpip-main-dest-info'>
                                <div className="dpip-main-dest-info-zh">
                                    {detail?.stops?.[lastStopIndex].zh}
                                </div>
                                <div className="dpip-main-dest-info-en">
                                    {detail?.stops?.[lastStopIndex].en}
                                </div>
                            </div>
                        </div>

                        {/* Next 3 stops info */}
                        <div className="dpip-main-stop-detail-section">
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
                        </div>

                        <div
                            ref={stopNameContainerRef}
                            className="dpip-main-this-stop-big-name-container">
                            <span
                                ref={stopNameRef}
                                style={adjustStopFontSize()}
                                className="dpip-main-this-stop-big-name"
                            >
                                {detail?.stops?.[currentStopIndex]?.zh}
                            </span>
                        </div>

                        {/* Driver info */}
                        <div className="dpip-main-driver-section">
                            九巴仔正為您服務 &nbsp; KMB Boy is serving you
                            &nbsp;&nbsp; 員工編號 &nbsp;Emp. No: 1933
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
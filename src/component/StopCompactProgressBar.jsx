import "../Animation.css"
import { useContext, useEffect, useRef, useState } from "react"
import { routeContext } from "../context/Provider"

// Tailwind CSS classes for the component
const styleClasses = {
    container: "@container line-container w-[98%] relative",
    stopInfoRow: "flex justify-around gap-0.5",
    stopInfoCol: "flex flex-col basis-[33%]",
    stopZh: "relative text-[2.5cqw] top-[-16cqw] truncate",
    stopZhCurrent: "font-bold",
    stopEn: "relative text-[1.5cqw] top-[-16cqw] truncate",
    stopEnCurrent: "font-black",
    stopEnOther: "text-black",
    progressBar: "line flex justify-around bg-[#FF0000] w-full h-[1.5cqw] absolute top-[-4cqw] z-0",
    bullet: "bullet bg-white w-[1.5cqw] h-[1.5cqw] max-sm:w-[1.75cqw] max-sm:h-[1.75cqw] border-[1px] border-solid rounded-[50%] relative z-1 shrink-0",
    bulletPulse: "outline outline-[0.15cqw] outline-white border-[0.15cqw] border-[#FF0000] !bg-[#FFFF00] scale-125",
    arrowContainer: "absolute -translate-x-[42cqw]",
    arrowFirst: "absolute left-0 w-[1.5cqw] h-[1.5cqw] border-t-[0.25vw] border-r-[0.25vw] border-t-white border-r-white rotate-45",
    arrowSecond: "absolute left-[1.75cqw] w-[1.5cqw] h-[1.5cqw] border-t-[0.25vw] border-r-[0.25vw] border-t-white border-r-white rotate-45",
    arrowThird: "absolute left-[3.5cqw] w-[1.5cqw] h-[1.5cqw] border-t-[0.25vw] border-r-[0.25vw] border-t-white border-r-white rotate-45"
}

const arrowStageInterval = 750

export const StopCompactProgressBar = ({ barRef }) => {
    const { routeDetail, currentStopIndex } = useContext(routeContext)
    const [arrowStage, setArrowStage] = useState(0)
    const intervalRef = useRef(null)

    useEffect(() => {
        setArrowStage(0)

        if (intervalRef.current) clearInterval(intervalRef.current)

        intervalRef.current = setInterval(() => {
            setArrowStage(prev => (prev < 3 ? prev + 1 : 0))
        }, arrowStageInterval)

        return () => clearInterval(intervalRef.current)
    }, [currentStopIndex])

    return (
        <div ref={barRef}>
            <div className={styleClasses.container}>

                {/* Stop info above progress bar */}
                <div className={styleClasses.stopInfoRow}>
                    {[0, 1, 2].map((offset) => {
                        const stop = routeDetail?.stops?.[currentStopIndex + offset];
                        return (
                            <div className={styleClasses.stopInfoCol} key={offset}>
                                <div
                                    className={[
                                        styleClasses.stopZh,
                                        offset === 0 && styleClasses.stopZhCurrent
                                    ].filter(Boolean).join(" ")}>
                                    {stop?.zh}
                                </div>
                                <div
                                    className={[
                                        styleClasses.stopEn,
                                        offset === 0 ? styleClasses.stopEnCurrent : styleClasses.stopEnOther
                                    ].filter(Boolean).join(" ")}>
                                    {stop?.en}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Progress Bar: Arrow, Line and bullet */}
                <div className={styleClasses.progressBar}>
                    <div className={styleClasses.arrowContainer}>
                        {arrowStage >= 1 && <div className={styleClasses.arrowFirst}></div>}
                        {arrowStage >= 2 && <div className={styleClasses.arrowSecond}></div>}
                        {arrowStage >= 3 && <div className={styleClasses.arrowThird}></div>}
                    </div>

                    {[0, 1, 2].map((idx) => (
                        <div
                            key={idx}
                            className={[
                                styleClasses.bullet,
                                idx === 0 && styleClasses.bulletPulse
                            ].filter(Boolean).join(" ")}>
                        </div>
                    ))}
                </div>

            </div>
        </div>

    )
}
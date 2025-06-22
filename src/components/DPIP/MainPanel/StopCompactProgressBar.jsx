import "@css/animation.css"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"

// Tailwind CSS classes for the component
const styles = {
    container: "@container line-container w-full relative",
    stopInfoRow: "flex justify-around gap-0.5",
    stopInfoCol: "flex flex-col basis-[33%]",
    stopZh: "relative text-[2.5cqw] top-[-16cqw] truncate",
    stopZhCurrent: "font-bold",
    stopEn: "relative text-[1.5cqw] top-[-16cqw] truncate",
    stopEnCurrent: "font-black",
    stopEnOther: "text-black",
    progressBar: "line flex justify-around bg-[#FF0000] w-[87.5%] h-[1.5cqw] absolute top-[-4cqw] z-0",
    bullet: "bullet bg-white translate-x-[2cqw] w-[1.5cqw] h-[1.5cqw] max-sm:w-[1.75cqw] max-sm:h-[1.75cqw] border-[1px] border-solid rounded-[50%] relative z-1 shrink-0",
    bulletPulse: "outline outline-[0.15cqw] outline-white border-[0.15cqw] border-[#FF0000] !bg-[#FFFF00] scale-125",
    bulletSecond: "translate-x-[7cqw]",
    bulletThird: "translate-x-[11cqw]",
    arrowContainer: "absolute -translate-x-[37.5cqw]",
    arrowFirst: "absolute left-0 w-[1.5cqw] h-[1.5cqw] border-t-[0.25vw] border-r-[0.25vw] border-t-white border-r-white rotate-45",
    arrowSecond: "absolute left-[1.75cqw] w-[1.5cqw] h-[1.5cqw] border-t-[0.25vw] border-r-[0.25vw] border-t-white border-r-white rotate-45",
    arrowThird: "absolute left-[3.5cqw] w-[1.5cqw] h-[1.5cqw] border-t-[0.25vw] border-r-[0.25vw] border-t-white border-r-white rotate-45",
    endIndicator: "h-[1.75cqw] border-1 border-solid border-red-600 rounded-[1px]",
    endIndicatorContainer: "absolute right-[-4%] top-1/2 -translate-y-1/2 flex gap-[1px] z-10",
}

const arrowStageInterval = 750

export const StopCompactProgressBar = ({ progressBarRef }) => {
    const { routeDetail, currentStopIndex } = useSelector(state => state.routeSelection)
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
        <div ref={progressBarRef}>
            <div className={styles.container}>

                {/* Stop info above progress bar */}
                <div className={styles.stopInfoRow}>
                    {[0, 1, 2].map((offset) => {
                        const stop = routeDetail?.stops?.[currentStopIndex + offset]
                        return (
                            <div className={styles.stopInfoCol} key={offset}>
                                <div
                                    className={[
                                        styles.stopZh,
                                        offset === 0 && styles.stopZhCurrent
                                    ].filter(Boolean).join(" ")}>
                                    {stop?.zh}
                                </div>
                                <div
                                    className={[
                                        styles.stopEn,
                                        offset === 0 ? styles.stopEnCurrent : styles.stopEnOther
                                    ].filter(Boolean).join(" ")}>
                                    {stop?.en}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Progress Bar: Arrow, Line and bullet */}
                <div className={styles.progressBar}>
                    <div className={styles.arrowContainer}>
                        {arrowStage >= 1 && <div className={styles.arrowFirst}></div>}
                        {arrowStage >= 2 && <div className={styles.arrowSecond}></div>}
                        {arrowStage >= 3 && <div className={styles.arrowThird}></div>}
                    </div>

                    {[0, 1, 2].map((idx) => (
                        <div
                            key={idx}
                            className={[
                                styles.bullet,
                                idx === 0 ? styles.bulletPulse :
                                    idx === 1 ? styles.bulletSecond :
                                        styles.bulletThird
                            ].filter(Boolean).join(" ")}>
                        </div>
                    ))}

                    <div className={styles.endIndicatorContainer}>
                        <div className={`${styles.endIndicator} w-[0.25vw]`}></div>
                        <div className={`${styles.endIndicator} w-[0.375vw]`}></div>
                        <div className={`${styles.endIndicator} w-[0.5vw]`}></div>
                    </div>
                </div>

            </div>
        </div>

    )
}
import './App.css'
import { useState, useEffect } from "react"
import TripleArrow from "../src/triple_arrow.svg?react"

{/* DPIP main screen with full details */ }
export const DPIPMainScreen = ({ detail, currentStopIndex, userPreference, containerStyle }) => {

    const nextStopIndex = currentStopIndex + 1
    const nextNextStopIndex = nextStopIndex + 1
    const lastStopIndex = detail?.stops?.length - 1
    const stopNameZh = detail?.stops?.[currentStopIndex]?.zh
    const stopNameEn = detail?.stops?.[currentStopIndex]?.en

    const [nextStopName, setNextStopName] = useState(stopNameZh)

    useEffect(() => {
        setNextStopName(stopNameZh)
        // Switch the content after 3 seconds
        const interval = setInterval(() => {
            setNextStopName(prevContent =>
                prevContent === stopNameZh ?
                    stopNameEn : stopNameZh)
        }, 4000)
        return () => { clearInterval(interval) }
    }, [detail, currentStopIndex])

    return (
        <>
            {/* --- Screen Monitor Grid Layout --- */}
            <div className={`grid grid-rows-[0.5fr_1.85fr_0.0375fr_1fr_0.125fr]
            w-[50rem] h-[30rem] max-sm:h-[20rem] max-md:h-[25rem]
                ${containerStyle[userPreference.containerStyle]}`}>

                {/* --- Next stop Indicator --- */}
                <div className={`@container col-start-1 col-end-2 flex flex-col text-center 
                    ${userPreference.stopPressed ? `bg-[#FF0000] text-white` : `bg-[#FFFF00] text-black`}`}>
                    <div className={`max-sm:text-[18cqw] text-[15cqw] font-[600] `}>
                        下一站{userPreference.stopPressed && `停於`}</div>
                    <div className={`max-sm:text-[10cqw] text-[7.5cqw] font-[400] `}>
                        Next {userPreference.stopPressed ? `Stopping at` : `Stop`}</div>
                </div>

                {/* --- Route Number & Destination --- */}
                <div className="@container col-start-2 col-end-5 flex items-center bg-black text-white">
                    <div className='text-center flex flex-col item-center 
                    basis-[5rem] max-lg:basis-[3.5rem]'>
                        <div className="font-[500] max-sm:text-[4cqw] 
                        text-[4cqw] tracking-tighter">路線</div>
                        <div className="max-sm:text-[3cqw] text-[2.75cqw] tracking-tighter">Route</div>
                    </div>
                    <div className="font-[500] max-sm:text-[8cqw] text-[7cqw] text-center tracking-tighter 
                    basis-[7rem] max-md:basis-[4.5rem]">
                        {detail.route}</div>
                    <div className='flex justify-center basis-[4.5rem] 
                    max-sm:basis-[2.5rem] max-lg:basis-[3.5rem]'>
                        <TripleArrow />
                    </div>
                    <div className='flex flex-col pl-[0.5rem]'>
                        <div className='max-sm:text-[5cqw] max-md:text-[4.5cqw] text-[4.5cqw] font-[500] whitespace-nowrap'>{detail?.stops?.[lastStopIndex].zh}</div>
                        <div className="max-sm:text-[2.5cqw] max-md-[2.25cqw] text-[2.25cqw] font-[500] text-sm whitespace-nowrap">{detail?.stops?.[lastStopIndex].en}</div>
                    </div>
                </div>

                {/* --- This stop & 2 next stop & stop indicator line --- */}
                <div className="col-start-1 col-end-5 bg-white">
                    <div className='relative top-[30%] font-[400] 
                    text-center tracking-tighter'>

                        <div className='@container absolute w-1/3'>
                            <div className='max-xs:text-[11cqw] text-[9cqw] 
                            whitespace-nowrap overflow-hidden text-ellipsis'>
                                {detail?.stops?.[currentStopIndex]?.zh}
                            </div>
                            <div className='max-xs:text-[7cqw] text-[5cqw]
                            whitespace-nowrap overflow-hidden text-ellipsis'>
                                {detail?.stops?.[currentStopIndex]?.en}</div>
                        </div>

                        <div className='@container absolute left-[33%] w-1/3'>
                            <div className='max-xs:text-[11cqw] text-[9cqw] 
                            whitespace-nowrap overflow-hidden text-ellipsis'>
                                {detail?.stops?.[nextStopIndex]?.zh}
                            </div>
                            <div className='max-xs:text-[7cqw] text-[5cqw] 
                            whitespace-nowrap overflow-hidden text-ellipsis'>
                                {detail?.stops?.[nextStopIndex]?.en}
                            </div>
                        </div>

                        <div className='@container absolute left-[66%] w-1/3 '>
                            <div className='max-xs:text-[11cqw] text-[9cqw] 
                            whitespace-nowrap overflow-hidden text-ellipsis'>
                                {detail?.stops?.[nextNextStopIndex]?.zh}
                            </div>
                            <div className='max-xs:text-[7cqw] text-[5cqw] 
                            whitespace-nowrap overflow-hidden text-ellipsis'>
                                {detail?.stops?.[nextNextStopIndex]?.en}
                            </div>
                        </div>
                    </div>

                    {/* Red line */}
                    <div className='relative top-[73%] flex justify-around w-[95%] h-2 bg-red-600'>
                        <div className='relative w-2 h-2 outline-white outline-double rounded-[50%] bg-yellow-300'></div>
                        <div className='left-[1rem] relative w-2 h-2 border-solid rounded-[50%] bg-white'></div>
                        <div className='left-[2rem] relative w-2 h-2 border-solid rounded-[50%] bg-white'></div>
                    </div>
                </div>

                {/* --- Horizontal divider line --- */}
                <div className="col-start-1 col-end-5 bg-black"></div>

                {/* --- Big next stop name --- */}
                <div className="@container col-start-1 col-end-5 bg-white flex justify-center items-center">
                    <span className='font-[500] max-sm:text-[8.5cqw] max-md:text-[10cqw] text-[10cqw] 
                    whitespace-nowrap overflow-hidden'>
                        {/* {stopNameZh} */}
                        {nextStopName}
                    </span>
                </div>

                {/* --- Driver Info --- */}
                <div className={`@container flex justify-center col-start-1 col-end-5 font-extralight text-white p-1
                  ${userPreference.stopPressed ? `bg-[#FF0000]` : `bg-black`}`}>
                    <span className="max-md:text-[2.25cqw]">
                        {userPreference?.driverInfo?.nameZh}車長正為您服務 &nbsp; Bus Captain&nbsp;
                    </span>
                    <span className="max-md:text-[2.25cqw] capitalize">
                        {userPreference?.driverInfo?.nameEn}&nbsp;
                    </span>
                    <span className="max-md:text-[2.25cqw]">is serving you &nbsp;&nbsp;
                        員工編號 &nbsp;Emp. No: {userPreference?.driverInfo?.staffNo}</span>
                </div>

            </div >
        </>
    )
}


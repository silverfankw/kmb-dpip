import './App.css'
import { useRef, useState, useEffect, useCallback } from "react"
import { Arrow } from './component/Arrow'

{/* DPIP main screen with full details */ }
export const DPIPMainScreen = ({ detail, currentStopIndex, userPreference }) => {

    const containerStyle = {
        basic: "border-[.5em] border-solid border-[#0e0e0fbf] rounded-xl outline outline-[1rem] outline-black",
        new: "border-solid border-black "
    }

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
                prevContent === detail?.stops?.[currentStopIndex]?.zh ?
                    detail?.stops?.[currentStopIndex]?.en :
                    detail?.stops?.[currentStopIndex]?.zh)
        }, 4000)
        return () => { clearInterval(interval) }
    }, [detail, currentStopIndex])

    return (
        <>
            {/* --- Screen Monitor Grid Layout --- */}
            <div className={`grid grid-rows-[0.6fr_2fr_0.05fr_1.25fr_0.25fr]
             2xl:w-[50%]
             sm:max-w-full md:max-w-full lg:max-w-full xl:max-w-full
            h-[30rem] 
                ${containerStyle[userPreference.containerStyle]}`}>

                {/* --- Next stop Indicator --- */}
                <div className={`col-start-1 col-end-3 flex flex-col text-center 
                    ${userPreference.stopPressed ? `bg-[#FF0000] text-white` : `bg-[#FFFF00] text-black`}`}>
                    <div className={`font-[800] text-[1.875rem] `}>
                        下一站{userPreference.stopPressed && `停於`}</div>
                    <div className={`font-[500] text-[1rem]`}>
                        Next {userPreference.stopPressed ? `Stopping at` : `Stop`}</div>
                </div>

                {/* --- Route Number & Destination --- */}
                <div className="col-start-3 col-end-5 flex items-center bg-black text-white">
                    <div className='text-center flex flex-col item-center basis-[4rem]'>
                        <div className="font-semibold text-[1.625rem] tracking-tighter">路線</div>
                        <div className="text-md tracking-tighter">Route</div>
                    </div>
                    <div className="font-medium text-[3rem] text-center tracking-tighter basis-[6rem]">
                        {detail.route}</div>
                    <div className='basis-[4rem] pl-1.5'>
                        <Arrow direction='right' size="l" stroke="m" style={"ml-[-.25rem]"} />
                        <Arrow direction='right' size="l" stroke="m" style={"ml-[-.625rem]"} />
                        <Arrow direction='right' size="l" stroke="m" style={"ml-[-.625rem]"} />
                    </div>
                    <div className='@container/terminus flex flex-col pl-3 '>
                        <div className='@sm/terminus:text-sm font-[500] text-3xl whitespace-nowrap'>{detail?.stops?.[lastStopIndex].zh}</div>
                        <div className="font-[500] text-sm whitespace-nowrap">{detail?.stops?.[lastStopIndex].en}</div>
                    </div>
                </div>

                {/* --- This stop & 2 next stop & stop indicator line --- */}
                <div className="col-start-1 col-end-5 bg-white">
                    <div className='relative top-[30%] font-[400] text-center tracking-tighter'>
                        <div className='@container/firststop absolute w-1/3 overflow-hidden'>
                            <div className='
                            @xs/firststop:text-[1cqw]
                            @md/firststop:text-[1.5cqw]
                            @xl/firststop:text-[1.75cqw] @lg/firststop:text-red-700
                            @4xl/firststop:text-[2cqw] '>
                                {detail?.stops?.[currentStopIndex]?.zh}
                            </div>
                            <div className='text-[0.75rem]'>{detail?.stops?.[currentStopIndex]?.en}</div>
                        </div>
                        <div className='absolute left-[33%] w-1/3 overflow-hidden'>
                            <div className='text-[1.75cqw]'>{detail?.stops?.[nextStopIndex]?.zh}</div>
                            <div className='text-[0.75rem]'>{detail?.stops?.[nextStopIndex]?.en}</div>
                        </div>
                        <div className='absolute left-[66%] w-1/3 overflow-hidden'>
                            <div className='text-[1.75cqw]'>{detail?.stops?.[nextNextStopIndex]?.zh}</div>
                            <div className='text-[0.75em]'>{detail?.stops?.[nextNextStopIndex]?.en}</div>
                        </div>
                    </div>
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
                    <span className='text-[9cqw] whitespace-nowrap overflow-hidden'>{stopNameZh}</span>
                </div>

                {/* --- Driver Info --- */}
                <div className={`col-start-1 col-end-5 text-white p-1 text-[1rem] font-extralight text-center ${userPreference.stopPressed ? `bg-[#FF0000]` : `bg-black`}`}>
                    {userPreference?.driverInfo?.nameZh}車長正為您服務 &nbsp; Bus Captain {userPreference?.driverInfo?.nameEn} is serving you
                    &nbsp;&nbsp; 員工編號 &nbsp;Emp. No: {userPreference?.driverInfo?.staffNo}
                </div>
            </div >
        </>
    )
}


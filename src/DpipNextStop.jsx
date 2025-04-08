import { useState, useEffect } from "react"


export const DpipNextStop = ({ stopZh, stopEn }) => {

    // const charFilterRegex = new RegExp(
    //     '[A-Za-z0-9_\]+|' +                             // ASCII letters (no accents)
    //     '[\u4E00-\u9FFF\uF900-\uFAFF\u3400-\u4DBF]',   // Single CJK ideographs
    //     'g')

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const zhFontEmRatio = windowWidth < 540 ? 2.25 :
        windowWidth < 640 ? 2.375 :
            windowWidth < 768 ? 3 :
                windowWidth < 1024 ? 3.5 : 3.75

    const enFontEmRatio = windowWidth < 640 ? 1 :
        windowWidth < 768 ? 1.25 :
            windowWidth < 1024 ? 1.375 : 1.5

    const handleWindowSizeChange = () => setWindowWidth(window.innerWidth)

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange)
        return () => window.removeEventListener('resize', handleWindowSizeChange)
    }, [])

    const computeStopNameWidth = (type) => {

        const stopNameFullLen = type == "zh" ? stopZh?.length : stopEn?.length ?? 0
        // console.log(stopNameFullLen)

        // Terminate function if no stop name is ready
        if (stopNameFullLen == 0) { return }

        // If stop name chinese length too long, scale down the font size
        if (type == "zh" && stopNameFullLen >= 13) {
            if (stopNameFullLen >= 14)
                return { fontSize: `${zhFontEmRatio * 0.75}rem` }
            else
                return { fontSize: `${zhFontEmRatio * 0.85}rem` }
        }

        // If stop name english length too long, scale down the font size
        if (type == "en" && stopNameFullLen >= 50) {
            return { fontSize: `${enFontEmRatio * 0.8}rem` }
        }
    }

    return (
        <>
            {/* Horizontal gray divider line */}
            <div className="col-start-1 col-end-5 bg-[#eee8eba3]"></div>

            {/* White circle spot */}
            <div className={`@container flex flex-col items-center justify-center bg-[#FF0000]`}>
                <div className='inline-block rounded-[50%] bg-white 
                w-[65cqw] h-[65cqw]'></div>
            </div>

            {/* Stop name container */}
            <div className={`relative flex flex-col bg-white tracking-[-0.0375rem]`}>

                {/* Stop name content */}
                <div className="font-[500] relative flex flex-col left-[1.5%] h-[90%] whitespace-nowrap">

                    <span
                        className="max-xs:text-[2.25rem] 
                        xs:max-sm:text-[2.375rem] sm:max-md:text-[3rem] md:max-lg:text-[3.5rem]
                        lg:max-xl:text-[3.75rem] text-[3.75rem]"
                        style={computeStopNameWidth("zh")}
                    >
                        {stopZh ?? ""}
                    </span>

                    <span
                        className="absolute top-[75%] max-xs:text-[1rem] 
                        xs:max-sm:text-[1rem] sm:max-md:text-[1.25rem] md:max-lg:text-[1.375rem]
                        lg:max-xl:text-[1.5rem] text-[1.5rem]"
                        style={computeStopNameWidth("en")}
                    >
                        {stopEn ?? ""}
                    </span>

                </div>
            </div >
        </>
    )
}
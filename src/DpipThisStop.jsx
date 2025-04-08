import { useState, useEffect } from "react"

export const DpipThisStop = ({ stopZh, stopEn }) => {

    const handleWindowSizeChange = () => {
        setWindowWidth(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange)
        return () => window.removeEventListener('resize', handleWindowSizeChange)
    }, [])

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const zhFontEmRatio = windowWidth < 540 ? 2.25 :
        windowWidth < 640 ? 2.375 :
            windowWidth < 768 ? 3 :
                windowWidth < 1024 ? 3.5 : 3.75

    const enFontEmRatio = windowWidth < 640 ? 1 :
        windowWidth < 768 ? 1.25 :
            windowWidth < 1024 ? 1.375 : 1.5


    const computeStopNameWidth = (type) => {

        const stopNameFullLen = type == "zh" ? stopZh?.length : stopEn?.length ?? 0
        // console.log(stopNameFullLen)

        // Terminate function if no stop name is ready
        if (stopNameFullLen == 0) { return }

        // If stop name chinese length too long, scale down the font size
        if (type == "zh" && stopNameFullLen >= 12) {
            if (stopNameFullLen >= 14)
                return { fontSize: `${zhFontEmRatio * 0.75}rem` }
            else
                return { fontSize: `${zhFontEmRatio * 0.85}rem` }
        }

        // If stop name english length too long, scale down the font size
        if (type == "en" && stopNameFullLen >= 35) {
            if (stopNameFullLen >= 45)
                return { fontSize: `${enFontEmRatio * 0.95}rem` }
            else
                return { fontSize: `${enFontEmRatio * 0.95}rem` }
        }
    }


    return (
        <div className='font-[500] relative width-[95%] h-[75%] left-[1.5%] tracking-[-0.0625rem]'>

            <div>
                <span className="max-xs:text-[2.5rem] 
                        xs:max-md:text-[3.25rem] md:max-lg:text-[4rem]
                        lg:max-xl:text-[4.5rem] text-[4.5rem]"
                    style={computeStopNameWidth("zh")}
                >
                    {stopZh}
                </span>
            </div>

            <div className="absolute top-[80%] whitespace-nowrap">
                <span
                    className="max-xs:text-[1.25rem] 
                        xs:max-md:text-[1.5rem] md:max-lg:text-[1.75rem]
                        lg:max-xl:text-[2rem] text-[2rem] "
                    style={computeStopNameWidth("en")}
                >
                    {stopEn}
                </span>
            </div>

        </div>
    )
}
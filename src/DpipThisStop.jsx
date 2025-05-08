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

    const charFilterRegex = /[\u2E80-\u2FD5\u3190-\u319f\u3400-\u4DBF\u4E00-\u9FCC\uF900-\uFAAD]/g
    const fullWidthSymbolRegex = /[（）]/g

    const zhFontEmRatio = windowWidth < 640 ? 2.75 :
        windowWidth < 768 ? 3 :
            windowWidth < 1280 ? 3.5 : 3.75

    const enFontEmRatio = windowWidth < 640 ? 1 :
        windowWidth < 768 ? 1.25 :
            windowWidth < 1280 ? 1.375 : 1.5


    const computeStopNameWidth = (type) => {

        // Possible stop name overflow conditions:
        // 1. Chinese Stop Name with >= 12 length (e.g. 伊利沙伯中學舊生會湯國華中學)
        // 2. Chinese Stop Name >= 8 length & full-width symbol >= 2 (e.g. 鰂魚涌（英皇道）總站)
        // 3. Chinese Stop Name with >= 10 pure chinese word length (e.g. 大窩口轉車站 - 大窩口站 (A2))

        const stopNameFullLen = type == "zh" ? stopZh?.length : stopEn?.length ?? 0
        const chineseOnlyLen = stopZh?.match(charFilterRegex).length ?? 0 // > 9 will overflow
        const fullWidthSymbolLen = stopZh?.match(fullWidthSymbolRegex)?.length ?? 0
        // console.log(stopNameFullLen, chineseOnlyLen, fullWidthSymbolLen)

        const overflowCondition =
            stopNameFullLen >= 12 || chineseOnlyLen >= 10 ||
            (chineseOnlyLen >= 8 && fullWidthSymbolLen >= 2)

        // Terminate function if no stop name is ready
        if (stopNameFullLen == 0) { return }

        // If stop name chinese length too long, scale down the font size
        if (type == "zh" && overflowCondition) {
            if (stopNameFullLen >= 14)
                return { fontSize: `${zhFontEmRatio * 0.7}rem`, top: "14px" }
            else
                return { fontSize: `${zhFontEmRatio * 0.95}rem`, top: "10px" }
        }

        // If stop name english length too long, scale down the font size
        if (type == "en" && stopNameFullLen >= 34) {
            if (stopNameFullLen >= 44)
                return { fontSize: `${enFontEmRatio * 1.05}rem` }
            else
                return { fontSize: `${enFontEmRatio * 1.1}rem` }
        }
    }


    return (
        <div className='font-[500] relative width-[95%] h-[75%] left-[1.5%] tracking-[-0.0625rem]'>

            <div>
                <div className="relative 
                    max-sm:text-[3rem] max-sm:top-[3px]
                        sm:max-md:text-[3.375rem] 
                        md:max-xl:text-[4rem] text-[4.5rem]"
                    style={computeStopNameWidth("zh")}
                >
                    {stopZh}
                </div>
            </div>

            <div className="absolute top-[80%] whitespace-nowrap">
                <span
                    className="max-md:text-[1.5rem] 
                        md:max-xl:text-[1.75rem] 
                        text-[2rem] "
                    style={computeStopNameWidth("en")}
                >
                    {stopEn}
                </span>
            </div>

        </div>
    )
}
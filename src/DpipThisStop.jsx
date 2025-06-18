import { useWindowWidth } from './hooks/useWindowWidth'

// Regular expressions to filter out Chinese characters and full-width symbols
const charFilterRegex = /[\u2E80-\u2FD5\u3190-\u319f\u3400-\u4DBF\u4E00-\u9FCC\uF900-\uFAAD]/g

// Full-width symbols that need to be counted separately
const fullWidthSymbolRegex = /[（）]/g

// To compute the style for stop names based on their type and length
const computeStopNameStyle = (type, stopZh = "", stopEn = "", windowWidth) => {

    const zhFontEmRatio = windowWidth < 768 ? 8.5 : windowWidth < 1280 ? 9 : 10
    const enFontEmRatio = windowWidth < 640 ? 1.8 : windowWidth < 768 ? 1.625 : 1.75

    const stopName = type === "zh" ? stopZh : stopEn
    const stopNameFullLen = stopName?.length ?? 0

    // Count Chinese characters and full-width symbols
    const chineseOnlyLen = stopZh?.match(charFilterRegex)?.length ?? 0
    const fullWidthSymbolLen = stopZh?.match(fullWidthSymbolRegex)?.length ?? 0

    // Check if the stop name exceeds the overflow condition
    // 12 characters for Chinese, 10 for Chinese + full-width symbols, or 8 for Chinese + 2 full-width symbols
    const overflowCondition =
        stopNameFullLen >= 12 || chineseOnlyLen >= 10 ||
        (chineseOnlyLen >= 8 && fullWidthSymbolLen >= 2)

    if (stopNameFullLen === 0) return {}

    if (type === "zh" && overflowCondition) {
        if (stopNameFullLen >= 14)
            return { fontSize: `${zhFontEmRatio * 0.7}cqw`, top: "15px" }
        else
            return { fontSize: `${zhFontEmRatio * 0.95}cqw`, top: "5px" }
    }

    if (type === "en" && stopNameFullLen >= 34) {
        if (stopNameFullLen >= 44)
            return { fontSize: `${enFontEmRatio * 2}cqw` }
        else
            return { fontSize: `${enFontEmRatio * 2.4}cqw` }
    }

    return {}
}

export const DpipThisStop = ({ stopZh = "", stopEn = "" }) => {

    const windowWidth = useWindowWidth()

    return (
        <div className='@container font-[500] relative width-[95%] h-[75%] 
        left-[1.5%] tracking-[-0.0625rem]'>
            <div>
                <div
                    className="relative 
                        max-sm:text-[10cqw] max-sm:top-[3px]
                        sm:max-md:text-[9.5cqw] 
                        md:max-xl:text-[9.75cqw] text-[10cqw]"
                    style={computeStopNameStyle("zh", stopZh, stopEn, windowWidth)}
                >
                    {stopZh}
                </div>
            </div>
            <div className="absolute top-[80%] whitespace-nowrap">
                <span
                    className="max-md:text-[4.25cqw] text-[4cqw]"
                    style={computeStopNameStyle("en", stopZh, stopEn, windowWidth)}
                >
                    {stopEn}
                </span>
            </div>
        </div>
    )
}
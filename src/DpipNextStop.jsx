import { useWindowWidth } from './hooks/useWindowWidth'

function computeFontStyle(type, stopName, windowWidth) {
    const zhFontEmRatio = windowWidth < 768 ? 7 : windowWidth < 1280 ? 7.5 : 8
    const enFontEmRatio = windowWidth < 768 ? 4 : windowWidth < 1280 ? 3.75 : 3.5

    const stopNameLen = stopName?.length ?? 0

    if (type === "zh" && stopNameLen >= 13) {
        return {
            fontSize: `${zhFontEmRatio * (stopNameLen >= 14 ? 0.8 : 0.9)}cqw`,
            top: "1cqw"
        }
    }
    if (type === "en" && stopNameLen >= 45) {
        return {
            fontSize: `${enFontEmRatio * (stopNameLen >= 50 ? 0.8 : 0.85)}cqw`
        }
    }
    return {}
}

export const DpipNextStop = ({ stopZh = "", stopEn = "" }) => {

    const windowWidth = useWindowWidth()

    return (
        <>
            {/* Horizontal gray divider line */}
            <div className="col-start-1 col-end-5 bg-[#f7f6f6c5]"></div>

            {/* White circle spot */}
            <div className={`@container flex flex-col items-center justify-center bg-[#FF0000]`}>
                <div className='inline-block rounded-[50%] bg-white 
                w-[65cqw] h-[65cqw]'></div>
            </div>

            {/* Stop name container */}
            <div className={`@container relative flex flex-col 
                bg-white tracking-[-0.0375rem]`}>

                {/* Stop name content */}
                <div className="font-[500] relative flex flex-col 
                left-[1.5%] h-[90%] whitespace-nowrap">

                    <div
                        className="relative top-[3px]
                        max-sm:text-[8cqw] sm:max-md:text-[6.325cqw] 
                        md:max-xl:text-[6.5cqw] text-[8cqw]"
                        style={computeFontStyle("zh", stopZh, windowWidth)}
                    >
                        {stopZh}
                    </div>

                    <span
                        className="absolute top-[75%] 
                        max-sm:text-[3.75cqw] sm:max-md:text-[3.5cqw] 
                        md:max-xl:text-[3.25cqw] text-[3.25cqw]"
                        style={computeFontStyle("en", stopEn, windowWidth)}
                    >
                        {stopEn}
                    </span>

                </div>
            </div >
        </>
    )
}
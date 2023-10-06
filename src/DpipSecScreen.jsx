import './App.css'

// Regex check chinese character for font size adjustment
const pattern = /([\u4e00-\u9fff\u3400-\u4dbf\ufa0e\ufa0f\ufa11\ufa13\ufa14\ufa1f\ufa21\ufa23\ufa24\ufa27\ufa28\ufa29\u3006\u3007]|[\ud840-\ud868\ud86a-\ud879\ud880-\ud887][\udc00-\udfff]|\ud869[\udc00-\udedf\udf00-\udfff]|\ud87a[\udc00-\udfef]|\ud888[\udc00-\udfaf])([\ufe00-\ufe0f]|\udb40[\udd00-\uddef])?/gm;

// Adjust font size depends on stop's name
const computeThisStopFontSize = (stopName) => {
    const zhCharLength = stopName.match(pattern)?.length ?? 0
    if (zhCharLength > 0) {
        if (zhCharLength >= 8 && stopName.length >= 10)
            return { "fontSize": "36px", "overflow": "hidden" }
        else if (zhCharLength >= 9)
            return { "fontSize": "46px", "overflow": "hidden" }
        else if (stopName.length >= 10) { return { "fontSize": "44px" } }
        return
    }
    else {
        if (stopName.length >= 32)
            return { "fontSize": "20px", "lineHeight": "85%", "top": "65%" }
        else if (stopName.length >= 30)
            return { "fontSize": "24px", "lineHeight": "85%", "top": "65%" }
    }
}

const computeNextStopFontSize = (stopName) => {
    const zhCharLength = stopName.match(pattern)?.length ?? 0
    if (zhCharLength > 0) {
        if (zhCharLength >= 14)
            return { "fontSize": "26px", "overflow": "hidden" }
        else if (zhCharLength.length >= 10) { return { "fontSize": "32px" } }
    }
    else if (stopName.length >= 40)
        return { "fontSize": "16px" }
}


{/* DPIP secondary screen with only 3 next stops */ }
export const DPIPSecScreen = ({ stops, currentStopIndex }) => {
    return (
        <>

            <div className="dpip_secondary_monitor_bg">
                <div className='dpip_monitor_screen'>
                    <div className='dpip_monitor_container'></div>
                </div>
                <div className='dpip_screen_this_stop_row'>
                    <div
                        className='this_stop_detail_zh'
                        style={computeThisStopFontSize(stops[currentStopIndex].name_zh)}
                    >
                        {stops[currentStopIndex].name_zh}
                    </div>
                    <div
                        className='this_stop_detail_en'
                        style={computeThisStopFontSize(stops[currentStopIndex].name_en)}>
                        {stops[currentStopIndex].name_en}
                    </div>
                </div>

                {/* <div className='dpip_screen_next_stop_row' > */}

                {stops.slice(currentStopIndex + 1, currentStopIndex + 3).map((stop, index) => {
                    return (
                        <div className={`dpip_screen_next_stop_row_${index + 1}`} >
                            <div
                                className='next_stop_detail_zh'
                                style={computeNextStopFontSize(stop?.name_zh)}>
                                {stop.name_zh}
                            </div>
                            <div className='next_stop_detail_en'
                                style={computeNextStopFontSize(stop?.name_en)}>
                                {stop.name_en}
                            </div>
                        </div>
                    )

                })}
            </div>
            {/* </div > */}


        </>
    )
}
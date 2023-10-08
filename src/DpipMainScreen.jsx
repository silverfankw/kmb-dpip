import './App.css'

{/* DPIP main screen with full details */ }
export const DPIPMainScreen = ({ detail, currentStopIndex }) => {

    const nextStopIndex = currentStopIndex + 1
    const nextNextStopIndex = nextStopIndex + 1

    const lastStopIndex = detail?.stops?.length - 1

    const routeFontSizeAdjust = route => {
        switch (route?.length) {
            case 1:
                return { "left": "2.25em" }
            case 2:
                return { "left": "2em" }
            case 3:
                return { "left": "1.75em" }
            case 4:
                return { "left": "1.4125em" }
            default:
                return { "left": "1.85em" }
        }
    }

    return (
        <>
            <div className="fill-content-div">
                <div className='dpip_monitor_screen'>
                    <div className='dpip_monitor_container'>
                        <div className="dpip_main_monitor_bg">

                            {/* Route and destination info */}
                            <div className="dpip_main_route_info">
                                <div style={
                                    routeFontSizeAdjust(detail?.route)}
                                    className='dpip_route_display'>
                                    {detail?.route}
                                </div>
                                <div className='dpip_main_dest_info'>
                                    <div className="dpip_main_dest_info_zh">
                                        {detail?.stops?.[lastStopIndex].zh}
                                    </div>
                                    <div className="dpip_main_dest_info_en">
                                        {detail?.stops?.[lastStopIndex].en}
                                    </div>
                                </div>
                            </div>

                            {/* Next 3 stops info */}
                            <div className="dpip_main_stop_detail_info">
                                <div className='dpip_main_this_stop_name'>
                                    <div className='dpip_main_stop_name_zh'>{detail?.stops?.[currentStopIndex]?.zh}</div>
                                    <div className='dpip_main_stop_name_en'>{detail?.stops?.[currentStopIndex]?.en}</div>
                                </div>
                                <div className='dpip_main_next_stop_name'>
                                    <div className='dpip_main_stop_name_zh'>{detail?.stops?.[nextStopIndex]?.zh}</div>
                                    <div className='dpip_main_stop_name_en'>{detail?.stops?.[nextStopIndex]?.en}</div>
                                </div>
                                <div className='dpip_main_next_next_stop_name'>
                                    <div className='dpip_main_stop_name_zh'>{detail?.stops?.[nextNextStopIndex]?.zh}</div>
                                    <div className='dpip_main_stop_name_en'>{detail?.stops?.[nextNextStopIndex]?.en}</div>
                                </div>
                            </div>

                            {/* Driver info */}
                            <div className="dpip_main_this_stop_big_name">歡迎乘搭九龍巴士</div>
                            <div className="dpip_main_driver_info">
                                陳車長正為您服務 &nbsp; Bus Captain Chan is serving you
                                &nbsp;&nbsp; 員工編號 &nbsp;Emp. No: 1933
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>

    )
}
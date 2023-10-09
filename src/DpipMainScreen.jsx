import './App.css'

{/* DPIP main screen with full details */ }
export const DPIPMainScreen = ({ detail, currentStopIndex }) => {

    const nextStopIndex = currentStopIndex + 1
    const nextNextStopIndex = nextStopIndex + 1

    const lastStopIndex = detail?.stops?.length - 1

    const adjustRouteFontSize = route => {
        switch (route?.length) {
            case 1:
                return { "left": "2.25em" }
            case 2:
                return { "left": "2em" }
            case 3:
                return { "left": "1.65em" }
            case 4:
                return { "left": "1.4125em" }
            default:
                return { "left": "1.85em" }
        }
    }

    const adjustDestFontSize = (dest) => {

    }

    return (
        <>
            <div className='dpip-monitor-screen'>
                <div className='dpip-monitor-container'>
                    <div className="dpip-main-monitor-bg">

                        {/* Route and destination info */}
                        <div className="dpip-main-route-info">
                            <div style={
                                adjustRouteFontSize(detail?.route)}
                                className='dpip-route-display'>
                                {detail?.route}
                            </div>
                            <div className='dpip-main-dest-info'>
                                <div className="dpip-main-dest-info-zh">
                                    {detail?.stops?.[lastStopIndex].zh}
                                </div>
                                <div className="dpip-main-dest-info-en">
                                    {detail?.stops?.[lastStopIndex].en}
                                </div>
                            </div>
                        </div>

                        {/* Next 3 stops info */}
                        <div className="dpip-main-stop-detail-info">
                            <div className='dpip-main-this-stop-name'>
                                <div className='dpip-main-stop-name-zh'>{detail?.stops?.[currentStopIndex]?.zh}</div>
                                <div className='dpip-main-stop-name-en'>{detail?.stops?.[currentStopIndex]?.en}</div>
                            </div>
                            <div className='dpip-main-next-stop-name'>
                                <div className='dpip-main-stop-name-zh'>{detail?.stops?.[nextStopIndex]?.zh}</div>
                                <div className='dpip-main-stop-name-en'>{detail?.stops?.[nextStopIndex]?.en}</div>
                            </div>
                            <div className='dpip-main-next-next-stop-name'>
                                <div className='dpip-main-stop-name-zh'>{detail?.stops?.[nextNextStopIndex]?.zh}</div>
                                <div className='dpip-main-stop-name-en'>{detail?.stops?.[nextNextStopIndex]?.en}</div>
                            </div>
                        </div>

                        {/* Driver info */}
                        <div className="dpip-main-this-stop-big-name">歡迎乘搭九龍巴士</div>
                        <div className="dpip-main-driver-info">
                            九巴仔正為您服務 &nbsp; KMB Boy is serving you
                            &nbsp;&nbsp; 員工編號 &nbsp;Emp. No: 1933
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
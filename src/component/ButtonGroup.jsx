import { Button, Tooltip } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import RefreshIcon from '@mui/icons-material/Refresh'
import CachedIcon from '@mui/icons-material/Cached'
import BadgeIcon from '@mui/icons-material/Badge'
import FullscreenIcon from '@mui/icons-material/Fullscreen'

import { isEmptyObject } from "../../utility/Util"

export const DPIPButtonGroup = ({
    isPrevStopAvailable,
    isNextStopAvailable,
    toPrevStop,
    toNextStop,
    currentStopIndex,
    setCurrentStopIndex,
    changeBound,
    routeHasTwoBound,
    routeDetail,
    userPreference,
    dispatchUserPreference,
    mainScreenTarget,
    secScreenTarget,
}) => {

    const fullscreenBtnAttr = [
        {
            key: 'main',
            target: mainScreenTarget,
            label: '左螢幕：全螢幕顯示',
        },
        {
            key: 'sec',
            target: secScreenTarget,
            label: '右螢幕：全螢幕顯示',
        },
    ]

    return (
        <>
            <Tooltip
                arrow
                placement="bottom-start"
                title="上一站 鍵盤快捷鍵: '←'">
                <span>
                    <Button
                        style={{ height: "40px" }}
                        color="error"
                        variant="contained"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => toPrevStop()}
                        disabled={!isPrevStopAvailable}
                    >
                        <span className="max-md:hidden">上站</span>
                    </Button>
                </span>
            </Tooltip>

            <Tooltip
                arrow
                placement="bottom-start"
                title="下一站 鍵盤快捷鍵: '→'">
                <span>
                    <Button
                        style={{ height: "40px" }}
                        color="success"
                        variant="contained"
                        startIcon={<ArrowForwardIcon />}
                        onClick={() => toNextStop()}
                        disabled={!isNextStopAvailable}
                    >
                        <span className="max-md:hidden">下站</span>
                    </Button>
                </span>
            </Tooltip>

            <Tooltip
                arrow
                placement="bottom-start"
                title="重設至首站 鍵盤快捷鍵: 'HOME'">
                <span>
                    <Button
                        style={{ height: "40px" }}
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={() => setCurrentStopIndex(0)}
                        disabled={isEmptyObject(routeDetail) || currentStopIndex == 0}
                    >
                        <span className="max-md:hidden">首站重新開始</span>
                    </Button>
                </span>
            </Tooltip>

            <Tooltip
                arrow
                placement="bottom-start"
                title="切換路線方向 鍵盤快捷鍵: 'END'">
                <span>
                    <Button
                        style={{ height: "40px" }}
                        color="secondary"
                        variant="contained"
                        startIcon={<CachedIcon />}
                        onClick={() => changeBound()}
                        disabled={(isEmptyObject(routeDetail) || !routeHasTwoBound) || routeDetail?.service_type != 1}
                    >
                        <span className="max-md:hidden">切換路線方向</span>
                    </Button>
                </span>
            </Tooltip>

            <Tooltip
                arrow
                placement="bottom-start"
                title="自定義車長資料顯示">
                <span>
                    <Button
                        style={{ height: "40px" }}
                        color="ochre"
                        variant="contained"
                        startIcon={<BadgeIcon />}
                        onClick={() => {
                            dispatchUserPreference({
                                type: "SET_CUSTOMIZE_DRIVER_INFO_TOGGLE",
                                payload: !userPreference.customizeDriverInfoToggle
                            })
                        }}
                    >
                        <span className="max-md:hidden">自定義車長資料</span>
                    </Button>
                </span>
            </Tooltip>

            {fullscreenBtnAttr.map(({ key, target, label }) => (
                <Tooltip
                    key={key}
                    arrow
                    placement="bottom-start"
                    title={label}>
                    <span>
                        <Button
                            disabled={isEmptyObject(routeDetail)}
                            style={{ height: "40px" }}
                            color="info"
                            variant="contained"
                            startIcon={<FullscreenIcon />}
                            onClick={() => {
                                target.current.requestFullscreen()
                            }}
                        >
                            <span className="max-md:hidden">{label}</span>
                        </Button>
                    </span>
                </Tooltip>
            ))}
        </>
    )
}
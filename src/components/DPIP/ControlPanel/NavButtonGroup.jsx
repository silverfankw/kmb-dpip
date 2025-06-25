import { useSelector, useDispatch } from 'react-redux'
import { useButtonStyles } from '@styles/buttonStyle'
import {
    changeBoundThunk,
    selectIsPrevStopAvailable,
    selectIsNextStopAvailable,
    toPrevStop,
    toNextStop,
    resetToFirstStop
} from '@store/routeSelectionSlice'

import { Button, Tooltip } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import RefreshIcon from '@mui/icons-material/Refresh'
import CachedIcon from '@mui/icons-material/Cached'


export const NavButtonGroup = () => {

    const dispatch = useDispatch()

    const {
        currentStopIndex,
        isUserSelectedRoute,
        routeDetail,
        routeHasTwoBound
    } = useSelector(state => state.routeSelection)

    const isPrevStopAvailable = useSelector(selectIsPrevStopAvailable)
    const isNextStopAvailable = useSelector(selectIsNextStopAvailable)

    const nextStopBtnStyle = useButtonStyles("nextGreen")
    const prevStopBtnStyle = useButtonStyles("darkRed")
    const resetStopBtnStyle = useButtonStyles("ochre")
    const switchBoundBtnStyle = useButtonStyles("directionPurple")

    return (
        <>
            <Tooltip arrow placement="bottom-start" title="上一站 鍵盤快捷鍵: '←'">
                <span>
                    <Button
                        color="darkRed"
                        variant="contained"
                        sx={prevStopBtnStyle.button}
                        startIcon={<ArrowBackIcon />}
                        onClick={() => dispatch(toPrevStop())}
                        disabled={!isPrevStopAvailable}
                    >
                        <span className={prevStopBtnStyle.buttonLabel}>上站</span>
                    </Button>
                </span>
            </Tooltip>
            <Tooltip arrow placement="bottom-start" title="下一站 鍵盤快捷鍵: '→'">
                <span>
                    <Button
                        color="nextGreen"
                        variant="contained"
                        sx={nextStopBtnStyle.button}
                        startIcon={<ArrowForwardIcon />}
                        onClick={() => dispatch(toNextStop())}
                        disabled={!isNextStopAvailable}
                    >
                        <span className={nextStopBtnStyle.buttonLabel}>下站</span>
                    </Button>
                </span>
            </Tooltip>
            <Tooltip arrow placement="bottom-start" title="切換路線方向 鍵盤快捷鍵: 'END'">
                <span>
                    <Button
                        color="directionPurple"
                        variant="contained"
                        sx={switchBoundBtnStyle.button}
                        startIcon={<CachedIcon />}
                        onClick={() => dispatch(changeBoundThunk())}
                        disabled={(!isUserSelectedRoute || !routeHasTwoBound) || routeDetail?.service_type != 1}
                    >
                        <span className={switchBoundBtnStyle.buttonLabel}>方向</span>
                    </Button>
                </span>
            </Tooltip>
            <Tooltip arrow placement="bottom-start" title="重設至首站 鍵盤快捷鍵: 'HOME'">
                <span>
                    <Button
                        className={resetStopBtnStyle.button}
                        color="ochre"
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        sx={resetStopBtnStyle.button}
                        onClick={() => dispatch(resetToFirstStop())}
                        disabled={!isUserSelectedRoute || currentStopIndex == 0}
                    >
                        <span className={resetStopBtnStyle.buttonLabel}>首站</span>
                    </Button>
                </span>
            </Tooltip>
        </>
    )
}
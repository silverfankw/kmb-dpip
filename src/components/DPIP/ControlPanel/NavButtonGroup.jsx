import { useSelector, useDispatch } from 'react-redux'
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

const styleClasses = {
    button: "h-[48px] max-md:h-[64px]",
    buttonLabel: "max-md:text-lg",
}

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

    return (
        <>
            <Tooltip arrow placement="bottom-start" title="上一站 鍵盤快捷鍵: '←'">
                <span>
                    <Button
                        className={styleClasses.button}
                        color="error"
                        variant="contained"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => dispatch(toPrevStop())}
                        disabled={!isPrevStopAvailable}
                    >
                        <span className={styleClasses.buttonLabel}>上站</span>
                    </Button>
                </span>
            </Tooltip>
            <Tooltip arrow placement="bottom-start" title="下一站 鍵盤快捷鍵: '→'">
                <span>
                    <Button
                        className={styleClasses.button}
                        color="success"
                        variant="contained"
                        startIcon={<ArrowForwardIcon />}
                        onClick={() => dispatch(toNextStop())}
                        disabled={!isNextStopAvailable}
                    >
                        <span className={styleClasses.buttonLabel}>下站</span>
                    </Button>
                </span>
            </Tooltip>
            <Tooltip arrow placement="bottom-start" title="重設至首站 鍵盤快捷鍵: 'HOME'">
                <span>
                    <Button
                        className={styleClasses.button}
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={() => dispatch(resetToFirstStop())}
                        disabled={!isUserSelectedRoute || currentStopIndex == 0}
                    >
                        <span className={styleClasses.buttonLabel}>首站</span>
                    </Button>
                </span>
            </Tooltip>
            <Tooltip arrow placement="bottom-start" title="切換路線方向 鍵盤快捷鍵: 'END'">
                <span>
                    <Button
                        className={styleClasses.button}
                        color="secondary"
                        variant="contained"
                        startIcon={<CachedIcon />}
                        onClick={() => dispatch(changeBoundThunk())}
                        disabled={(!isUserSelectedRoute || !routeHasTwoBound) || routeDetail?.service_type != 1}
                    >
                        <span className={styleClasses.buttonLabel}>切換方向</span>
                    </Button>
                </span>
            </Tooltip>
        </>
    )
}
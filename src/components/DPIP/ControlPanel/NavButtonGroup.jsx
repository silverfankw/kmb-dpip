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

import { Button, Tooltip, Typography } from '@mui/material'
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
    const buttonSx = style => ({ ...style.button, justifyContent: 'center' })
    const styles = {
        grid: "grid w-full gap-2 max-sm:gap-4 sm:grid-cols-2 xl:grid-cols-4",
        item: "block w-full",
    }

    return (
        <div className={styles.grid}>
            <Tooltip arrow placement="bottom-start" title="上一站 鍵盤快捷鍵: '←'">
                <span className={styles.item}>
                    <Button
                        color="darkRed"
                        variant="contained"
                        sx={buttonSx(prevStopBtnStyle)}
                        startIcon={<ArrowBackIcon />}
                        onClick={() => dispatch(toPrevStop())}
                        disabled={!isPrevStopAvailable}
                    >
                        <Typography component="span" sx={prevStopBtnStyle.buttonLabel}>上一站 Previous Stop</Typography>
                    </Button>
                </span>
            </Tooltip>
            <Tooltip arrow placement="bottom-start" title="下一站 鍵盤快捷鍵: '→'">
                <span className={styles.item}>
                    <Button
                        color="nextGreen"
                        variant="contained"
                        sx={buttonSx(nextStopBtnStyle)}
                        startIcon={<ArrowForwardIcon />}
                        onClick={() => dispatch(toNextStop())}
                        disabled={!isNextStopAvailable}
                    >
                        <Typography component="span" sx={nextStopBtnStyle.buttonLabel}>下一站 Next Stop</Typography>
                    </Button>
                </span>
            </Tooltip>
            <Tooltip arrow placement="bottom-start" title="切換路線方向 鍵盤快捷鍵: 'END'">
                <span className={styles.item}>
                    <Button
                        color="directionPurple"
                        variant="contained"
                        sx={buttonSx(switchBoundBtnStyle)}
                        startIcon={<CachedIcon />}
                        onClick={() => dispatch(changeBoundThunk())}
                        disabled={(!isUserSelectedRoute || !routeHasTwoBound) || routeDetail?.service_type != 1}
                    >
                        <Typography component="span" sx={switchBoundBtnStyle.buttonLabel}>切換行車方向 Switch Bound</Typography>
                    </Button>
                </span>
            </Tooltip>
            <Tooltip arrow placement="bottom-start" title="重設至首站 鍵盤快捷鍵: 'HOME'">
                <span className={styles.item}>
                    <Button
                        color="ochre"
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        sx={buttonSx(resetStopBtnStyle)}
                        onClick={() => dispatch(resetToFirstStop())}
                        disabled={!isUserSelectedRoute || currentStopIndex == 0}
                    >
                        <Typography component="span" sx={resetStopBtnStyle.buttonLabel}>首站重新開始 Restart at the First Stop</Typography>
                    </Button>
                </span>
            </Tooltip>
        </div>
    )
}
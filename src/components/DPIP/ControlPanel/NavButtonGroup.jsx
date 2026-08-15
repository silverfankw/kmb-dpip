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
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
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
    const keyboardKeyBoxSx = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        minWidth: 24,
        borderRadius: 5,
        border: '1px solid rgba(255,255,255,0.32)',
        background: 'linear-gradient(180deg, rgba(28,33,42,0.95) 0%, rgba(12,15,22,0.92) 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -2px 0 rgba(0,0,0,0.35), 0 1px 0 rgba(0,0,0,0.18)',
        color: '#f5f7fb',
        lineHeight: 1,
        flexShrink: 0,
        fontWeight: 700,
        textTransform: 'uppercase',
        transition: 'all 0.2s ease',
    }
    const keyboardKeyBoxSmallSx = {
        ...keyboardKeyBoxSx,
        width: 30,
        minWidth: 30,
        height: 24,
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: '0.08em',
        padding: '0 6px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    }
    const disabledKeyboardKeyBoxSx = {
        ...keyboardKeyBoxSx,
        background: 'linear-gradient(180deg, rgba(64,68,75,0.82) 0%, rgba(34,36,41,0.9) 100%)',
        borderColor: 'rgba(255,255,255,0.12)',
        color: 'rgba(230,232,236,0.52)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -3px 0 rgba(0,0,0,0.42), 0 0 0 rgba(0,0,0,0)',
        opacity: 0.68,
        filter: 'grayscale(0.7) saturate(0.5)',
    }
    const disabledKeyboardKeyBoxSmallSx = {
        ...keyboardKeyBoxSmallSx,
        background: 'linear-gradient(180deg, rgba(64,68,75,0.82) 0%, rgba(34,36,41,0.9) 100%)',
        borderColor: 'rgba(255,255,255,0.12)',
        color: 'rgba(230,232,236,0.52)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -3px 0 rgba(0,0,0,0.42), 0 0 0 rgba(0,0,0,0)',
        opacity: 0.68,
        filter: 'grayscale(0.7) saturate(0.5)',
    }
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
                        endIcon={
                            <span style={!isPrevStopAvailable ? disabledKeyboardKeyBoxSx : keyboardKeyBoxSx}>
                                <KeyboardArrowLeftIcon fontSize="small" />
                            </span>
                        }
                        onClick={() => dispatch(toPrevStop())}
                        disabled={!isPrevStopAvailable}
                    >
                        <Typography component="span" sx={prevStopBtnStyle.buttonLabel}>上一站</Typography>
                    </Button>
                </span>
            </Tooltip>
            <Tooltip arrow placement="bottom-start" title="下一站鍵盤快捷鍵: '→'">
                <span className={styles.item}>
                    <Button
                        color="nextGreen"
                        variant="contained"
                        sx={buttonSx(nextStopBtnStyle)}
                        startIcon={<ArrowForwardIcon />}
                        endIcon={
                            <span style={!isNextStopAvailable ? disabledKeyboardKeyBoxSx : keyboardKeyBoxSx}>
                                <KeyboardArrowRightIcon fontSize="small" />
                            </span>
                        }
                        onClick={() => dispatch(toNextStop())}
                        disabled={!isNextStopAvailable}
                    >
                        <Typography component="span" sx={nextStopBtnStyle.buttonLabel}>下一站</Typography>
                    </Button>
                </span>
            </Tooltip>
            <Tooltip arrow placement="bottom-start" title="切換路線方向鍵盤快捷鍵: 'END'">
                <span className={styles.item}>
                    <Button
                        color="directionPurple"
                        variant="contained"
                        sx={buttonSx(switchBoundBtnStyle)}
                        startIcon={<CachedIcon />}
                        endIcon={
                            <span style={(!isUserSelectedRoute || !routeHasTwoBound || routeDetail?.service_type != 1) ? { ...disabledKeyboardKeyBoxSmallSx, width: 38, minWidth: 38, padding: '0 8px' } : { ...keyboardKeyBoxSmallSx, width: 38, minWidth: 38, padding: '0 8px' }}>END</span>
                        }
                        onClick={() => dispatch(changeBoundThunk())}
                        disabled={(!isUserSelectedRoute || !routeHasTwoBound) || routeDetail?.service_type != 1}
                    >
                        <Typography component="span" sx={switchBoundBtnStyle.buttonLabel}>切換行車方向</Typography>
                    </Button>
                </span>
            </Tooltip>
            <Tooltip arrow placement="bottom-start" title="重設至首站鍵盤快捷鍵: 'HOME'">
                <span className={styles.item}>
                    <Button
                        color="ochre"
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        endIcon={
                            <span style={!isUserSelectedRoute || currentStopIndex == 0 ? { ...disabledKeyboardKeyBoxSmallSx, width: 42, minWidth: 42, padding: '0 8px' } : { ...keyboardKeyBoxSmallSx, width: 42, minWidth: 42, padding: '0 8px' }}>HOME</span>
                        }
                        sx={buttonSx(resetStopBtnStyle)}
                        onClick={() => dispatch(resetToFirstStop())}
                        disabled={!isUserSelectedRoute || currentStopIndex == 0}
                    >
                        <Typography component="span" sx={resetStopBtnStyle.buttonLabel}>重設至首站</Typography>
                    </Button>
                </span>
            </Tooltip>
        </div>
    )
}
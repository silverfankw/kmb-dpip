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
    buttonLabel: "max-md:text-lg",
}

const getButtonSx = theme => {
    return {
        borderRadius: 2, // 16px
        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
        fontWeight: 600,
        fontSize: { xs: '1.1rem', md: '1rem' },
        height: { xs: "64px", md: "48px" },
        px: 3,
        py: 1,
        textTransform: 'none',
        transition: 'box-shadow 0.2s, filter 0.15s, transform 0.15s, outline 0.15s',
        outline: 'none',
        '&:hover': {
            boxShadow: '0 6px 24px 0 rgba(37,99,235,0.18)',
            filter: 'brightness(1.08)',
            transform: 'translateY(-2px) scale(1.04)',
            outline: `2.5px solid ${theme}.dark`,
            outlineOffset: '1px',
        },
        '&:focus-visible': {
            outline: '2.5px solid #2563eb',
            outlineOffset: '1px',
        },
        '&:active': {
            boxShadow: '0 1px 4px 0 rgba(0,0,0,0.12)',
            filter: 'brightness(0.97)',
            transform: 'scale(0.98)',
        },
        '&.Mui-disabled': {
            backgroundColor: '#2d2b2b !important',
            color: '#595555 !important',
            boxShadow: 'none',
            opacity: 1,
            border: '1px solid #2d2b2b',
            cursor: 'not-allowed',
        },
    }
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
                        color="darkRed"
                        variant="contained"
                        sx={getButtonSx("darkRed")}
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
                        color="nextGreen"
                        variant="contained"
                        sx={getButtonSx("nextGreen")}
                        startIcon={<ArrowForwardIcon />}
                        onClick={() => dispatch(toNextStop())}
                        disabled={!isNextStopAvailable}
                    >
                        <span className={styleClasses.buttonLabel}>下站</span>
                    </Button>
                </span>
            </Tooltip>
            <Tooltip arrow placement="bottom-start" title="切換路線方向 鍵盤快捷鍵: 'END'">
                <span>
                    <Button
                        color="directionPurple"
                        variant="contained"
                        sx={getButtonSx("directionPurple")}
                        startIcon={<CachedIcon />}
                        onClick={() => dispatch(changeBoundThunk())}
                        disabled={(!isUserSelectedRoute || !routeHasTwoBound) || routeDetail?.service_type != 1}
                    >
                        <span className={styleClasses.buttonLabel}>方向</span>
                    </Button>
                </span>
            </Tooltip>
            <Tooltip arrow placement="bottom-start" title="重設至首站 鍵盤快捷鍵: 'HOME'">
                <span>
                    <Button
                        className={styleClasses.button}
                        color="ochre"
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        sx={getButtonSx("ochre")}
                        onClick={() => dispatch(resetToFirstStop())}
                        disabled={!isUserSelectedRoute || currentStopIndex == 0}
                    >
                        <span className={styleClasses.buttonLabel}>首站</span>
                    </Button>
                </span>
            </Tooltip>
        </>
    )
}
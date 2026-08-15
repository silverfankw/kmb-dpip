import { useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useButtonStyles } from '@styles/buttonStyle'
import {
    changeBoundThunk,
    selectIsPrevStopAvailable,
    selectIsNextStopAvailable,
    selectNavigationState,
    selectIsBoundSwitchable,
    toPrevStop,
    toNextStop,
    resetToFirstStop
} from '@store/routeSelectionSlice'

import { Button, Typography } from '@mui/material'
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
        routeHasTwoBound,
    } = useSelector(selectNavigationState)

    const isPrevStopAvailable = useSelector(selectIsPrevStopAvailable)
    const isNextStopAvailable = useSelector(selectIsNextStopAvailable)
    const isBoundSwitchable = useSelector(selectIsBoundSwitchable)

    const nextStopBtnStyle = useButtonStyles('nextGreen')
    const prevStopBtnStyle = useButtonStyles('darkRed')
    const resetStopBtnStyle = useButtonStyles('ochre')
    const switchBoundBtnStyle = useButtonStyles('directionPurple')

    const buttonSx = useCallback(style => ({
        ...style.button,
        justifyContent: 'center',
    }), [])

    const keyboardKeyBoxSx = useMemo(() => ({
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        minWidth: 24,
        borderRadius: 6,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(255,255,255,0.2)',
        background: 'linear-gradient(180deg, #586779 0%, #3a4658 28%, #1e2633 100%)',
        boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.28), inset 0 -2px 0 rgba(0,0,0,0.52), 0 2px 0 rgba(0,0,0,0.34), 0 0 0 1px rgba(13,17,23,0.68)',
        color: '#f8fafc',
        lineHeight: 1,
        flexShrink: 0,
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
        fontFamily: '"Segoe UI Symbol", "Noto Sans Mono", Consolas, monospace',
        padding: '2px 4px',
        transform: 'translateY(-1px)',
        transition: 'all 0.2s ease',
        position: 'relative',
        '&::before': {
            content: '""',
            position: 'absolute',
            inset: '1px 1px auto 1px',
            height: '35%',
            borderRadius: '5px 5px 3px 3px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.36), rgba(255,255,255,0.04))',
            pointerEvents: 'none',
        },
    }), [])

    const keyboardKeyBoxSmallSx = useMemo(() => ({
        ...keyboardKeyBoxSx,
        width: 30,
        minWidth: 30,
        height: 24,
        borderRadius: 5,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(255,255,255,0.2)',
        fontSize: 10,
        fontWeight: 900,
        letterSpacing: '0.08em',
        padding: '0 6px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '&::before': {
            content: '""',
            position: 'absolute',
            inset: '1px 1px auto 1px',
            height: '38%',
            borderRadius: '4px 4px 2px 2px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.38), rgba(255,255,255,0.05))',
            pointerEvents: 'none',
        },
    }), [keyboardKeyBoxSx])

    const disabledKeyboardKeyBoxSx = useMemo(() => ({
        ...keyboardKeyBoxSx,
        background: 'linear-gradient(180deg, rgba(64,68,75,0.82) 0%, rgba(34,36,41,0.9) 100%)',
        borderColor: 'rgba(255,255,255,0.12)',
        color: 'rgba(230,232,236,0.52)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -3px 0 rgba(0,0,0,0.42), 0 0 0 rgba(0,0,0,0)',
        opacity: 0.7,
        filter: 'grayscale(0.75) saturate(0.55)',
    }), [keyboardKeyBoxSx])

    const disabledKeyboardKeyBoxSmallSx = useMemo(() => ({
        ...keyboardKeyBoxSmallSx,
        background: 'linear-gradient(180deg, rgba(64,68,75,0.82) 0%, rgba(34,36,41,0.9) 100%)',
        borderColor: 'rgba(255,255,255,0.12)',
        color: 'rgba(230,232,236,0.52)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -3px 0 rgba(0,0,0,0.42), 0 0 0 rgba(0,0,0,0)',
        opacity: 0.7,
        filter: 'grayscale(0.75) saturate(0.55)',
    }), [keyboardKeyBoxSmallSx])

    const handlePrevStop = useCallback(() => dispatch(toPrevStop()), [dispatch])
    const handleNextStop = useCallback(() => dispatch(toNextStop()), [dispatch])
    const handleChangeBound = useCallback(() => dispatch(changeBoundThunk()), [dispatch])
    const handleResetToFirstStop = useCallback(() => dispatch(resetToFirstStop()), [dispatch])

    const navigationButtons = useMemo(() => {
        const isSwitchBoundDisabled = !isBoundSwitchable
        const isResetDisabled = !isUserSelectedRoute || currentStopIndex == 0

        return [
            {
                key: 'prev-stop',
                color: 'darkRed',
                style: prevStopBtnStyle,
                disabled: !isPrevStopAvailable,
                onClick: handlePrevStop,
                startIcon: <ArrowBackIcon />,
                endIcon: (
                    <span style={!isPrevStopAvailable ? disabledKeyboardKeyBoxSx : keyboardKeyBoxSx}>
                        <KeyboardArrowLeftIcon fontSize="small" />
                    </span>
                ),
                label: '上一站',
            },
            {
                key: 'next-stop',
                color: 'nextGreen',
                style: nextStopBtnStyle,
                disabled: !isNextStopAvailable,
                onClick: handleNextStop,
                startIcon: <ArrowForwardIcon />,
                endIcon: (
                    <span style={!isNextStopAvailable ? disabledKeyboardKeyBoxSx : keyboardKeyBoxSx}>
                        <KeyboardArrowRightIcon fontSize="small" />
                    </span>
                ),
                label: '下一站',
            },
            {
                key: 'switch-bound',
                color: 'directionPurple',
                style: switchBoundBtnStyle,
                disabled: isSwitchBoundDisabled,
                onClick: handleChangeBound,
                startIcon: <CachedIcon />,
                endIcon: (
                    <span style={isSwitchBoundDisabled
                        ? { ...disabledKeyboardKeyBoxSmallSx, width: 38, minWidth: 38, padding: '0 8px' }
                        : { ...keyboardKeyBoxSmallSx, width: 38, minWidth: 38, padding: '0 8px' }}
                    >
                        END
                    </span>
                ),
                label: '切換方向',
            },
            {
                key: 'reset-first-stop',
                color: 'ochre',
                style: resetStopBtnStyle,
                disabled: isResetDisabled,
                onClick: handleResetToFirstStop,
                startIcon: <RefreshIcon />,
                endIcon: (
                    <span style={isResetDisabled
                        ? { ...disabledKeyboardKeyBoxSmallSx, width: 42, minWidth: 42, padding: '0 8px' }
                        : { ...keyboardKeyBoxSmallSx, width: 42, minWidth: 42, padding: '0 8px' }}
                    >
                        HOME
                    </span>
                ),
                label: '重設至首站',
            },
        ]
    }, [
        currentStopIndex,
        disabledKeyboardKeyBoxSmallSx,
        disabledKeyboardKeyBoxSx,
        handleChangeBound,
        handleNextStop,
        handlePrevStop,
        handleResetToFirstStop,
        isBoundSwitchable,
        isNextStopAvailable,
        isPrevStopAvailable,
        isUserSelectedRoute,
        keyboardKeyBoxSmallSx,
        keyboardKeyBoxSx,
        nextStopBtnStyle,
        prevStopBtnStyle,
        resetStopBtnStyle,
        switchBoundBtnStyle,
    ])

    const styles = {
        grid: 'grid w-full gap-2 max-sm:gap-4 sm:grid-cols-2 xl:grid-cols-4',
        item: 'block w-full',
    }

    return (
        <div className={styles.grid}>
            {navigationButtons.map(({ key, color, style, disabled, onClick, startIcon, endIcon, label }) => (
                <span key={key} className={styles.item}>
                    <Button
                        color={color}
                        variant="contained"
                        sx={buttonSx(style)}
                        startIcon={startIcon}
                        endIcon={endIcon}
                        onClick={onClick}
                        disabled={disabled}
                    >
                        <Typography component="span" sx={style.buttonLabel}>{label}</Typography>
                    </Button>
                </span>
            ))}
        </div>
    )
}
import { useButtonStyles } from "@styles/buttonStyle"

import { useSelector, useDispatch } from 'react-redux'
import { setCustomizeDriverInfoToggle } from "@store/userPreferenceSlice"

import { Button, Tooltip, Typography } from '@mui/material'
import BadgeIcon from '@mui/icons-material/Badge'
import FullscreenIcon from '@mui/icons-material/Fullscreen'


export const FuncButtonGroup = ({ mainScreenTarget, secScreenTarget }) => {

    const { isUserSelectedRoute } = useSelector(state => state.routeSelection)
    const { customizeDriverInfoToggle } = useSelector(state => state.userPreference)

    const dispatch = useDispatch()
    const styles = useButtonStyles("info")
    const buttonSx = {
        ...styles.button,
        minHeight: 40,
        height: 40,
        minWidth: 0,
        borderRadius: 2,
        px: 1.1,
        py: 0.75,
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        '@media (min-width: 768px)': {
            minHeight: 41,
            height: 41,
            px: 1.1,
            py: 0.65,
        },
        '@media (min-width: 1280px)': {
            minHeight: 41,
            height: 41,
            px: 1.2,
            py: 0.7,
        },
        '@media (max-width: 640px)': {
            minHeight: 46,
            px: 0.85,
            py: 0.65,
        },
        '&:focus-visible': {
            outline: '3px solid rgba(255,255,255,0.9)',
            outlineOffset: 2,
        },
    }
    const groupStyles = {
        grid: "grid w-full gap-1.5 sm:grid-cols-3 sm:gap-2",
        item: "block w-full min-w-0",
        desktopOnly: "block w-full min-w-0",
    }

    const fullscreenBtnAttr = [
        {
            key: 'main',
            target: mainScreenTarget,
            label: '主螢幕：全螢幕顯示',
        },
        {
            key: 'sec',
            target: secScreenTarget,
            label: '輔螢幕：全螢幕顯示',
        },
    ]

    const driverInfoTooltip = "自定義車長資料顯示"
    const fullscreenTooltip = '選擇路線後才能開啟全螢幕顯示功能'
    const buttonLabelSx = {
        ...styles.buttonLabel,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        fontSize: 'clamp(0.72rem, 1.9vw, 1rem)',
        letterSpacing: '0.01em',
    }

    const actionButtons = [
        {
            key: 'driver-info',
            type: 'driver-info',
            tooltip: driverInfoTooltip,
            wrapperClassName: groupStyles.item,
            buttonProps: {
                fullWidth: true,
                'aria-label': 'Customize driver info',
                sx: buttonSx,
                color: 'ochre',
                variant: 'contained',
                startIcon: <BadgeIcon />,
                onClick: () => {
                    dispatch(setCustomizeDriverInfoToggle(!customizeDriverInfoToggle))
                },
                children: <Typography component="span" sx={buttonLabelSx}>更改車長資料</Typography>,
            },
        },
        ...fullscreenBtnAttr.map(({ key, target, label }) => ({
            key,
            type: 'fullscreen',
            tooltip: !isUserSelectedRoute ? fullscreenTooltip : `${label}：開啟全螢幕`,
            wrapperClassName: groupStyles.desktopOnly,
            buttonProps: {
                fullWidth: true,
                'aria-label': label,
                sx: buttonSx,
                color: 'info',
                variant: 'contained',
                disabled: !isUserSelectedRoute,
                startIcon: <FullscreenIcon />,
                onClick: () => {
                    if (isUserSelectedRoute) target.current.requestFullscreen()
                },
                children: <Typography component="span" sx={buttonLabelSx}>{label}</Typography>,
            },
        })),
    ]

    return (
        <div className={groupStyles.grid}>
            {actionButtons.map(({ key, tooltip, wrapperClassName, buttonProps }) => (
                <Tooltip key={key} arrow placement="bottom-start" title={tooltip}>
                    <span className={wrapperClassName}>
                        <Button {...buttonProps} />
                    </span>
                </Tooltip>
            ))}
        </div>
    )
}

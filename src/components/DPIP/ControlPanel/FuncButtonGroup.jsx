import { useSelector, useDispatch } from 'react-redux'
import { setCustomizeDriverInfoToggle } from "@store/userPreferenceSlice"

import { Button, Tooltip } from '@mui/material'
import BadgeIcon from '@mui/icons-material/Badge'
import FullscreenIcon from '@mui/icons-material/Fullscreen'

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

export const FuncButtonGroup = ({ mainScreenTarget, secScreenTarget }) => {

    const { isUserSelectedRoute } = useSelector(state => state.routeSelection)
    const { customizeDriverInfoToggle } = useSelector(state => state.userPreference)

    const dispatch = useDispatch()

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

    return (
        <>
            <Tooltip arrow placement="bottom-start" title="自定義車長資料顯示">
                <span>
                    <Button
                        sx={getButtonSx("ochre")}
                        color="ochre"
                        variant="contained"
                        startIcon={<BadgeIcon />}
                        onClick={() => {
                            dispatch(
                                setCustomizeDriverInfoToggle(!customizeDriverInfoToggle)
                            )
                        }}
                    >
                        <span className={styleClasses.buttonLabel}>更改車長資料</span>
                    </Button>
                </span>
            </Tooltip >
            {
                fullscreenBtnAttr.map(({ key, target, label }) => (
                    <Tooltip
                        className={styleClasses.fullscreenTooltip}
                        key={key}
                        arrow
                        placement="bottom-start"
                        title={`選擇路線後才能開啟全螢幕顯示功能`}>
                        <span>
                            <Button
                                sx={getButtonSx("ochre")}
                                color="info"
                                variant="contained"
                                disabled={!isUserSelectedRoute}
                                className={styleClasses.button}
                                startIcon={<FullscreenIcon />}
                                onClick={() => {
                                    target.current.requestFullscreen()
                                }}
                            >
                                <span>{label}</span>
                            </Button>
                        </span>
                    </Tooltip>
                ))
            }


        </>
    )
}

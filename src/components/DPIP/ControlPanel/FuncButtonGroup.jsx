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
        justifyContent: 'center',
    }
    const groupStyles = {
        grid: "grid w-full gap-2 max-sm:gap-1.5 sm:grid-cols-2 2xl:grid-cols-3",
        item: "block w-full",
        desktopOnly: "hidden w-full md:block",
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

    return (
        <div className={groupStyles.grid}>
            <Tooltip arrow placement="bottom-start" title="自定義車長資料顯示">
                <span className={groupStyles.item}>
                    <Button
                        sx={buttonSx}
                        color="ochre"
                        variant="contained"
                        startIcon={<BadgeIcon />}
                        onClick={() => {
                            dispatch(
                                setCustomizeDriverInfoToggle(!customizeDriverInfoToggle)
                            )
                        }}
                    >
                        <Typography component="span" sx={styles.buttonLabel}>更改車長資料</Typography>
                    </Button>
                </span>
            </Tooltip >
            {
                fullscreenBtnAttr.map(({ key, target, label }) => (
                    <Tooltip
                        key={key}
                        arrow
                        placement="bottom-start"
                        title={`選擇路線後才能開啟全螢幕顯示功能`}
                    >
                        <span className={groupStyles.desktopOnly}>
                            <Button
                                sx={buttonSx}
                                color="info"
                                variant="contained"
                                disabled={!isUserSelectedRoute}
                                startIcon={<FullscreenIcon />}
                                onClick={() => {
                                    target.current.requestFullscreen()
                                }}
                            >
                                <Typography component="span" sx={styles.buttonLabel}>{label}</Typography>
                            </Button>
                        </span>
                    </Tooltip>
                ))
            }
        </div>
    )
}

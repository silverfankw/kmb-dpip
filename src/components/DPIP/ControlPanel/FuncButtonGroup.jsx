import { useButtonStyles } from "@styles/buttonStyle"

import { useSelector, useDispatch } from 'react-redux'
import { setCustomizeDriverInfoToggle } from "@store/userPreferenceSlice"

import { Button, Tooltip } from '@mui/material'
import BadgeIcon from '@mui/icons-material/Badge'
import FullscreenIcon from '@mui/icons-material/Fullscreen'


export const FuncButtonGroup = ({ mainScreenTarget, secScreenTarget }) => {

    const { isUserSelectedRoute } = useSelector(state => state.routeSelection)
    const { customizeDriverInfoToggle } = useSelector(state => state.userPreference)

    const dispatch = useDispatch()
    const styles = useButtonStyles("info")

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
                        sx={styles.button}
                        color="ochre"
                        variant="contained"
                        startIcon={<BadgeIcon />}
                        onClick={() => {
                            dispatch(
                                setCustomizeDriverInfoToggle(!customizeDriverInfoToggle)
                            )
                        }}
                    >
                        <span className={styles.label}>更改車長資料</span>
                    </Button>
                </span>
            </Tooltip >
            {
                fullscreenBtnAttr.map(({ key, target, label }) => (
                    <Tooltip
                        className={styles.fullscreenTooltip}
                        key={key}
                        arrow
                        placement="bottom-start"
                        title={`選擇路線後才能開啟全螢幕顯示功能`}
                    >
                        <span>
                            <Button
                                sx={{ ...styles.button, display: { xs: "none", md: "inline-block" } }}
                                color="info"
                                variant="contained"
                                disabled={!isUserSelectedRoute}
                                className={styles.button}
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

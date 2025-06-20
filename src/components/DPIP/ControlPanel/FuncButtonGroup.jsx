import { useSelector, useDispatch } from 'react-redux'
import { setCustomizeDriverInfoToggle } from "@store/userPreferenceSlice"

import { Button, Tooltip } from '@mui/material'
import BadgeIcon from '@mui/icons-material/Badge'
import FullscreenIcon from '@mui/icons-material/Fullscreen'

const styleClasses = {
    button: "h-[48px] max-md:h-[64px]",
    buttonLabel: "max-md:text-lg",
    fullscreenTooltip: "max-sm:hidden",
}

export const FuncButtonGroup = ({
    mainScreenTarget, secScreenTarget
}) => {

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
                        className={styleClasses.button}
                        color="ochre"
                        variant="contained"
                        startIcon={<BadgeIcon />}
                        onClick={() => {
                            dispatch(
                                setCustomizeDriverInfoToggle(!customizeDriverInfoToggle)
                            )
                        }
                        }
                    >
                        <span className={styleClasses.buttonLabel}>自定義車長資料</span>
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
                        title={label}>
                        <span>
                            <Button
                                disabled={!isUserSelectedRoute}
                                className={styleClasses.button}
                                color="info"
                                variant="contained"
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

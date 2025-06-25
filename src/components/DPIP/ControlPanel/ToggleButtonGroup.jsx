import { useButtonStyles } from "@styles/buttonStyle"
import { useSelector, useDispatch } from "react-redux"
import { setStopPressed, setShowHandrailAndMindDoorNotice } from "@store/userPreferenceSlice"
import { SwitchButton } from '@components'

import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import HandshakeIcon from '@mui/icons-material/Handshake'
import DoorSlidingIcon from '@mui/icons-material/DoorSliding'
import NotificationsIcon from '@mui/icons-material/Notifications'

export const ToggleButtonGroup = () => {
    const { stopPressed, showHandrailNotice, showMindDoorNotice } = useSelector(state => state.userPreference)
    const dispatch = useDispatch()

    const stopButtonStyles = useButtonStyles('darkRed')
    const notiStyles = useButtonStyles('ochre')

    return (
        <>
            {/* Stop Bell toggle */}
            <SwitchButton
                sx={stopButtonStyles.button}
                control={
                    <Switch
                        checked={stopPressed}
                        onChange={() => dispatch(setStopPressed(!stopPressed))}
                        name="stop pressed"
                        sx={stopButtonStyles.switch}
                    />
                }
                label={
                    <span style={stopButtonStyles.labelWrapper}>
                        <NotificationsIcon color="snowwhite" />
                        <Typography
                            variant="button"
                            sx={stopButtonStyles.label}>
                            {stopPressed ? `  解除` : ` 按鐘`}
                        </Typography>
                    </span>
                }
            />
            <SwitchButton
                sx={notiStyles.button}
                control={
                    <Switch
                        checked={showHandrailNotice}
                        color="gold"
                        onChange={() => {
                            dispatch(
                                setShowHandrailAndMindDoorNotice({
                                    showHandrailNotice: !showHandrailNotice,
                                    showMindDoorNotice: showMindDoorNotice && false
                                })
                            )
                        }}
                        name="handrail notice"
                        sx={notiStyles.switch}
                    />
                }
                label={
                    <span style={notiStyles.labelWrapper}>
                        <HandshakeIcon />
                        <Typography sx={notiStyles.label} variant="button">
                            請緊握扶手
                        </Typography>
                    </span>
                }
            />

            {/* Mind Door Notice toggle */}
            <SwitchButton
                sx={notiStyles.button}
                control={
                    <Switch
                        checked={showMindDoorNotice}
                        color="gold"
                        onChange={() => {
                            dispatch(
                                setShowHandrailAndMindDoorNotice({
                                    showMindDoorNotice: !showMindDoorNotice,
                                    showHandrailNotice: showHandrailNotice && false
                                })
                            )
                        }}
                        name="mind door notice"
                        sx={notiStyles.switch}
                    />
                }
                label={
                    <span style={notiStyles.labelWrapper}>
                        <DoorSlidingIcon />
                        <Typography sx={notiStyles.label} variant="button">
                            車門正在關上
                        </Typography>
                    </span>
                }
            />
        </>
    )
}
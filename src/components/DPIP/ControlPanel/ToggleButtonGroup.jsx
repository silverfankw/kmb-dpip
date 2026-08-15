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
    const buttonSx = style => ({
        ...style.button,
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        columnGap: 1,
        '& .MuiSwitch-root': {
            gridColumn: 1,
        },
        '& .MuiFormControlLabel-label': {
            gridColumn: 2,
            display: 'flex',
            justifyContent: 'center',
        },
        '&::after': {
            content: '""',
            gridColumn: 3,
            width: { xs: 44, sm: 38 },
        },
    })

    return (
        <div className="grid w-full gap-2 max-sm:gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            {/* Stop Bell toggle */}
            <SwitchButton
                sx={buttonSx(stopButtonStyles)}
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
                            {stopPressed ? `  解除按鐘` : ` 按鐘`}
                        </Typography>
                    </span>
                }
            />
            <SwitchButton
                sx={buttonSx(notiStyles)}
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
                            緊握扶手提示
                        </Typography>
                    </span>
                }
            />

            {/* Mind Door Notice toggle */}
            <SwitchButton
                sx={buttonSx(notiStyles)}
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
                            車門關上提示
                        </Typography>
                    </span>
                }
            />
        </div>
    )
}
import { useSelector, useDispatch } from "react-redux"
import { setStopPressed, setShowHandrailAndMindDoorNotice } from "@store/userPreferenceSlice"
import { SwitchButton } from '@components'

import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import HandshakeIcon from '@mui/icons-material/Handshake'
import DoorSlidingIcon from '@mui/icons-material/DoorSliding'
import NotificationsIcon from '@mui/icons-material/Notifications'

const buttonLabelSx = { fontSize: { xs: "1.25rem", md: "1rem" } }

const getButtonSx = theme => {
    return {
        px: 2,
        py: 3,
        textAlign: "center",
        width: "max-content",
        bgcolor: `${theme}.main`,
        borderRadius: 1,
        margin: "0px",
        boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
        "&:hover": {
            bgcolor: `${theme}.dark`,
            // transform: 'translateY(-2px) scale(1.04)',
        },
        height: { xs: "64px", md: "48px" },
    }
}

export const ToggleButtonGroup = () => {

    const { stopPressed, showHandrailNotice, showMindDoorNotice } = useSelector(state => state.userPreference)
    const dispatch = useDispatch()

    return (
        <>
            {/* Stop Bell toggle */}
            <SwitchButton
                sx={getButtonSx("darkRed")}
                control={
                    <Switch
                        checked={stopPressed}
                        color="darkred"
                        onChange={() => dispatch(setStopPressed(!stopPressed))}
                        name="stop pressed" />
                }
                label={
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <NotificationsIcon color="snowwhite" />
                        <Typography variant="button" color="white" sx={buttonLabelSx}>
                            {stopPressed ? `  解除` : ` 按鐘`}
                        </Typography>
                    </span>
                }
            />
            <SwitchButton
                sx={getButtonSx("ochre")}
                control={
                    <Switch
                        checked={showHandrailNotice}
                        color="gold"
                        onChange={() => {
                            dispatch(
                                setShowHandrailAndMindDoorNotice(
                                    {
                                        showHandrailNotice: !showHandrailNotice,
                                        showMindDoorNotice: showMindDoorNotice && false
                                    })
                            )
                        }}
                        name="handrail notice" />
                }
                label={
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <HandshakeIcon />
                        <Typography sx={buttonLabelSx} variant="button">
                            「緊握扶手」
                        </Typography>
                    </span>
                }
            />

            {/* Mind Door Notice toggle */}
            <SwitchButton
                sx={getButtonSx("ochre")}
                control={
                    <Switch
                        checked={showMindDoorNotice}
                        color="gold"
                        onChange={() => {
                            dispatch(
                                setShowHandrailAndMindDoorNotice(
                                    {
                                        showMindDoorNotice: !showMindDoorNotice,
                                        showHandrailNotice: showHandrailNotice && false
                                    })
                            )
                        }}
                        name="mind door notice" />
                }
                label={
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <DoorSlidingIcon />
                        <Typography sx={buttonLabelSx} variant="button">
                            「車門關上」
                        </Typography>
                    </span>
                }
            />
        </>
    )
}
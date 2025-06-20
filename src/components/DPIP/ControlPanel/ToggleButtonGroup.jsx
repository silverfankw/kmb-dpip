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

    return (
        <>
            {/* Stop Bell toggle */}
            <SwitchButton
                sx={{
                    width: "max-content",
                    bgcolor: "error.main",
                    borderRadius: 1,
                    paddingRight: "10px", // Expand box to fit content
                    margin: "0px",
                    boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
                    "&:hover": { bgcolor: "error.dark" },
                    height: "48px",
                    ["@media (max-width: 640px)"]: { height: "64px" }
                }}
                control={
                    <Switch
                        checked={stopPressed}
                        color="darkred"
                        onChange={() =>
                            dispatch(setStopPressed(!stopPressed))
                        }
                        name="stop pressed" />
                }
                label={
                    <>
                        <NotificationsIcon color="snowwhite" />
                        <Typography
                            variant="button"
                            color="white"
                            sx={{
                                "@media (max-width:640px)": {
                                    display: "none"
                                }
                            }}
                        >
                            {stopPressed ? `  解除` : ` 按鐘`}
                        </Typography>
                    </>} />
            <SwitchButton
                sx={{
                    width: "max-content",
                    bgcolor: "ochre.main",
                    borderRadius: 1,
                    margin: "0px",
                    boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
                    "&:hover": { bgcolor: "ochre.dark" },
                    height: "48px",
                    ["@media (max-width: 640px)"]: { height: "64px" }

                }}
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
                    <>
                        <HandshakeIcon />
                        <Typography
                            sx={{
                                "@media (max-width:640px)": {
                                    fontSize: "1.125rem"
                                }
                            }}
                            variant="button">
                            「緊握扶手」
                        </Typography>
                    </>}
            />

            {/* Mind Door Notice toggle */}
            <SwitchButton
                sx={{
                    width: "max-content",
                    bgcolor: "ochre.main",
                    borderRadius: 1,
                    margin: "0px",
                    boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
                    "&:hover": { bgcolor: "ochre.dark" },
                    height: "48px",
                    ["@media (max-width: 640px)"]: { height: "64px" }
                }}
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
                    <>
                        <DoorSlidingIcon />
                        <Typography
                            sx={{
                                "@media (max-width:640px)": {
                                    fontSize: "1.125rem"
                                }
                            }}
                            variant="button">
                            「車門關上」
                        </Typography>
                    </>}
            />
        </>
    )
}
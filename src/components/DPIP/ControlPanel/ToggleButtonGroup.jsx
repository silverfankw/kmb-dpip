import { useSelector, useDispatch } from "react-redux"
import { setStopPressed, setShowHandrailAndMindDoorNotice } from "@store/userPreferenceSlice"
import { SwitchButton } from '@components'

import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import HandshakeIcon from '@mui/icons-material/Handshake'
import DoorSlidingIcon from '@mui/icons-material/DoorSliding'
import NotificationsIcon from '@mui/icons-material/Notifications'

const styles = {
    getButtonLabelSx: theme => ({ fontSize: { xs: "1.25rem", md: "1rem" }, color: `${theme}.contrastText` }),
    switch: { transform: { xs: "scale(1.5)", sm: "scale(1.3)", md: "scale(1.1)" } },
    labelWrapper: { display: "flex", alignItems: "center", gap: 6 },
    getButtonSx: theme => ({
        px: 2,
        py: 3,
        textAlign: "center",
        width: "max-content",
        color: `${theme}.contrastText`,
        bgcolor: `${theme}.main`,
        borderRadius: 1,
        margin: "0px",
        boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
        "&:hover": {
            bgcolor: `${theme}.dark`,
        },
        height: { xs: "64px", md: "48px" },
    }),
}

export const ToggleButtonGroup = () => {
    const { stopPressed, showHandrailNotice, showMindDoorNotice } = useSelector(state => state.userPreference)
    const dispatch = useDispatch()

    return (
        <>
            {/* Stop Bell toggle */}
            <SwitchButton
                sx={styles.getButtonSx("darkRed")}
                control={
                    <Switch
                        checked={stopPressed}
                        color="darkred"
                        onChange={() => dispatch(setStopPressed(!stopPressed))}
                        name="stop pressed"
                        sx={styles.switch}
                    />
                }
                label={
                    <span style={styles.labelWrapper}>
                        <NotificationsIcon color="snowwhite" />
                        <Typography variant="button" sx={styles.getButtonLabelSx("darkred")}>
                            {stopPressed ? `  解除` : ` 按鐘`}
                        </Typography>
                    </span>
                }
            />
            <SwitchButton
                sx={styles.getButtonSx("ochre")}
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
                        sx={styles.switch}
                    />
                }
                label={
                    <span style={styles.labelWrapper}>
                        <HandshakeIcon />
                        <Typography sx={styles.getButtonLabelSx("ochre")} variant="button">
                            請緊握扶手
                        </Typography>
                    </span>
                }
            />

            {/* Mind Door Notice toggle */}
            <SwitchButton
                sx={styles.getButtonSx("ochre")}
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
                        sx={styles.switch}
                    />
                }
                label={
                    <span style={styles.labelWrapper}>
                        <DoorSlidingIcon />
                        <Typography sx={styles.getButtonLabelSx("ochre")} variant="button">
                            車門正在關上
                        </Typography>
                    </span>
                }
            />
        </>
    )
}
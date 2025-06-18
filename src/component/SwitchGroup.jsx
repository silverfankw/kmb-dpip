import { SwitchButton } from './SwitchButton'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import HandshakeIcon from '@mui/icons-material/Handshake'
import DoorSlidingIcon from '@mui/icons-material/DoorSliding'
import NotificationsIcon from '@mui/icons-material/Notifications'

export const SwitchGroup = ({ userPreference, dispatchUserPreference }) => {
    return (
        <>
            {/* Stop Bell toggle */}
            <SwitchButton
                sx={{
                    width: "max-content",
                    bgcolor: "error.main",
                    borderRadius: 1,
                    paddingRight: "10px", // Expand box to fit content
                    marginLeft: "0px", // Reset the default left overflow
                    boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
                    "&:hover": { bgcolor: "error.dark" }
                }}
                control={
                    <Switch
                        checked={userPreference.stopPressed}
                        color="darkred"
                        onChange={() => dispatchUserPreference(({
                            type: "SET_STOP_PRESSED",
                            payload: !userPreference.stopPressed
                        }))}
                        name="stop pressed" />
                }
                label={
                    <>
                        <NotificationsIcon color="snowwhite" />
                        <Typography className="max-md:hidden" variant="button" color="white">
                            {userPreference.stopPressed ? `  解除鐘` : ` 按鐘`}
                        </Typography>
                    </>}
            />

            {/* Hold Handrail Notice toggle */}
            <SwitchButton
                sx={{
                    width: "max-content",
                    bgcolor: "ochre.main",
                    borderRadius: 1,
                    paddingRight: "10px",
                    boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
                    "&:hover": { bgcolor: "ochre.dark" }
                }}
                control={
                    <Switch
                        checked={userPreference.handrailNotice}
                        color="gold"
                        onChange={() =>
                            dispatchUserPreference({
                                type: "SET_HANDRAIL_NOTICE",
                                payload: {
                                    handrailNotice: !userPreference.handrailNotice,
                                    mindDoorNotice: userPreference.mindDoorNotice && false
                                }
                            })}
                        name="handrail notice" />
                }
                label={
                    <>
                        <HandshakeIcon />
                        <Typography className="max-md:hidden" variant="button">
                            「緊握扶手」提示
                        </Typography>
                    </>}
            />

            {/* Mind Door Notice toggle */}
            <SwitchButton
                sx={{
                    width: "max-content",
                    bgcolor: "ochre.main",
                    borderRadius: 1,
                    paddingRight: "10px",
                    boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
                    "&:hover": { bgcolor: "ochre.dark" },
                }}
                control={
                    <Switch
                        checked={userPreference.mindDoorNotice}
                        color="gold"
                        onChange={() =>
                            dispatchUserPreference({
                                type: "SET_MIND_DOOR_NOTICE",
                                payload: {
                                    mindDoorNotice: !userPreference.mindDoorNotice,
                                    handrailNotice: userPreference.handrailNotice && false
                                }
                            })}
                        name="mind door notice" />
                }
                label={
                    <>
                        <DoorSlidingIcon />
                        <Typography className="max-md:hidden" variant="button">
                            「車門關上」提示
                        </Typography>
                    </>}
            />
        </>
    )
}
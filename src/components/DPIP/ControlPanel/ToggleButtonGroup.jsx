import { useButtonStyles } from "@styles/buttonStyle"
import { useSelector, useDispatch } from "react-redux"
import { getAppTextConfig } from '@components/sharedComponentConfig'
import { setStopPressed, setShowHandrailAndMindDoorNotice } from "@store/userPreferenceSlice"
import { SwitchButton } from '@components'

import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import HandshakeIcon from '@mui/icons-material/Handshake'
import DoorSlidingIcon from '@mui/icons-material/DoorSliding'
import NotificationsIcon from '@mui/icons-material/Notifications'

export const ToggleButtonGroup = () => {
    const { stopPressed, showHandrailNotice, showMindDoorNotice, language } = useSelector(state => state.userPreference)
    const appText = getAppTextConfig(language)
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

    const toggleButtons = [
        {
            key: 'stop-pressed',
            sx: buttonSx(stopButtonStyles),
            checked: stopPressed,
            onChange: () => dispatch(setStopPressed(!stopPressed)),
            name: 'stop pressed',
            switchSx: stopButtonStyles.switch,
            icon: <NotificationsIcon color="snowwhite" />,
            label: stopPressed ? appText.releaseStop : appText.pressStop,
            labelSx: { ...stopButtonStyles.label, textTransform: 'none' },
            labelWrapper: stopButtonStyles.labelWrapper,
        },
        {
            key: 'handrail-notice',
            sx: buttonSx(notiStyles),
            checked: showHandrailNotice,
            onChange: () => {
                dispatch(
                    setShowHandrailAndMindDoorNotice({
                        showHandrailNotice: !showHandrailNotice,
                        showMindDoorNotice: showMindDoorNotice && false,
                    })
                )
            },
            name: 'handrail notice',
            switchSx: notiStyles.switch,
            icon: <HandshakeIcon />,
            label: appText.handrailNotice,
            labelSx: { ...notiStyles.label, textTransform: 'none' },
            labelWrapper: notiStyles.labelWrapper,
        },
        {
            key: 'mind-door-notice',
            sx: buttonSx(notiStyles),
            checked: showMindDoorNotice,
            onChange: () => {
                dispatch(
                    setShowHandrailAndMindDoorNotice({
                        showMindDoorNotice: !showMindDoorNotice,
                        showHandrailNotice: showHandrailNotice && false,
                    })
                )
            },
            name: 'mind door notice',
            switchSx: notiStyles.switch,
            icon: <DoorSlidingIcon />,
            label: appText.mindDoorNotice,
            labelSx: { ...notiStyles.label, textTransform: 'none' },
            labelWrapper: notiStyles.labelWrapper,
        },
    ]

    return (
        <div className="grid w-full gap-2 max-sm:gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            {toggleButtons.map(({ key, sx, checked, onChange, name, switchSx, icon, label, labelSx, labelWrapper }) => (
                <SwitchButton
                    key={key}
                    sx={sx}
                    control={
                        <Switch
                            checked={checked}
                            color={key === 'stop-pressed' ? undefined : 'gold'}
                            onChange={onChange}
                            name={name}
                            sx={switchSx}
                        />
                    }
                    label={
                        <span style={labelWrapper}>
                            {icon}
                            <Typography sx={labelSx} variant="button">
                                {label}
                            </Typography>
                        </span>
                    }
                />
            ))}
        </div>
    )
}
import { shallowEqual, useSelector, useDispatch } from 'react-redux'
import { getAppTextConfig } from '@components/sharedComponentConfig'
import { setStopPressed, setShowHandrailAndMindDoorNotice } from '@store/userPreferenceSlice'
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined'
import DoorSlidingOutlinedIcon from '@mui/icons-material/DoorSlidingOutlined'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import { ControlButton } from './ControlButton'
import { getControlPanelText } from './controlPanelConfig'

export const ToggleButtonGroup = () => {
    const { stopPressed, showHandrailNotice, showMindDoorNotice, language } = useSelector(state => ({
        stopPressed: state.userPreference.stopPressed,
        showHandrailNotice: state.userPreference.showHandrailNotice,
        showMindDoorNotice: state.userPreference.showMindDoorNotice,
        language: state.userPreference.language,
    }), shallowEqual)
    const appText = getAppTextConfig(language)
    const text = getControlPanelText(language)
    const dispatch = useDispatch()

    return (
        <div className="control-panel__alerts">
            <ControlButton
                tile
                icon={stopPressed ? <NotificationsActiveIcon /> : <NotificationsNoneIcon />}
                label={stopPressed ? text.bellActive : text.bell}
                accessibleLabel={stopPressed ? appText.releaseStop : appText.pressStop}
                tone="danger"
                pressed={stopPressed}
                onClick={() => dispatch(setStopPressed(!stopPressed))}
            />
            <ControlButton
                tile
                icon={<HandshakeOutlinedIcon />}
                label={text.handrail}
                accessibleLabel={appText.handrailNotice}
                tone="notice"
                pressed={showHandrailNotice}
                onClick={() => dispatch(setShowHandrailAndMindDoorNotice({
                    showHandrailNotice: !showHandrailNotice,
                    showMindDoorNotice: false,
                }))}
            />
            <ControlButton
                tile
                icon={<DoorSlidingOutlinedIcon />}
                label={text.door}
                accessibleLabel={appText.mindDoorNotice}
                tone="notice"
                pressed={showMindDoorNotice}
                onClick={() => dispatch(setShowHandrailAndMindDoorNotice({
                    showMindDoorNotice: !showMindDoorNotice,
                    showHandrailNotice: false,
                }))}
            />
        </div>
    )
}

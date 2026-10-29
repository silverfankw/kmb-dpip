import { useSelector, useDispatch } from 'react-redux'
import { getAppTextConfig } from '@components/sharedComponentConfig'
import {
    changeBoundThunk,
    selectIsPrevStopAvailable,
    selectIsNextStopAvailable,
    selectNavigationState,
    selectIsBoundSwitchable,
    toPrevStop,
    toNextStop,
    resetToFirstStop,
} from '@store/routeSelectionSlice'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { ControlButton } from './ControlButton'
import { getControlPanelText } from './controlPanelConfig'

export const NavButtonGroup = () => {
    const dispatch = useDispatch()
    const { currentStopIndex, isUserSelectedRoute } = useSelector(selectNavigationState)
    const isPrevStopAvailable = useSelector(selectIsPrevStopAvailable)
    const isNextStopAvailable = useSelector(selectIsNextStopAvailable)
    const isBoundSwitchable = useSelector(selectIsBoundSwitchable)
    const language = useSelector(state => state.userPreference.language)
    const appText = getAppTextConfig(language)
    const text = getControlPanelText(language)

    return (
        <div className="control-panel__navigation">
            <ControlButton
                icon={<ArrowBackIcon />}
                label={text.previous}
                accessibleLabel={appText.prevStop}
                tone="secondary"
                disabled={!isPrevStopAvailable}
                shortcut="ArrowLeft"
                shortcutLabel="←"
                onClick={() => dispatch(toPrevStop())}
            />
            <ControlButton
                icon={<ArrowForwardIcon />}
                label={text.next}
                accessibleLabel={appText.nextStop}
                tone="primary"
                disabled={!isNextStopAvailable}
                shortcut="ArrowRight"
                shortcutLabel="→"
                onClick={() => dispatch(toNextStop())}
            />
            <ControlButton
                icon={<SwapHorizIcon />}
                accessibleLabel={appText.switchDirection}
                disabled={!isBoundSwitchable}
                shortcut="End"
                shortcutLabel="End"
                onClick={() => dispatch(changeBoundThunk())}
            />
            <ControlButton
                icon={<RestartAltIcon />}
                accessibleLabel={appText.resetToFirstStop}
                disabled={!isUserSelectedRoute || currentStopIndex === 0}
                shortcut="Home"
                shortcutLabel="Home"
                onClick={() => dispatch(resetToFirstStop())}
            />
        </div>
    )
}

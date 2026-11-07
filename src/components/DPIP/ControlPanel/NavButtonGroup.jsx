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

export const NavButtonGroup = ({ navigation }) => {
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
            <div className="control-panel__step-actions">
            <ControlButton
                icon={<ArrowBackIcon />}
                label={text.previous}
                accessibleLabel={appText.prevStop}
                tone="secondary"
                disabled={navigation ? !navigation.canPrev : !isPrevStopAvailable}
                shortcut="ArrowLeft"
                shortcutLabel="←"
                onClick={navigation?.onPrev ?? (() => dispatch(toPrevStop()))}
            />
            <ControlButton
                icon={<ArrowForwardIcon />}
                label={text.next}
                accessibleLabel={appText.nextStop}
                tone="primary"
                data-emphasis="next"
                disabled={navigation ? !navigation.canNext : !isNextStopAvailable}
                shortcut="ArrowRight"
                shortcutLabel="→"
                onClick={navigation?.onNext ?? (() => dispatch(toNextStop()))}
            />
            </div>
            <div className="control-panel__route-actions" role="group" aria-label={text.routeActions}>
            <ControlButton
                icon={<SwapHorizIcon />}
                accessibleLabel={appText.switchDirection}
                disabled={navigation ? !navigation.canSwitchDirection : !isBoundSwitchable}
                shortcut="End"
                shortcutLabel="End"
                onClick={navigation?.onSwitchDirection ?? (() => dispatch(changeBoundThunk()))}
            />
            <ControlButton
                icon={<RestartAltIcon />}
                accessibleLabel={appText.resetToFirstStop}
                disabled={navigation ? !navigation.canReset : !isUserSelectedRoute || currentStopIndex === 0}
                shortcut="Home"
                shortcutLabel="Home"
                onClick={navigation?.onReset ?? (() => dispatch(resetToFirstStop()))}
            />
            </div>
        </div>
    )
}

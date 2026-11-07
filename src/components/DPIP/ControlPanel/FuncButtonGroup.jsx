import { useState } from 'react'
import { shallowEqual, useSelector, useDispatch } from 'react-redux'
import { getAppTextConfig } from '@components/sharedComponentConfig'
import { setCustomizeDriverInfoToggle } from '@store/userPreferenceSlice'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import AspectRatioIcon from '@mui/icons-material/AspectRatio'
import { ControlButton } from './ControlButton'
import { getControlPanelText } from './controlPanelConfig'
import { useWindowSize } from '@hooks'

export const MonitorModeButton = ({ isMainMonitorWide, onToggleMainMonitorStyle }) => {
    const { isDesktop } = useWindowSize()
    const language = useSelector(state => state.userPreference.language)
    const appText = getAppTextConfig(language)
    const text = getControlPanelText(language)

    return (
        <ControlButton
            tone="display"
            icon={<AspectRatioIcon />}
            label={isDesktop
                ? isMainMonitorWide ? text.normal : text.wide
                : isMainMonitorWide ? text.returnToNormal : text.tryWide}
            supportingText={isDesktop ? undefined : isMainMonitorWide ? text.wideDescription : text.normalDescription}
            accessibleLabel={appText.mainDisplayStyle}
            tooltip={`${isMainMonitorWide ? appText.wideDisplayMode : appText.normalDisplayMode} · ${appText.mainDisplayStyleTooltip}`}
            pressed={isMainMonitorWide}
            onClick={onToggleMainMonitorStyle}
        />
    )
}

export const FuncButtonGroup = ({
    mainScreenTarget, secScreenTarget, isMainMonitorWide, onToggleMainMonitorStyle,
    includeMode = true,
    includeAuxiliary = true, routeSelected,
}) => {
    const { isDesktop } = useWindowSize()
    const isUserSelectedRoute = useSelector(state => state.routeSelection.isUserSelectedRoute)
    const { customizeDriverInfoToggle, language } = useSelector(state => ({
        customizeDriverInfoToggle: state.userPreference.customizeDriverInfoToggle,
        language: state.userPreference.language,
    }), shallowEqual)
    const appText = getAppTextConfig(language)
    const text = getControlPanelText(language)
    const dispatch = useDispatch()
    const [fullscreenFailed, setFullscreenFailed] = useState(false)
    const supportsFullscreen = typeof document !== 'undefined' && Boolean(document.fullscreenEnabled)
    const fullscreenDisabled = !(routeSelected ?? isUserSelectedRoute) || !supportsFullscreen
    const fullscreenDisabledReason = !supportsFullscreen ? text.fullscreenUnsupported : appText.fullscreenTooltip
    const mainFullscreenDisabled = fullscreenDisabled || isMainMonitorWide

    const openFullscreen = async (target) => {
        if (fullscreenDisabled || (isMainMonitorWide && target === mainScreenTarget) || !target.current) return
        setFullscreenFailed(false)
        try {
            await target.current.requestFullscreen()
        } catch {
            setFullscreenFailed(true)
        }
    }

    return (
        <>
            <div className="control-panel__tools">
                {includeMode && (
                    <MonitorModeButton
                        isMainMonitorWide={isMainMonitorWide}
                        onToggleMainMonitorStyle={onToggleMainMonitorStyle}
                    />
                )}
                <ControlButton
                    tile
                    icon={<FullscreenIcon />}
                    label={isDesktop ? text.mainScreenShort : text.mainScreen}
                    supportingText={!isDesktop && isMainMonitorWide ? text.fullscreenWideDisabled : undefined}
                    accessibleLabel={isMainMonitorWide ? `${appText.fullscreenMain} · ${text.fullscreenWideDisabled}` : appText.fullscreenMain}
                    tooltip={isMainMonitorWide ? text.fullscreenWideDisabled : fullscreenDisabled ? fullscreenDisabledReason : appText.fullscreenMain}
                    disabled={mainFullscreenDisabled}
                    onClick={() => openFullscreen(mainScreenTarget)}
                />
                {includeAuxiliary && <ControlButton
                    tile
                    icon={<FullscreenIcon />}
                    label={isDesktop ? text.auxiliaryScreenShort : text.auxiliaryScreen}
                    accessibleLabel={appText.fullscreenSec}
                    tooltip={fullscreenDisabled ? fullscreenDisabledReason : appText.fullscreenSec}
                    disabled={fullscreenDisabled}
                    onClick={() => openFullscreen(secScreenTarget)}
                />}
                <ControlButton
                    tile
                    icon={<BadgeOutlinedIcon />}
                    label={text.driver}
                    accessibleLabel={appText.customizeDriverInfo}
                    tooltip={appText.driverInfoTooltip}
                    active={customizeDriverInfoToggle}
                    aria-expanded={customizeDriverInfoToggle}
                    aria-controls={customizeDriverInfoToggle ? 'control-driver-details' : undefined}
                    onClick={() => dispatch(setCustomizeDriverInfoToggle(!customizeDriverInfoToggle))}
                />
            </div>
            {fullscreenFailed && <p className="control-panel__error" role="alert">{text.fullscreenError}</p>}
        </>
    )
}

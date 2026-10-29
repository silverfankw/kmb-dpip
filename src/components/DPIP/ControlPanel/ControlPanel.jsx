import { useRef, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import AspectRatioIcon from '@mui/icons-material/AspectRatio'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import { NavButtonGroup, ToggleButtonGroup, FuncButtonGroup, DriverInfoInputGroup } from '@components'
import { ControlButton } from './ControlButton'
import { getControlPanelText } from './controlPanelConfig'
import '@styles/controlPanel.css'

export const ControlPanel = ({
    mainScreenTarget,
    secScreenTarget,
    isMainMonitorWide,
    onToggleMainMonitorStyle,
    uiMode = 'night',
}) => {
    const { customizeDriverInfoToggle, language } = useSelector(state => ({
        customizeDriverInfoToggle: state.userPreference.customizeDriverInfoToggle,
        language: state.userPreference.language,
    }), shallowEqual)
    const text = getControlPanelText(language)
    const [mobileSection, setMobileSection] = useState(null)
    const mobileTabsRef = useRef(null)

    const toggleSection = (section) => setMobileSection(current => current === section ? null : section)
    const closeOnEscape = (event) => {
        if (event.key !== 'Escape' || !mobileSection) return
        mobileTabsRef.current?.querySelector(`[aria-controls="control-${mobileSection}-section"]`)?.focus()
        setMobileSection(null)
    }

    return (
        <div className="control-panel" data-theme={uiMode} data-mobile-section={mobileSection || ''} onKeyDown={closeOnEscape}>
            <section className="control-panel__section control-panel__section--navigation" aria-labelledby="control-navigation-title">
                <h2 id="control-navigation-title" className="control-panel__heading">{text.navigation}</h2>
                <NavButtonGroup />
            </section>

            <section id="control-display-section" className="control-panel__section control-panel__section--display" aria-labelledby="control-display-title">
                <h2 id="control-display-title" className="control-panel__heading">{text.display}</h2>
                <FuncButtonGroup
                    mainScreenTarget={mainScreenTarget}
                    secScreenTarget={secScreenTarget}
                    isMainMonitorWide={isMainMonitorWide}
                    onToggleMainMonitorStyle={onToggleMainMonitorStyle}
                />
                {customizeDriverInfoToggle && (
                    <section id="control-driver-details" className="control-panel__driver-editor" aria-labelledby="control-driver-title">
                        <h2 id="control-driver-title" className="control-panel__heading">{text.driverDetails}</h2>
                        <div className="control-panel__driver-fields">
                            <DriverInfoInputGroup />
                        </div>
                    </section>
                )}
            </section>

            <section id="control-alerts-section" className="control-panel__section control-panel__section--alerts" aria-labelledby="control-alerts-title">
                <h2 id="control-alerts-title" className="control-panel__heading">{text.alerts}</h2>
                <ToggleButtonGroup />
            </section>

            <div className="control-panel__mobile-tabs" ref={mobileTabsRef}>
                <ControlButton
                    icon={<AspectRatioIcon />}
                    label={text.display}
                    active={mobileSection === 'display'}
                    aria-expanded={mobileSection === 'display'}
                    aria-controls="control-display-section"
                    onClick={() => toggleSection('display')}
                />
                <ControlButton
                    icon={<NotificationsNoneIcon />}
                    label={text.alerts}
                    active={mobileSection === 'alerts'}
                    aria-expanded={mobileSection === 'alerts'}
                    aria-controls="control-alerts-section"
                    onClick={() => toggleSection('alerts')}
                />
            </div>
        </div>
    )
}

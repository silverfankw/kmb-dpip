import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import AspectRatioIcon from '@mui/icons-material/AspectRatio'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { NavButtonGroup, ToggleButtonGroup, FuncButtonGroup, DriverInfoInputGroup } from '@components'
import { ControlButton } from './ControlButton'
import { getControlPanelText } from './controlPanelConfig'
import { StopBellButton } from './ToggleButtonGroup'
import { MonitorModeButton } from './FuncButtonGroup'
import { useWindowSize } from '@hooks'
import {
    desktopControlPositions, readDesktopControlPreferences, saveDesktopControlPreferences,
} from './desktopControlPreferences'
import '@styles/controlPanel/controlPanel.css'

export const ControlPanel = ({
    mainScreenTarget,
    secScreenTarget,
    isMainMonitorWide,
    onToggleMainMonitorStyle,
    uiMode = 'night',
}) => {
    const { customizeDriverInfoToggle, language, stopPressed, showHandrailNotice, showMindDoorNotice } = useSelector(state => ({
        customizeDriverInfoToggle: state.userPreference.customizeDriverInfoToggle,
        language: state.userPreference.language,
        stopPressed: state.userPreference.stopPressed,
        showHandrailNotice: state.userPreference.showHandrailNotice,
        showMindDoorNotice: state.userPreference.showMindDoorNotice,
    }), shallowEqual)
    const text = getControlPanelText(language)
    const { isDesktop } = useWindowSize()
    const [mobileSection, setMobileSection] = useState(null)
    const [desktopPreferences, setDesktopPreferences] = useState(readDesktopControlPreferences)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const desktopCollapsed = desktopPreferences.collapsed
    const controlsId = useId()
    const settingsId = useId()
    const desktopToggleRef = useRef(null)
    const settingsToggleRef = useRef(null)
    const mobileTabsRef = useRef(null)
    const panelRef = useRef(null)
    const hasActiveAlerts = stopPressed || showHandrailNotice || showMindDoorNotice
    const activeNotice = showHandrailNotice ? text.handrailActive : showMindDoorNotice ? text.doorActive : ''

    useEffect(() => {
        saveDesktopControlPreferences(desktopPreferences)
    }, [desktopPreferences])

    useLayoutEffect(() => {
        const panel = panelRef.current
        const layout = panel.closest('.app-layout')
        const updateHeight = () => {
            const height = `${panel.getBoundingClientRect().height}px`
            layout.style.setProperty('--mobile-controls-height', height)
            layout.style.setProperty('--desktop-controls-height', height)
        }
        updateHeight()
        const observer = new ResizeObserver(updateHeight)
        observer.observe(panel)
        return () => {
            observer.disconnect()
            layout.style.removeProperty('--mobile-controls-height')
            layout.style.removeProperty('--desktop-controls-height')
        }
    }, [])

    const toggleSection = (section) => setMobileSection(current => current === section ? null : section)
    const toggleDesktopCollapsed = () => {
        setSettingsOpen(false)
        setDesktopPreferences(current => ({ ...current, collapsed: !current.collapsed }))
    }
    const closeOnEscape = (event) => {
        if (event.key !== 'Escape') return
        if (isDesktop) {
            event.stopPropagation()
            if (settingsOpen) {
                setSettingsOpen(false)
                settingsToggleRef.current?.querySelector('button')?.focus()
            } else {
                setDesktopPreferences(current => ({ ...current, collapsed: true }))
                desktopToggleRef.current?.querySelector('button')?.focus()
            }
            return
        }
        if (!mobileSection) return
        mobileTabsRef.current?.querySelector(`[aria-controls="control-${mobileSection}-section"]`)?.focus()
        setMobileSection(null)
    }

    return (
        <div
            ref={panelRef}
            className="control-panel"
            data-theme={uiMode}
            data-mobile-section={mobileSection || ''}
            data-desktop-collapsed={desktopCollapsed}
            data-desktop-position={desktopPreferences.position}
            data-settings-open={settingsOpen}
            onKeyDown={closeOnEscape}
        >
            <div className="control-panel__desktop-header">
                <h2 className="control-panel__heading">{text.quickControls}</h2>
                <div className="control-panel__active-alerts" role="status" aria-atomic="true">
                    {stopPressed && <span className="control-panel__alert-badge control-panel__alert-badge--bell">{text.bellActive}</span>}
                    {activeNotice && <span className="control-panel__alert-badge">{activeNotice}</span>}
                </div>
                <div ref={desktopToggleRef}>
                    <ControlButton
                        icon={desktopCollapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        label={desktopCollapsed ? text.expandControls : text.collapseControls}
                        aria-expanded={!desktopCollapsed}
                        aria-controls={controlsId}
                        onClick={toggleDesktopCollapsed}
                    />
                </div>
            </div>
            <div id={controlsId} className="control-panel__body">
                <section className="control-panel__section control-panel__section--navigation" aria-labelledby="control-navigation-title">
                    <h2 id="control-navigation-title" className="control-panel__heading">{text.navigation}</h2>
                    <NavButtonGroup />
                </section>

                <div id={settingsId} className="control-panel__settings">
                    <section id="control-display-section" className="control-panel__section control-panel__section--display" aria-labelledby="control-display-title">
                        <h2 id="control-display-title" className="control-panel__heading">{text.display}</h2>
                        <FuncButtonGroup
                            mainScreenTarget={mainScreenTarget}
                            secScreenTarget={secScreenTarget}
                            isMainMonitorWide={isMainMonitorWide}
                            onToggleMainMonitorStyle={onToggleMainMonitorStyle}
                            includeMode={!isDesktop}
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
                        <ToggleButtonGroup includeBell={!isDesktop} />
                    </section>

                    <div className="control-panel__position-settings" role="group" aria-label={text.panelPosition}>
                        <span className="control-panel__heading">{text.panelPosition}</span>
                        {desktopControlPositions.map(position => (
                            <button
                                key={position}
                                type="button"
                                className="control-panel__position-button"
                                aria-pressed={desktopPreferences.position === position}
                                onClick={() => setDesktopPreferences(current => ({ ...current, position }))}
                    >
                                {text.positions[position]}
                            </button>
                ))}
                    </div>
                </div>

                <div className="control-panel__desktop-actions">
                    {isDesktop && (
                        <MonitorModeButton
                            isMainMonitorWide={isMainMonitorWide}
                            onToggleMainMonitorStyle={onToggleMainMonitorStyle}
                        />
                    )}
                    <StopBellButton />
                    <div ref={settingsToggleRef}>
                        <ControlButton
                            icon={<SettingsOutlinedIcon />}
                            label={text.settings}
                            accessibleLabel={hasActiveAlerts ? `${text.settings} · ${text.alertsActive}` : text.settings}
                            active={settingsOpen}
                            aria-expanded={settingsOpen}
                            aria-controls={settingsId}
                            onClick={() => setSettingsOpen(current => !current)}
                    />
                    </div>
                </div>

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
                        label={hasActiveAlerts ? text.alertsActive : text.alerts}
                        active={mobileSection === 'alerts'}
                        aria-expanded={mobileSection === 'alerts'}
                        aria-controls="control-alerts-section"
                        onClick={() => toggleSection('alerts')}
                />
                </div>
            </div>
        </div>
    )
}

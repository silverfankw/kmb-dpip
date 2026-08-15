import { useSelector } from 'react-redux'

import { NavButtonGroup, ToggleButtonGroup, FuncButtonGroup, DriverInfoInputGroup } from '@components'

const styles = {
    layout: "grid w-full gap-2",
    sectionBase: [
        "rounded-[1rem]",
        "p-2 md:p-2.5",
    ].join(" "),
    sectionNight: "border border-white/8 bg-gradient-to-br from-white/[0.07] to-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_18px_rgba(0,0,0,0.14)]",
    sectionLight: "border border-slate-200/90 bg-white/88 shadow-[0_8px_18px_rgba(148,163,184,0.14)]",
    utilitySection: "grid gap-2 xl:grid-cols-2",
    driverInfoGrid: "grid gap-2 md:grid-cols-3",
}

export const ControlPanel = ({ mainScreenTarget, secScreenTarget, uiMode = "night" }) => {
    const userPreference = useSelector(state => state.userPreference)
    const sectionClassName = `${styles.sectionBase} ${uiMode === "light" ? styles.sectionLight : styles.sectionNight}`

    const renderSection = (content, key) => (
        <section key={key} className={sectionClassName}>
            {content}
        </section>
    )

    const utilitySections = [
        {
            key: 'toggle-button-group',
            content: <ToggleButtonGroup />,
        },
        {
            key: 'func-button-group',
            content: (
                <FuncButtonGroup
                    mainScreenTarget={mainScreenTarget}
                    secScreenTarget={secScreenTarget}
                />
            ),
        },
    ]

    const panelSections = [
        {
            key: 'nav-button-group',
            position: 'single',
            content: <NavButtonGroup />,
        },
        {
            key: 'utility-section',
            position: 'group',
            content: (
                <div className={styles.utilitySection}>
                    {utilitySections.map(({ key, content }) =>
                        renderSection(content, key)
                    )}
                </div>
            ),
        },
        ...(userPreference.customizeDriverInfoToggle
            ? [{
                key: 'driver-info-section',
                position: 'single',
                content: (
                    <div className={styles.driverInfoGrid}>
                        <DriverInfoInputGroup />
                    </div>
                ),
            }]
            : []),
    ]

    return (
        <div className={styles.layout}>
            {panelSections.map(({ key, position, content }) => (
                position === 'group'
                    ? <div key={key}>{content}</div>
                    : renderSection(content, key)
            ))}
        </div>
    )
}
import { useSelector } from 'react-redux'

import { NavButtonGroup, ToggleButtonGroup, FuncButtonGroup, DriverInfoInputGroup } from '@components'

const styles = {
    layout: "grid w-full gap-2.5 sm:gap-3",
    sectionBase: [
        "rounded-[1rem]",
        "p-2.5 md:p-3",
        "border",
    ].join(" "),
    sectionNight: "border-slate-300/12 bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(15,23,42,0.71))] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-1px_0_rgba(15,23,42,0.76),0_10px_24px_rgba(2,6,23,0.2)]",
    sectionLight: "border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_24px_rgba(148,163,184,0.12)]",
    utilitySection: "grid gap-2.5 xl:grid-cols-2",
    driverInfoGrid: "grid gap-2.5 md:grid-cols-3",
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
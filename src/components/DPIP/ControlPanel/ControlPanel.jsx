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

    return (
        <div className={styles.layout}>
            <section className={sectionClassName}>
                <NavButtonGroup />
            </section>

            <div className={styles.utilitySection}>
                <section className={sectionClassName}>
                    <ToggleButtonGroup />
                </section>

                <section className={sectionClassName}>
                    <FuncButtonGroup
                        mainScreenTarget={mainScreenTarget}
                        secScreenTarget={secScreenTarget}
                    />
                </section>
            </div>

            {userPreference.customizeDriverInfoToggle &&
                <section className={sectionClassName}>
                    <div className={styles.driverInfoGrid}>
                        <DriverInfoInputGroup />
                    </div>
                </section>
            }
        </div>
    )
}
import { useSelector } from 'react-redux'

import { NavButtonGroup, ToggleButtonGroup, FuncButtonGroup, DriverInfoInputGroup } from '@components'

const styles = {
    layout: "grid w-full gap-2",
    section: [
        "rounded-[1rem]",
        "border border-white/8",
        "bg-gradient-to-br from-white/[0.07] to-white/[0.03]",
        "p-2 md:p-2.5",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_18px_rgba(0,0,0,0.14)]"
    ].join(" "),
    utilitySection: "grid gap-2 xl:grid-cols-2",
    driverInfoGrid: "grid gap-2 md:grid-cols-3",
}

export const ControlPanel = ({ mainScreenTarget, secScreenTarget }) => {
    const userPreference = useSelector(state => state.userPreference)

    return (
        <div className={styles.layout}>
            <section className={styles.section}>
                <NavButtonGroup />
            </section>

            <div className={styles.utilitySection}>
                <section className={styles.section}>
                    <ToggleButtonGroup />
                </section>

                <section className={styles.section}>
                    <FuncButtonGroup
                        mainScreenTarget={mainScreenTarget}
                        secScreenTarget={secScreenTarget}
                    />
                </section>
            </div>

            {userPreference.customizeDriverInfoToggle &&
                <section className={styles.section}>
                    <div className={styles.driverInfoGrid}>
                        <DriverInfoInputGroup />
                    </div>
                </section>
            }
        </div>
    )
}
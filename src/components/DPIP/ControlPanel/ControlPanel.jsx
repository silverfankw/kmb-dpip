import { useSelector } from 'react-redux'

import { NavButtonGroup, ToggleButtonGroup, FuncButtonGroup, DriverInfoInputGroup } from '@components'

const styles = {
    groupWrapper: "flex flex-wrap gap-5 max-md:gap-3 justify-center",
    switchGroupWrapper: "!gap-4",
    driverInfoSection: "flex text-center items-center text-white gap-3",
}

export const ControlPanel = ({ mainScreenTarget, secScreenTarget }) => {

    const userPreference = useSelector(state => state.userPreference)

    return (
        <>
            <div className={styles.groupWrapper}>
                <NavButtonGroup />
            </div>

            <div className={styles.groupWrapper + " " + styles.switchGroupWrapper}>
                <ToggleButtonGroup />
            </div>

            <div className={styles.groupWrapper}>
                <FuncButtonGroup
                    mainScreenTarget={mainScreenTarget}
                    secScreenTarget={secScreenTarget}
                />
            </div>

            {/* Customizeable driver info with input group */}
            {userPreference.customizeDriverInfoToggle &&
                <section className={styles.driverInfoSection}>
                    <DriverInfoInputGroup />
                </section>
            }
        </>
    )
}
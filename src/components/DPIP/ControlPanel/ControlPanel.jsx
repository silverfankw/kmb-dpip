import { useSelector } from 'react-redux'

import { NavButtonGroup, ToggleButtonGroup, FuncButtonGroup, DriverInfoInputGroup } from '@components'

const styleClasses = {
    groupWrapper: "flex flex-wrap gap-4 max-md:gap-3",
    divider: "block max-2xl:hidden w-px bg-gray-300 mx-2",
    driverInfoSection: "flex text-center items-center text-white gap-3",
}

export const ControlPanel = ({ mainScreenTarget, secScreenTarget }) => {

    const userPreference = useSelector(state => state.userPreference)

    return (
        <>
            <div className={styleClasses.groupWrapper}>
                <NavButtonGroup />
            </div>

            <div className={styleClasses.divider} />

            <div className={styleClasses.groupWrapper}>
                <ToggleButtonGroup />
            </div>

            <div className={styleClasses.divider} />

            <div className={styleClasses.groupWrapper}>
                <FuncButtonGroup
                    mainScreenTarget={mainScreenTarget}
                    secScreenTarget={secScreenTarget}
                />
            </div>

            {/* Customizeable driver info with input group */}
            {userPreference.customizeDriverInfoToggle &&
                <section className={styleClasses.driverInfoSection}>
                    <DriverInfoInputGroup />
                </section>
            }
        </>
    )
}
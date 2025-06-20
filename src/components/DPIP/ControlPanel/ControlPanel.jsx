
import { NavButtonGroup, ToggleButtonGroup, FuncButtonGroup, DriverInfoInputGroup } from '@components'

const styleClasses = {
    groupWrapper: "flex flex-wrap gap-4 max-md:w-full max-md:flex-col",
    divider: "hidden md:block w-px bg-gray-300 mx-2",
    button: "h-[48px] max-md:h-[64px]",
    driverInfoSection: "flex text-center items-center text-white gap-3",
}

export const ControlPanel = ({
    isUserSelectedRoute,
    isPrevStopAvailable,
    isNextStopAvailable,
    toPrevStop,
    toNextStop,
    currentStopIndex,
    setCurrentStopIndex,
    changeBound,
    routeHasTwoBound,
    routeDetail,
    userPreference,
    dispatchUserPreference,
    mainScreenTarget,
    secScreenTarget,
}) => {



    return (
        <>
            <div className={styleClasses.groupWrapper}>
                <NavButtonGroup
                    isUserSelectedRoute={isUserSelectedRoute}
                    isPrevStopAvailable={isPrevStopAvailable}
                    isNextStopAvailable={isNextStopAvailable}
                    toPrevStop={toPrevStop}
                    toNextStop={toNextStop}
                    currentStopIndex={currentStopIndex}
                    setCurrentStopIndex={setCurrentStopIndex}
                    routeHasTwoBound={routeHasTwoBound}
                    changeBound={changeBound}
                    routeDetail={routeDetail}
                />
            </div>

            <div className={styleClasses.divider} />

            <div className={styleClasses.groupWrapper}>
                <ToggleButtonGroup
                    userPreference={userPreference}
                    dispatchUserPreference={dispatchUserPreference} />
            </div>

            <div className={styleClasses.divider} />

            <div className={styleClasses.groupWrapper}>
                <FuncButtonGroup
                    isUserSelectedRoute={isUserSelectedRoute}
                    userPreference={userPreference}
                    dispatchUserPreference={dispatchUserPreference}
                    mainScreenTarget={mainScreenTarget}
                    secScreenTarget={secScreenTarget}
                />
            </div>

            {/* Customizeable driver info with input group */}
            {userPreference.customizeDriverInfoToggle &&
                <section className={styleClasses.driverInfoSection}>
                    <DriverInfoInputGroup
                        userPreference={userPreference}
                        dispatchUserPreference={dispatchUserPreference} />
                </section>
            }
        </>
    )
}
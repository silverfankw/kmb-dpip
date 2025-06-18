import './App.css'

import { useState, useRef, useMemo, useCallback, useReducer } from 'react'
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation"
import { useRouteList } from './hooks/useRouteList'
import { useRouteSelection } from "./hooks/useRouteSelection"
import { userPreferenceReducer, initialUserPreference } from "./reducers/userPreferenceReducer"

import { createFilter } from 'react-select'
import { routeContext } from './context/Provider'

import AsyncSelect from 'react-select/async'
import { DPIPSecScreen } from './DpipSecScreen'
import { DPIPMainScreen } from './DpipMainScreen'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Footer, DPIPButtonGroup, SwitchGroup, DriverInfoInputGroup } from './component'
import { isEmptyObject } from '../utility/Util'

const styleClasses = {
	container: "select-none focus:outline-hidden p-[2rem] flex flex-col gap-2",
	querySection: "flex gap-3",
	asyncSelectWrapper: "w-full md:w-2/3 lg:w-2/3 xl:w-2/5 2xl:w-2/5 z-3",
	switchSection: "flex flex-wrap gap-[10px] my-[0.5em]",
	buttonSection: "flex flex-wrap gap-[15px] mb-[1em] mx-0 select-none",
	driverInfoSection: "flex gap-3 mb-[1em]",
	screenSection: "py-4 flex flex-wrap gap-10",
	monitorStyleOptions: {
		basic: "w-[800px] h-[480px] max-xl:w-[700px] max-xl:h-[420px] max-md:w-[600px] max-md:h-[360px] max-sm:w-[500px] max-sm:h-[330px] shadow-[0.5rem_0.5rem_1rem_0.25rem_#FFF] max-md:border-[.25em] border-[.375rem] border-solid border-[#0e0e0fbf] rounded-xl outline outline-[0.875rem] outline-[#000000] z-1",
		new: "border-solid border-black "
	}
}

const App = () => {

	const routeList = useRouteList()

	const {
		routeDetail,
		currentStopIndex,
		setCurrentStopIndex,
		routeHasTwoBound,
		selectRoute,
		changeBound,
	} = useRouteSelection(routeList)

	const mainScreenTarget = useRef(null)
	const secScreenTarget = useRef(null)

	const [inputValue, setInputValue] = useState("")
	const [userPreference, dispatchUserPreference] = useReducer(
		userPreferenceReducer, initialUserPreference
	)

	const lastStopIndex = useMemo(() => routeDetail?.stops?.length - 1, [routeDetail])

	const isPrevStopAvailable = useMemo(() => currentStopIndex > 0, [currentStopIndex])

	const isNextStopAvailable = useMemo(() => currentStopIndex + 1 <= lastStopIndex,
		[currentStopIndex, lastStopIndex]
	)

	const searchRoute = useCallback((inputValue, callback) => {
		let filtered

		if (!inputValue) {
			filtered = routeList.slice(0, 50)
		}
		else {
			const upperCaseInput = inputValue.toUpperCase()
			filtered = routeList.filter(route => route.route.toUpperCase().includes(upperCaseInput))
		}

		callback(filtered.map(route => (
			{
				label: `${route.route} ｜ ${route.orig_tc} 往 ${route.dest_tc} ｜${route.service_type != 1 ? "＊特別班" : ""}`,
				value: JSON.stringify(route)
			}
		)))
	}, [routeList])


	const toPrevStop = useCallback(
		() => { if (isPrevStopAvailable) setCurrentStopIndex(prev => prev - 1) },
		[isPrevStopAvailable, setCurrentStopIndex]
	)

	const toNextStop = useCallback(
		() => { if (isNextStopAvailable) setCurrentStopIndex(prev => prev + 1) },
		[isNextStopAvailable, setCurrentStopIndex]
	)

	useKeyboardNavigation({
		onPrev: toPrevStop,
		onNext: toNextStop,
		onHome: () => setCurrentStopIndex(0),
		onEnd: changeBound,
		isActive: !isEmptyObject(routeDetail),
		debounceMs: 50,
		isDisabled: false,
	})

	const theme = createTheme({
		palette: {
			ochre: {
				main: '#E3D026',
				light: '#E9DB5D',
				dark: '#A29415',
				contrastText: '#242105',
			},

			snowwhite: {
				main: "#FFFFFF",
			}
		},
	})

	return (
		<ThemeProvider theme={theme}>
			<routeContext.Provider value={{ routeDetail, currentStopIndex, lastStopIndex, userPreference }}>
				<div className={styleClasses.container} tabIndex={1}>

					{/* Query section for route input and selection */}
					<section className={styleClasses.querySection}>
						<div className={styleClasses.asyncSelectWrapper}>
							<AsyncSelect
								inputValue={inputValue}
								onInputChange={setInputValue}
								autoCapitalize="characters"
								autoFocus
								isClearable
								cacheOptions
								defaultOptions={routeList.slice(0, 50).map(route => ({
									label: `${route.route} ｜ ${route.orig_tc} 往 ${route.dest_tc}`,
									value: JSON.stringify(route)
								}))} placeholder="請輸入九巴路線編號。 Please input KMB route."
								filterOption={createFilter({ matchFrom: "start" })}
								loadOptions={searchRoute}
								onChange={selectRoute}
							/>
						</div>
					</section>

					{/* Switch groups to control DPIP */}
					<section className={styleClasses.switchSection}>
						<SwitchGroup
							userPreference={userPreference}
							dispatchUserPreference={dispatchUserPreference} />
					</section>

					{/* Button groups to control DPIP */}
					<section className={styleClasses.buttonSection}>
						<DPIPButtonGroup
							isPrevStopAvailable={isPrevStopAvailable}
							isNextStopAvailable={isNextStopAvailable}
							toPrevStop={toPrevStop}
							toNextStop={toNextStop}
							currentStopIndex={currentStopIndex}
							setCurrentStopIndex={setCurrentStopIndex}
							routeHasTwoBound={routeHasTwoBound}
							changeBound={changeBound}
							routeDetail={routeDetail}
							userPreference={userPreference}
							dispatchUserPreference={dispatchUserPreference}
							mainScreenTarget={mainScreenTarget}
							secScreenTarget={secScreenTarget} />
					</section>

					{/* Customizeable driver info with input group */}
					{userPreference.customizeDriverInfoToggle &&
						<section className={styleClasses.driverInfoSection}>
							<DriverInfoInputGroup
								userPreference={userPreference}
								dispatchUserPreference={dispatchUserPreference} />
						</section>}

					{/* DPIP main screen with full details */}
					<section className={styleClasses.screenSection}>
						<DPIPMainScreen
							detail={routeDetail}
							currentStopIndex={currentStopIndex}
							userPreference={userPreference}
							monitorStyleOptions={styleClasses.monitorStyleOptions}
							screenTarget={mainScreenTarget}
						/>

						<DPIPSecScreen
							stops={routeDetail.stops}
							currentStopIndex={currentStopIndex}
							userPreference={userPreference}
							monitorStyleOptions={styleClasses.monitorStyleOptions}
							screenTarget={secScreenTarget}

						/>

					</section>

					{/* Footer section */}
					<Footer />
				</div >
			</routeContext.Provider>
		</ThemeProvider >
	)
}

export default App

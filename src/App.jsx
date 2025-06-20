import "@css/asyncSelect.css"
import { createTheme, ThemeProvider } from '@mui/material/styles'

import { useState, useRef, useMemo, useCallback, useReducer } from 'react'
import { useKeyboardNavigation, useRouteList, useRouteSelection } from "@hooks"
import { userPreferenceReducer, initialUserPreference } from "@reducers/userPreferenceReducer"
import { routeContext } from '@contexts/Provider'

import {
	Background,
	Footer,
	ControlPanel,
	MainDisplayPanel,
	AuxiliaryDisplayPanel,
} from '@components'

import AsyncSelect from 'react-select/async'

const styleClasses = {
	container: "select-none focus:outline-hidden p-[2rem] flex flex-col gap-3",
	querySection: "flex gap-3 bg-black/60 backdrop-blur-md shadow-2xl rounded-2xl p-6 items-center justify-center max-md:flex-col max-md:gap-2 border border-gray-700",
	asyncSelectWrapper: "w-full md:w-2/3 xl:w-1/2",
	controlPanelSection: "flex flex-wrap gap-4 justify-center bg-[#18181b]/80 rounded-2xl shadow-lg p-6 w-full max-md:flex-col max-md:gap-3 border border-gray-700",
	screenPanelSection: "py-4 flex flex-wrap items-center justify-center gap-10",
	monitorStyleOptions: {
		basic: "w-[800px] h-[480px] max-xl:w-[700px] max-xl:h-[420px] max-md:w-[600px] max-md:h-[360px] max-sm:w-[500px] max-sm:h-[330px] shadow-[0.5rem_0.5rem_1rem_0.25rem_#23272f] max-md:border-[.25em] border-[.375rem] border-solid border-[#23272f] rounded-xl outline outline-[0.875rem] outline-[#000000] z-1",
		new: "border-solid border-black "
	}
}

const App = () => {

	const routeList = useRouteList()

	// Create first 50 default routes dropdown for the input
	const defaultRouteOptions = routeList?.slice(0, 50)?.map(route => ({
		label: `${route.route} ｜ ${route.orig_tc} 往 ${route.dest_tc}`,
		value: `${route.route}-${route.bound}-${route.service_type}`,
		detail: route
	}))

	const mainScreenTarget = useRef(null)
	const secScreenTarget = useRef(null)

	const [selectedOption, setSelectedOption] = useState(null)

	// To store the previous dropdown options for async-select after route selection
	const [prevOptions, setPrevOptions] = useState([])

	const [userPreference, dispatchUserPreference] = useReducer(
		userPreferenceReducer, initialUserPreference
	)

	const {
		isUserSelectedRoute,
		routeDetail,
		currentStopIndex,
		setCurrentStopIndex,
		routeHasTwoBound,
		selectRoute,
		changeBound,
	} = useRouteSelection(routeList)

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
			filtered = routeList.filter(route => route.route.toUpperCase().startsWith(upperCaseInput))
		}

		const results = filtered.map(route => (
			{
				label: `${route.route} ｜ ${route.orig_tc} 往 ${route.dest_tc} ｜${route.service_type != 1 ? "＊特別班" : ""}`,
				value: `${route.route}-${route.bound}-${route.service_type}`,
				detail: route
			}
		))

		setPrevOptions(results)
		callback(results)
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
		isUserSelectedRoute,
		debounceMs: 100,
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
				<Background />

				<div className={styleClasses.container} tabIndex={1}>

					{/* Query section for route input and selection */}
					<section className={styleClasses.querySection}>
						<div className={styleClasses.asyncSelectWrapper}>
							<AsyncSelect
								inputId="routeInput"
								classNamePrefix="routeInputSelect"
								menuPortalTarget={document.body}
								styles={{
									menuPortal: base => ({ ...base, zIndex: 9999 }),
								}}
								autoFocus
								isClearable
								cacheOptions
								defaultOptions={
									prevOptions.length == 0 ?
										defaultRouteOptions : prevOptions}
								placeholder="請輸入九巴路線編號。 Please input KMB route."
								loadOptions={searchRoute}
								value={selectedOption}
								onChange={option => {
									selectRoute(option.detail)
									setSelectedOption(option)
								}}
							/>
						</div>
					</section>

					{/* Control Panel with buttons and switches to control DPIP */}
					<section className={styleClasses.controlPanelSection}>
						<ControlPanel
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
							userPreference={userPreference}
							dispatchUserPreference={dispatchUserPreference}
							mainScreenTarget={mainScreenTarget}
							secScreenTarget={secScreenTarget} />
					</section>

					{/* DPIP main screen with full details */}
					<section className={styleClasses.screenPanelSection}>
						<MainDisplayPanel
							detail={routeDetail}
							currentStopIndex={currentStopIndex}
							userPreference={userPreference}
							monitorStyleOptions={styleClasses.monitorStyleOptions}
							screenTarget={mainScreenTarget}
						/>

						<AuxiliaryDisplayPanel
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

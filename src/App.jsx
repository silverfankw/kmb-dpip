import "@css/asyncSelect.css"
import { createTheme, ThemeProvider } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import AsyncSelect from 'react-select/async'
import {
	Background,
	Footer,
	ControlPanel,
	MainDisplayPanel,
	AuxiliaryDisplayPanel,
} from '@components'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useKeyboardNavigation } from "@hooks"

import { fetchRouteThunk, selectDefaultRouteOptions } from "@store/routesSlice"
import {
	selectRouteThunk,
	changeBoundThunk,
	setCurrentStopIndex,
	toPrevStop,
	toNextStop
} from '@store/routeSelectionSlice'

const styleClasses = {
	container: "select-none focus:outline-hidden p-[2rem] flex flex-col gap-3",
	querySection: "flex gap-3 bg-[#18181b]/80 backdrop-blur-md shadow-2xl rounded-2xl p-6 items-center justify-center max-md:flex-col max-md:gap-2 border border-gray-700",
	asyncSelectWrapper: "flex items-center gap-4 w-full",
	controlPanelSection: "flex flex-wrap gap-5 justify-center bg-[#18181b]/80 rounded-2xl shadow-lg p-6 w-full max-md:flex-col max-md:gap-3 border border-gray-700",
	screenPanelSection: "flex flex-wrap items-center justify-center gap-10 py-4",
	monitorStyleOptions: {
		basic: "w-[800px] h-[480px] max-xl:w-[700px] max-xl:h-[420px] max-md:w-[600px] max-md:h-[360px] max-sm:w-[500px] max-sm:h-[330px] shadow-[0.5rem_0.5rem_1rem_0.25rem_#23272f] max-md:border-[.25em] border-[.375rem] border-solid border-[#23272f] rounded-xl outline outline-[0.875rem] outline-[#000000] z-1",
		new: "border-solid border-black "
	}
}

const App = () => {

	const dispatch = useDispatch()

	// Get routeList from API by executeing fetch route from Redux thunk
	useEffect(() => {
		dispatch(fetchRouteThunk())
	}, [dispatch])

	const routes = useSelector(state => state.routes)

	const { isUserSelectedRoute } = useSelector(state => state.routeSelection)

	// Create first 50 default routes dropdown for the input
	const defaultRouteOptions = useSelector(selectDefaultRouteOptions)

	const mainScreenTarget = useRef(null)
	const secScreenTarget = useRef(null)

	const [selectedOption, setSelectedOption] = useState(null)

	// To store the previous dropdown options for async-select after route selection
	const [prevOptions, setPrevOptions] = useState([])

	const searchRoute = useCallback((inputValue, callback) => {
		let filtered

		if (!inputValue) {
			filtered = routes.slice(0, 50)
		}
		else {
			const upperCaseInput = inputValue.toUpperCase()
			filtered = routes.filter(route => route.route.toUpperCase().startsWith(upperCaseInput))
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
	}, [routes])

	const selectRoute = (routeDetail) => {
		dispatch(selectRouteThunk({ routeDetail, routes }))
	}

	useKeyboardNavigation({
		onPrev: () => dispatch(toPrevStop()),
		onNext: () => dispatch(toNextStop()),
		onHome: () => dispatch(setCurrentStopIndex(0)),
		onEnd: () => dispatch(changeBoundThunk()),
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
			<Background />

			<div className={styleClasses.container} tabIndex={1}>

				{/* Query section for route input and selection */}
				<section className={styleClasses.querySection}>
					<div className={styleClasses.asyncSelectWrapper}>
						<SearchIcon style={{ color: "#999", fontSize: 28 }} />

						<div className="flex-1">
							<AsyncSelect
								inputId="routeInput"
								classNamePrefix="routeInputSelect"
								menuPortalTarget={document.body}
								styles={{
									menuPortal: base => ({ ...base, zIndex: 9999 }),
									control: (base, state) => ({
										...base,
										backgroundColor: "rgba(24, 27, 27, 0.5)",
										color: "#fff",
										borderColor: state.isFocused ? "#2563eb" : "#444",
										boxShadow: state.isFocused ? "0 0 0 2px #2563eb" : base.boxShadow,
										minHeight: 48,
									}),
									menu: base => ({
										...base,
										backgroundColor: "rgba(35, 39, 47, 0.85)",
										color: "#fff",
										zIndex: 9999,
									}),
									placeholder: (base) => ({
										...base,
										color: "#bbb", // or any color you want for the placeholder
										opacity: 1,    // ensure it's not faded out
									}),
									option: (base, state) => ({
										...base,
										backgroundColor: state.isFocused
											? "rgba(37, 99, 235, 0.85)"
											: "rgba(35, 39, 47, 0.85)",
										color: "#fff",
									}),
									input: (base) => ({
										...base,
										color: "#fff",
									}),
									singleValue: (base) => ({
										...base,
										color: "#fff",
									}),
									indicatorSeparator: (base, state) => ({
										...base,
										backgroundColor: state.isFocused ? "#2563eb" : "#444"
									}),
									dropdownIndicator: (base, state) => ({
										...base,
										color: state.isFocused ? "#2563eb" : "#444",
										"&:hover": { color: "#999" },
									}),
									clearIndicator: (base, state) => ({
										...base,
										color: state.isFocused ? "#2563eb" : "#444",
										"&:hover": { color: "#999" },
									}),
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
					</div>
				</section>

				{/* Control Panel with buttons and switches to control DPIP */}
				<section className={styleClasses.controlPanelSection}>
					<ControlPanel
						mainScreenTarget={mainScreenTarget}
						secScreenTarget={secScreenTarget} />
				</section>

				{/* DPIP main screen with full details */}
				<section className={styleClasses.screenPanelSection}>
					<MainDisplayPanel
						monitorStyleOptions={styleClasses.monitorStyleOptions}
						screenTarget={mainScreenTarget}
					/>

					<AuxiliaryDisplayPanel
						monitorStyleOptions={styleClasses.monitorStyleOptions}
						screenTarget={secScreenTarget}
					/>

				</section>

				{/* Footer section */}
				<Footer />
			</div >
		</ThemeProvider >
	)
}

export default App

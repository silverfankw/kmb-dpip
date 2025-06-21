import { useTheme } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

import {
	Background, Footer, RouteQueryInput,
	ControlPanel, MainDisplayPanel, AuxiliaryDisplayPanel,
} from '@components'

import { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useKeyboardNavigation } from "@hooks"

import { fetchRouteThunk } from "@store/routesSlice"
import {
	changeBoundThunk,
	setCurrentStopIndex, toPrevStop, toNextStop
} from '@store/routeSelectionSlice'

// Tailwind classes for layout
const styleClasses = {
	rootContainer: "min-h-screen flex flex-col items-center",

	contentContainer: [
		"flex-1",
		"select-none focus:outline-hidden",
		"p-[2rem] max-sm:p-2",
		"flex flex-col",
		"gap-3 max-sm:gap-2"
	].join(" "),

	querySection: [
		"order-1 max-sm:order-2",
		"flex gap-3 items-center justify-center",
		"bg-[#18181b]/80 backdrop-blur-md shadow-2xl rounded-2xl",
		"p-6 max-md:p-4 max-md:flex-col max-md:gap-2",
		"border border-gray-600/90"
	].join(" "),

	controlPanelSection: [
		"order-2 max-sm:order-3",
		"flex flex-wrap justify-center gap-5",
		"bg-[#18181b]/80 rounded-2xl shadow-lg",
		"p-6 w-full max-md:flex-col max-md:gap-4",
		"border border-gray-600/90"
	].join(" "),

	screenPanelSection: [
		"order-3 max-sm:order-1",
		"flex flex-wrap items-center justify-center",
		"gap-10 max-sm:gap-6 py-4"
	].join(" "),

	asyncSelectWrapper: "flex items-center gap-4 w-full",

	monitorStyle: [
		"w-[800px] h-[480px]",
		"max-xl:w-[700px] max-xl:h-[420px]",
		"max-md:w-[600px] max-md:h-[360px]",
		"max-sm:w-[400px] max-sm:h-[240px]",
		"shadow-[0.5rem_0.5rem_1rem_0.25rem_#23272f]",
		"border-[.375rem] max-md:border-[.25em] border-solid border-[#23272f]",
		"rounded-xl",
		"outline outline-[0.875rem] max-sm:outline-[0.625rem] outline-[#000000]",
		"z-1"
	].join(" "),
}

const App = () => {

	const theme = useTheme()
	const dispatch = useDispatch()

	// Get routeList from API by executeing fetch route from Redux thunk
	useEffect(() => {
		dispatch(fetchRouteThunk())
	}, [dispatch])

	const { isUserSelectedRoute } = useSelector(state => state.routeSelection)

	// Ref used for full screen function
	const mainScreenTarget = useRef(null)
	const secScreenTarget = useRef(null)

	// Hook to register keyboard event
	useKeyboardNavigation({
		onPrev: () => dispatch(toPrevStop()),
		onNext: () => dispatch(toNextStop()),
		onHome: () => dispatch(setCurrentStopIndex(0)),
		onEnd: () => dispatch(changeBoundThunk()),
		isUserSelectedRoute,
		debounceMs: 100,
		isDisabled: false,
	})

	return (
		<>
			<Background />
			{/* rootContainer to footer to stick at bottom */}
			<div className={styleClasses.rootContainer}>
				<div className={styleClasses.contentContainer} tabIndex={1}>

					{/* Query section for route input and selection */}
					<section className={styleClasses.querySection}>
						<div className={styleClasses.asyncSelectWrapper}>
							<SearchIcon
								sx={{
									color: "#999",
									fontSize: 24,
									[theme.breakpoints.down("sm")]: { display: "none" },
								}}
							/>
							<div className="flex-1">
								<RouteQueryInput />
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
						<MainDisplayPanel monitorStyle={styleClasses.monitorStyle} screenTarget={mainScreenTarget} />
						<AuxiliaryDisplayPanel monitorStyle={styleClasses.monitorStyle} screenTarget={secScreenTarget} />
					</section>
				</div >

				{/* Footer section */}
				<Footer />
			</div>
		</>
	)
}

export default App

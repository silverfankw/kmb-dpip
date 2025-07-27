import { useTheme } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

import {
	Background, Footer, RouteQueryInput, ErrorMessage,
	ControlPanel, MainDisplayPanel, AuxiliaryDisplayPanel
} from '@components'

import { useRef, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useKeyboardNavigation, useLocalStorageState } from "@hooks"

import { getRoutesThunk } from "@store/routeSlice"
import {
	changeBoundThunk, selectRouteThunk,
	setCurrentStopIndex, toPrevStop, toNextStop
} from '@store/routeSelectionSlice'

// Tailwind classes for layout
const styles = {
	rootContainer: "min-h-screen flex flex-col items-center",

	contentContainer: [
		"select-none focus:outline-hidden",
		"p-[2rem] max-sm:p-2",
		"flex flex-1 flex-col gap-3 ",
		"max-sm:gap-2"
	].join(" "),

	iconSx: {
		color: "#999",
		fontSize: 24,
	},

	asyncSelectWrapper: "flex items-center gap-4 w-full relative z-20",

	querySection: [
		"order-1 max-sm:order-2",
		"flex gap-3 items-center justify-center",
		"bg-gradient-to-br from-[#18181b]/90 to-[#27272a]/80",
		"backdrop-blur-md",
		"shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
		"border border-gray-600/30",
		"rounded-2xl",
		"relative",
		"p-6 max-md:p-4 max-md:flex-col max-md:gap-3",
		"transition-all duration-300 ease-out",
		"hover:shadow-[0_8px_32px_rgba(37,99,235,0.15)]",
		"hover:border-blue-500/30",
		"hover:from-[#18181b]/95 hover:to-[#27272a]/85",
		"before:absolute before:inset-0 before:rounded-2xl",
		"before:bg-gradient-to-br before:from-blue-500/5 before:to-purple-500/5",
		"before:opacity-0 hover:before:opacity-100",
		"before:transition-opacity before:duration-300",
	].join(" "),

	controlPanelSection: [
		"order-2 max-sm:order-3",
		"flex gap-4 flex-wrap justify-center",
		"bg-[#18181b]/80 backdrop-blur-md",
		"p-6 w-full max-md:flex-col max-md:gap-4",
		"border border-gray-600/20 rounded-2xl",
		"shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
		"transition-all duration-300 ease-in-out",
		"hover:shadow-[0_8px_32px_rgba(37,99,235,0.1)]",
		"hover:border-blue-500/20",
	].join(" "),

	screenPanelSection: [
		"order-3 max-sm:order-1",
		"flex flex-wrap items-center justify-center",
		"gap-10 max-sm:gap-6 py-4"
	].join(" "),

	monitorStyle: [
		"w-[800px] h-[480px]",
		"max-xl:w-[700px] max-xl:h-[420px]",
		"max-md:w-[600px] max-md:h-[360px]",
		"max-sm:w-[400px] max-sm:h-[240px]",
		"shadow-[0.5rem_0.5rem_1rem_0.25rem_#23272f]",
		"border-[.375rem] max-md:border-[.25em] border-solid border-[#23272f]",
		"rounded-xl",
		"outline outline-[0.875rem] max-sm:outline-[0.625rem] outline-[#000000]",
		"z-1",
	].join(" "),
}

const App = () => {

	const theme = useTheme()
	const dispatch = useDispatch()
	const { hasStoredData, storedData, saveToLocalStorage } = useLocalStorageState()
	const { isUserSelectedRoute, loadingError, routeDetail, currentStopIndex } = useSelector(state => state.routeSelection)
	const { routes } = useSelector(state => state.route)

	// Get routeList from API by executeing fetch route from Redux thunk
	useEffect(() => {
		dispatch(getRoutesThunk())
	}, [dispatch])

	// Check if stored data in localStorage
	const handleRestoreSelection = useCallback(async () => {
		if (storedData && routes.length > 0) {
			try {
				dispatch(selectRouteThunk({ routeDetail: storedData, routes }))
				dispatch(setCurrentStopIndex(storedData.currentStopIndex || 0))
			} catch (error) {
				console.error('Error restoring selection:', error)
			}
		}
	}, [dispatch, storedData, routes])

	useEffect(() => {
		if (hasStoredData && routes.length > 0) {
			handleRestoreSelection()
		}
	}, [hasStoredData, routes, handleRestoreSelection])

	useEffect(() => {
		if (isUserSelectedRoute && routeDetail && Object.keys(routeDetail).length > 0) {
			const dataToStore = {
				route: routeDetail.route,
				bound: routeDetail.bound,
				service_type: routeDetail.service_type,
				orig_tc: routeDetail.orig_tc,
				orig_en: routeDetail.orig_en,
				dest_tc: routeDetail.dest_tc,
				dest_en: routeDetail.dest_en,
				specialRemark: routeDetail.specialRemark,
				currentStop_tc: routeDetail.stops[currentStopIndex]?.zh || "",
				currentStop_en: routeDetail.stops[currentStopIndex]?.en || "",
				currentStopIndex: currentStopIndex,
				timestamp: Date.now()
			}
			saveToLocalStorage(dataToStore)
		}
	}, [isUserSelectedRoute, routeDetail, currentStopIndex, saveToLocalStorage])

	useEffect(() => {
		const handleBeforeUnload = () => {
			if (isUserSelectedRoute && routeDetail && Object.keys(routeDetail).length > 0) {
				const dataToStore = {
					route: routeDetail.route,
					bound: routeDetail.bound,
					service_type: routeDetail.service_type,
					orig_tc: routeDetail.orig_tc,
					orig_en: routeDetail.orig_en,
					dest_tc: routeDetail.dest_tc,
					dest_en: routeDetail.dest_en,
					specialRemark: routeDetail.specialRemark,
					currentStop_tc: routeDetail.stops[currentStopIndex]?.zh || "",
					currentStop_en: routeDetail.stops[currentStopIndex]?.en || "",
					currentStopIndex: currentStopIndex,
					// timestamp: Date.now()
				}
				saveToLocalStorage(dataToStore)
			}
		}

		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => window.removeEventListener('beforeunload', handleBeforeUnload)
	}, [isUserSelectedRoute, routeDetail, currentStopIndex, saveToLocalStorage])


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
			<div className={styles.rootContainer}>
				<div className={styles.contentContainer} tabIndex={1}>

					{/* Query section for route input and selection */}
					<section className={styles.querySection}>
						<div className={styles.asyncSelectWrapper}>
							<SearchIcon
								sx={{
									...styles.iconSx,
									[theme.breakpoints.down("sm")]: { display: "none" },
								}}
							/>
							<div className="flex-1">
								<RouteQueryInput />
							</div>
						</div>
					</section>

					{/* Control Panel with buttons and switches to control DPIP */}
					<section className={styles.controlPanelSection}>
						<ControlPanel
							mainScreenTarget={mainScreenTarget}
							secScreenTarget={secScreenTarget} />
					</section>

					{/* DPIP main screen with full details */}
					<section className={styles.screenPanelSection}>
						{loadingError ?
							(<ErrorMessage error={loadingError} />) :
							(<>
								<MainDisplayPanel monitorStyle={styles.monitorStyle} screenTarget={mainScreenTarget} />
								<AuxiliaryDisplayPanel monitorStyle={styles.monitorStyle} screenTarget={secScreenTarget} />
							</>)}
					</section>
				</div >

				{/* Footer section */}
				<Footer />
			</div>
		</>
	)
}

export default App

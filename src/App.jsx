import {
	Background, Footer, RouteQueryInput, ErrorMessage,
	ControlPanel, MainDisplayPanel, AuxiliaryDisplayPanel
} from '@components'

import { useRef, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useKeyboardNavigation, useLocalStorageState} from "@hooks"

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
		"p-[1rem] max-sm:p-1.5",
		"flex flex-1 flex-col gap-3 ",
		"max-sm:gap-1"
	].join(" "),

	querySection: [
		"order-1 max-sm:order-2",
		"flex flex-wrap items-center gap-4 w-full relative z-20",
		"bg-slate-950/45",
		"backdrop-blur-xl",
		"shadow-[0_12px_32px_rgba(2,6,23,0.28)]",
		"rounded-[1.75rem]",
		"overflow-hidden",
		"p-4 max-md:p-2 max-sm:p-1.5",
		"text-sm text-slate-200 sm:text-base max-sm:text-xs",
		"transition-all duration-300 ease-out",
		"hover:shadow-[0_16px_40px_rgba(14,165,233,0.1)]",
		"max-sm:gap-1"
	].join(" "),
	queryStatusLabel: "text-slate-400",
	queryStatusValue: "font-semibold text-slate-100",
	queryStatusRouteValue: "font-semibold text-slate-100 flex items-center min-w-0 w-1/2 basis-1/2 shrink-0 max-sm:w-full max-sm:basis-full",
	queryStatusRouteInputWrapper: "w-full",
	queryStatusDivider: "text-slate-500",

	controlPanelSection: [
		"order-2 max-sm:order-3",
		"flex gap-2 flex-wrap justify-center",
		"p-3 md:p-4 w-full max-md:flex-col max-md:gap-2 max-sm:p-2 max-sm:gap-1",
	].join(" "),

	screenPanelSection: [
		"order-3 max-sm:order-1",
		"flex flex-wrap items-center justify-center",
		"gap-10 max-sm:gap-3 max-sm:py-1"
	].join(" "),

	monitorShell: [
		"rounded-[2rem]",
		"bg-white/[0.08]",
		"p-3 max-sm:p-1",
		"shadow-[0_18px_48px_rgba(2,6,23,0.28)]",
		"ring-1 ring-white/10"
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

	const dispatch = useDispatch()
	const { hasStoredData, storedData, saveToLocalStorage } = useLocalStorageState()
	const { isUserSelectedRoute, loadingError, routeDetail, currentStopIndex } = useSelector(state => state.routeSelection)
	const { routes } = useSelector(state => state.route)
	const totalStops = routeDetail?.stops?.length ?? 0
	const currentStopSummary = totalStops > 0
		? `${currentStopIndex + 1} / ${totalStops}`
		: '-- / --'

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
						<div className={styles.queryStatusRouteValue}>
							<div className={styles.queryStatusRouteInputWrapper}>
								<RouteQueryInput label="路線" labelClassName={styles.queryStatusLabel} />
							</div>
						</div>
						<span className={styles.queryStatusLabel}>站數</span>
						<span className={styles.queryStatusValue}>{currentStopSummary}</span>
						{isUserSelectedRoute && routeDetail?.stops?.[currentStopIndex]?.zh && (
							<>
								<span className={styles.queryStatusDivider}>|</span>
								<span className={styles.queryStatusLabel}>本站</span>
								<span className={styles.queryStatusValue}>{routeDetail.stops[currentStopIndex].zh}</span>
							</>
						)}
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
								<div className={styles.monitorShell}>
									<MainDisplayPanel monitorStyle={styles.monitorStyle} screenTarget={mainScreenTarget} />
								</div>
								<div className={styles.monitorShell}>
									<AuxiliaryDisplayPanel monitorStyle={styles.monitorStyle} screenTarget={secScreenTarget} />
								</div>
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

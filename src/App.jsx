import {
	Background, Footer, RouteQueryInput, ErrorMessage,
	ControlPanel, MainDisplayPanel, AuxiliaryDisplayPanel
} from '@components'

import { useRef, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useKeyboardNavigation, useLocalStorageState} from "@hooks"

import { getAppTextConfig } from '@components/sharedComponentConfig'
import { getRoutesThunk } from "@store/routeSlice"
import {
	changeBoundThunk, selectRouteThunk,
	setCurrentStopIndex, toPrevStop, toNextStop
} from '@store/routeSelectionSlice'

const buildStoredSelection = (routeDetail, currentStopIndex, includeTimestamp = false) => {
	if (!routeDetail || Object.keys(routeDetail).length === 0) {
		return null
	}

	const data = {
		route: routeDetail.route,
		bound: routeDetail.bound,
		service_type: routeDetail.service_type,
		orig_tc: routeDetail.orig_tc,
		orig_en: routeDetail.orig_en,
		dest_tc: routeDetail.dest_tc,
		dest_en: routeDetail.dest_en,
		specialRemark: routeDetail.specialRemark,
		currentStopIndex,
	}

	if (includeTimestamp) {
		data.timestamp = Date.now()
	}

	return data
}

// Tailwind classes for layout
const styles = {
	rootContainer: "min-h-screen flex flex-col items-center",

	contentContainer: [
		"select-none focus:outline-hidden",
		"px-16 py-[2rem] max-xl:px-10 max-sm:p-1.5",
		"flex flex-1 flex-col gap-3 ",
		"max-sm:gap-1"
	].join(" "),

	querySection: [
		"order-1 max-sm:order-2",
		"flex flex-wrap items-center gap-4 w-full relative z-20",
		"rounded-[1.75rem]",
		"overflow-hidden",
		"p-4 max-md:p-2 max-sm:p-1.5",
		"text-sm sm:text-base max-sm:text-xs",
		"max-sm:gap-1"
	].join(" "),
	querySectionNight: "bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(18,29,46,0.74))] backdrop-blur-xl border border-slate-300/10 shadow-[0_12px_28px_rgba(2,6,23,0.22),inset_0_1px_0_rgba(255,255,255,0.04)] text-slate-100 hover:shadow-[0_14px_30px_rgba(14,165,233,0.06)]",
	querySectionLight: "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.9))] backdrop-blur-xl border border-slate-200/90 shadow-[0_10px_24px_rgba(148,163,184,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] text-slate-700 hover:shadow-[0_12px_28px_rgba(148,163,184,0.16)]",
	queryStatusLabel: "max-xl:text-sm max-sm:text-xs font-medium tracking-[0.04em] text-[0.72rem] sm:text-[0.8rem]",
	queryStatusValue: "font-semibold tracking-[0.02em] leading-tight",
	queryStatusRouteValue: "font-semibold tracking-[0.02em] leading-tight flex items-center min-w-0 w-1/2 basis-1/2 shrink-0 max-xl:w-3/5 max-xl:basis-3/5 max-sm:w-full max-sm:basis-full",
	queryStatusRouteInputWrapper: "w-full",
	controlPanelOrderSection: "order-2 max-sm:order-3 w-full",

	screenPanelSection: [
		"order-3 max-sm:order-1",
		"flex flex-wrap items-center justify-center",
		"gap-8 py-3 max-xl:gap-8 max-sm:gap-3 max-sm:py-1"
	].join(" "),

	monitorShell: [
		"rounded-[2rem]",
		"bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(30,41,59,0.8))]",
		"p-3 max-sm:p-1",
		"shadow-[0_18px_40px_rgba(2,6,23,0.24),inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-1px_0_rgba(15,23,42,0.7)]",
		"ring-1 ring-slate-300/8"
	].join(" "),

	monitorStyle: [
		"w-[800px] h-[480px]",
		"max-xl:w-[700px] max-xl:h-[420px]",
		"max-md:w-[600px] max-md:h-[360px]",
		"max-sm:w-[400px] max-sm:h-[240px]",
		"shadow-[0_20px_36px_rgba(2,6,23,0.42),0_10px_22px_rgba(15,23,42,0.38)]",
		"border-[.375rem] max-md:border-[.25em] border-solid border-[rgba(24,31,41,0.96)]",
		"rounded-xl",
		"outline outline-[0.8rem] max-sm:outline-[0.55rem] outline-[rgba(8,11,18,0.98)]",
		"z-1",
	].join(" "),
}

const App = () => {

	const dispatch = useDispatch()
	const { hasStoredData, storedData, saveToLocalStorage, saveToLocalStorageNow } = useLocalStorageState()
	const { isUserSelectedRoute, loadingError, routeDetail, currentStopIndex } = useSelector(state => state.routeSelection)
	const { routes } = useSelector(state => state.route)
	const { uiMode, language } = useSelector(state => state.userPreference)
	const appText = getAppTextConfig(language)
	const isLightMode = uiMode === "light"
	const totalStops = routeDetail?.stops?.length ?? 0
	const currentStopSummary = totalStops > 0
		? `${currentStopIndex + 1} / ${totalStops}` : '-'
	const querySection = `${styles.querySection} ${isLightMode ? styles.querySectionLight : styles.querySectionNight}`
	const queryStatusLabel = `${styles.queryStatusLabel} ${isLightMode ? "text-slate-600" : "text-slate-400"}`
	const queryStatusValue = `${styles.queryStatusValue} ${isLightMode ? "text-slate-900" : "text-slate-100"}`
	const queryStatusRouteValue = `${styles.queryStatusRouteValue} ${isLightMode ? "text-slate-900" : "text-slate-100"}`
	const queryStatusDivider = `${styles.queryStatusDivider} ${isLightMode ? "text-slate-400" : "text-slate-500"}`

	// Load route data into Redux once on startup
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
			const dataToStore = buildStoredSelection(routeDetail, currentStopIndex, true)

			if (dataToStore) {
				saveToLocalStorage(dataToStore)
			}
		}
	}, [isUserSelectedRoute, routeDetail, currentStopIndex, saveToLocalStorage])

	useEffect(() => {
		const handleBeforeUnload = () => {
			if (isUserSelectedRoute && routeDetail && Object.keys(routeDetail).length > 0) {
				const dataToStore = buildStoredSelection(routeDetail, currentStopIndex)

				if (dataToStore) {
					saveToLocalStorageNow(dataToStore)
				}
			}
		}

		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => window.removeEventListener('beforeunload', handleBeforeUnload)
	}, [isUserSelectedRoute, routeDetail, currentStopIndex, saveToLocalStorageNow])


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
			<Background uiMode={uiMode} />

			{/* rootContainer to footer to stick at bottom */}
			<div className={styles.rootContainer}>
				<div className={styles.contentContainer} tabIndex={1}>

					{/* Query section for route input and selection */}
					<section className={querySection}>
						<div className={queryStatusRouteValue}>
							<div className={styles.queryStatusRouteInputWrapper}>
								<RouteQueryInput label={appText.routeLabel} labelClassName={queryStatusLabel} />
							</div>
						</div>
						{isUserSelectedRoute && routeDetail?.stops?.[currentStopIndex] && (
							<>
							<span className={queryStatusLabel}>{appText.stopCountLabel}</span>
							<span className={queryStatusValue}>{currentStopSummary}</span>
									<span className={queryStatusDivider}>|</span>
									<span className={queryStatusLabel}>{appText.currentStopLabel}</span>
									<span className={queryStatusValue}>{routeDetail.stops[currentStopIndex][language === 'en' ? 'en' : 'zh']}</span>
							</>
						)}
					</section>

					{/* Control Panel with buttons and switches to control DPIP */}
					<section className={styles.controlPanelOrderSection}>
						<ControlPanel
							uiMode={uiMode}
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
				<Footer uiMode={uiMode} />
			</div>
		</>
	)
}

export default App

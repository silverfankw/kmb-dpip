import {
	AppToolbar, Background, Footer, RouteQueryInput, ErrorMessage,
	ControlPanel, MainDisplayPanel, AuxiliaryDisplayPanel
} from '@components'

import { useRef, useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useKeyboardNavigation, useLocalStorageState} from "@hooks"
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import '@styles/routeSearch/routeQuerySection.css'

import { getAppTextConfig } from '@components/sharedComponentConfig'
import { getRoutesThunk } from "@store/routeSlice"
import {
	changeBoundThunk, selectRouteThunk,
	setCurrentStopIndex, toPrevStop, toNextStop,
	selectIsBoundSwitchable,
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

// Layout classes; query section styles are defined in routeQuerySection.css.
const styles = {
	rootContainer: "app-layout min-h-screen flex flex-col items-center",

	contentContainer: [
		"w-full min-w-0",
		"select-none focus:outline-hidden",
		"px-16 py-[2rem] max-xl:px-10 max-sm:p-1.5",
		"flex flex-1 flex-col gap-3 ",
		"max-sm:gap-1"
	].join(" "),

	querySection: "query-section",
	queryStatusLabel: "query-section__label",
	queryStatusValue: "query-section__value",
	queryStatusRouteValue: "query-section__route",
	queryStatusRouteInputWrapper: "query-section__route-input",
	queryStatusSummary: "query-section__summary",
	queryStatusProgress: "query-section__progress",
	queryStatusProgressMetric: "query-section__progress-metric",
	queryStatusProgressBar: "query-section__progress-bar",
	queryStatusCurrent: "query-section__current",
	queryStatusStopName: "query-section__value query-section__stop-name",
	queryStatusEmpty: "query-section__empty",
	controlPanelOrderSection: "order-2 max-sm:order-3 w-full",

	screenPanelSection: [
		"app-monitors",
		"order-3 max-sm:order-2",
		"flex flex-wrap items-center justify-center",
		"gap-8 py-3 max-xl:gap-8 max-sm:gap-3 max-sm:py-1"
	].join(" "),

	monitorShell: [
		"app-monitor-shell",
		"rounded-[2rem]",
		"bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(30,41,59,0.8))]",
		"p-3 max-sm:p-1",
		"shadow-[0_18px_40px_rgba(2,6,23,0.24),inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-1px_0_rgba(15,23,42,0.7)]",
		"ring-1 ring-slate-300/8"
	].join(" "),

	monitorStyle: [
		"app-monitor app-monitor--normal",
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
	mainMonitorWideStyle: [
		"app-monitor app-monitor--wide",
		"w-[1600px] aspect-[4/1]",
		"max-w-[calc(100vw-10rem)]",
		"max-xl:max-w-[calc(100vw-7rem)] max-sm:max-w-[calc(100vw-2.5rem)]",
		"shadow-[0_20px_36px_rgba(2,6,23,0.42),0_10px_22px_rgba(15,23,42,0.38)]",
		"border-[.375rem] max-md:border-[.25em] border-solid border-[rgba(24,31,41,0.96)]",
		"rounded-xl",
		"outline outline-[0.8rem] max-sm:outline-[0.55rem] outline-[rgba(8,11,18,0.98)]",
		"z-1",
	].join(" "),
}

const App = () => {

	const dispatch = useDispatch()
	const [isMainMonitorWide, setIsMainMonitorWide] = useState(false)
	const { hasStoredData, storedData, saveToLocalStorage, saveToLocalStorageNow } = useLocalStorageState()
	const hasRestoredSelectionRef = useRef(false)
	const { isUserSelectedRoute, loadingError, routeDetail, currentStopIndex } = useSelector(state => state.routeSelection)
	const { routes } = useSelector(state => state.route)
	const { uiMode, language } = useSelector(state => state.userPreference)
	const isBoundSwitchable = useSelector(selectIsBoundSwitchable)
	const appText = getAppTextConfig(language)
	const totalStops = routeDetail?.stops?.length ?? 0
	const currentStop = routeDetail?.stops?.[currentStopIndex]
	const currentStopSummary = totalStops > 0
		? `${currentStopIndex + 1} / ${totalStops}` : '-'
	const mainMonitorStyle = isMainMonitorWide ? styles.mainMonitorWideStyle : styles.monitorStyle

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
		if (hasRestoredSelectionRef.current || !hasStoredData || routes.length === 0) return

		// Saving progress updates storedData too; only restore it during startup.
		hasRestoredSelectionRef.current = true
		if (!isUserSelectedRoute) {
			handleRestoreSelection()
		}
	}, [hasStoredData, routes, handleRestoreSelection, isUserSelectedRoute])

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
		onEnd: isBoundSwitchable ? () => dispatch(changeBoundThunk()) : undefined,
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
					<AppToolbar />

					{/* Query section for route input and selection */}
					<section className={styles.querySection} data-theme={uiMode} aria-label={appText.routeQuerySectionLabel}>
						<div className={styles.queryStatusRouteValue}>
							<div className={styles.queryStatusRouteInputWrapper}>
								<RouteQueryInput label={appText.routeLabel} labelClassName={styles.queryStatusLabel} />
							</div>
						</div>
						{isUserSelectedRoute && currentStop ? (
							<div className={styles.queryStatusSummary} aria-live="polite" aria-atomic="true">
								<div className={styles.queryStatusProgress}>
									<span className={styles.queryStatusLabel}>{appText.stopCountLabel}</span>
									<div className={styles.queryStatusProgressMetric}>
										<span
											className={styles.queryStatusValue}
											style={{ minWidth: `${String(totalStops).length * 2 + 3}ch` }}
										>{currentStopSummary}</span>
										<progress
											className={styles.queryStatusProgressBar}
											max={totalStops}
											value={currentStopIndex + 1}
											aria-label={appText.routeProgressLabel}
										/>
									</div>
								</div>
								<div className={styles.queryStatusCurrent}>
									<span className={styles.queryStatusLabel}><PlaceOutlinedIcon />{appText.currentStopLabel}</span>
									<span className={styles.queryStatusStopName}>{currentStop[language === 'en' ? 'en' : 'zh']}</span>
								</div>
							</div>
						) : (
							<div className={styles.queryStatusEmpty}>
								<PlaceOutlinedIcon />
								<p>{appText.routeSearchEmpty}</p>
							</div>
						)}
					</section>

					{/* Control Panel with buttons and switches to control DPIP */}
					<section className={styles.controlPanelOrderSection}>
						<ControlPanel
							uiMode={uiMode}
							mainScreenTarget={mainScreenTarget}
							secScreenTarget={secScreenTarget}
							isMainMonitorWide={isMainMonitorWide}
							onToggleMainMonitorStyle={() => setIsMainMonitorWide(isWide => !isWide)} />
					</section>

					{/* DPIP main screen with full details */}
					<section className={styles.screenPanelSection}>
						{loadingError ?
							(<ErrorMessage error={loadingError} />) :
							(<>
								<div className={styles.monitorShell}>
									<MainDisplayPanel
										monitorStyle={mainMonitorStyle}
										screenTarget={mainScreenTarget}
										isWide={isMainMonitorWide} />
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

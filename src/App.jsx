import {
	AppToolbar, Background, Footer, RouteQueryInput, ErrorMessage,
	ControlPanel, MainDisplayPanel, AuxiliaryDisplayPanel, LoadingSpinner
} from '@components'

import { lazy, Suspense, useRef, useCallback, useEffect, useMemo, useState } from 'react'
import { shallowEqual, useSelector, useDispatch } from 'react-redux'
import { useKeyboardNavigation, useLocalStorageState} from "@hooks"
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import { FeatureErrorBoundary } from '@components/FeatureErrorBoundary'
import ResizableMonitorShell from '@components/ResizableMonitorShell'
import '@styles/routeSearch/routeQuerySection.css'

import { getAppTextConfig } from '@components/sharedComponentConfig'
import { getRoutesThunk } from "@store/routeSlice"
import { buildRouteSelectionKey, getRouteOperator, routeStoreConfig } from '@store/storeConfig'
import {
	changeBoundThunk, selectRouteThunk,
	setCurrentStopIndex, toPrevStop, toNextStop,
	selectIsBoundSwitchable,
} from '@store/routeSelectionSlice'

const BusDisplay = lazy(() => import('@components/DPIP/CTB/BusDisplay'))

const buildStoredSelection = (routeDetail, currentStopIndex, includeTimestamp = false) => {
	if (!routeDetail || Object.keys(routeDetail).length === 0) {
		return null
	}

	const data = {
		operator: getRouteOperator(routeDetail),
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
	controlPanelOrderSection: "order-4 w-full",

	screenPanelSection: [
		"app-monitors",
		"order-2",
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
		"w-[1600px] aspect-[40/9]",
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
	const [company, setCompany] = useState('kmb')
	const [ctbRoute, setCtbRoute] = useState(null)
	const [ctbStopIndex, setCtbStopIndex] = useState(0)
	const isKmb = company === 'kmb'
	const [isMainMonitorWide, setIsMainMonitorWide] = useState(false)
	const { hasStoredData, storedData, saveToLocalStorage, saveToLocalStorageNow } = useLocalStorageState()
	const hasRestoredSelectionRef = useRef(false)
	const { isUserSelectedRoute, loadingError, routeDetail, currentStopIndex } = useSelector(state => ({
		isUserSelectedRoute: state.routeSelection.isUserSelectedRoute,
		loadingError: state.routeSelection.loadingError,
		routeDetail: state.routeSelection.routeDetail,
		currentStopIndex: state.routeSelection.currentStopIndex,
	}), shallowEqual)
	const { routes, ctbRoutes, routeLoadError } = useSelector(state => ({
		routes: state.route.routes,
		ctbRoutes: state.route.ctbRoutes,
		routeLoadError: state.route.error,
	}), shallowEqual)
	const { uiMode, language } = useSelector(state => ({
		uiMode: state.userPreference.uiMode,
		language: state.userPreference.language,
	}), shallowEqual)
	const driverInfo = useSelector(state => isKmb ? null : state.userPreference.driverInfo)
	const isBoundSwitchable = useSelector(selectIsBoundSwitchable)
	const appText = getAppTextConfig(language)
	const queryRoute = isKmb ? routeDetail : ctbRoute
	const queryStopIndex = isKmb ? currentStopIndex : ctbStopIndex
	const hasQueryRoute = isKmb ? isUserSelectedRoute : Boolean(ctbRoute)
	const totalStops = queryRoute?.stops?.length ?? 0
	const currentStop = queryRoute?.stops?.[queryStopIndex]
	const currentStopSummary = totalStops > 0
		? `${queryStopIndex + 1} / ${totalStops}` : '-'
	const mainMonitorStyle = isMainMonitorWide ? styles.mainMonitorWideStyle : styles.monitorStyle
	const ctbStops = useMemo(() => ctbRoute?.stops.map((stop, index) => ({
		seq: index + 1, stopId: stop.id, nameZh: stop.zh, nameEn: stop.en, etaMin: null,
	})), [ctbRoute])
	const ctbDisplayData = useMemo(() => ctbRoute && !isKmb ? {
		route: ctbRoute.route,
		directionLabelZh: `往 ${ctbRoute.dest_tc}`,
		directionLabelEn: `to ${ctbRoute.dest_en}`,
		captain: {
			surnameZh: driverInfo.nameZh === routeStoreConfig.userPreferenceDefaults.driverInfo.nameZh ? '城' : driverInfo.nameZh,
			nameEn: driverInfo.nameEn === routeStoreConfig.userPreferenceDefaults.driverInfo.nameEn ? 'Shing' : driverInfo.nameEn,
			staffNo: String(driverInfo.staffNo),
		},
		currentSeq: ctbStopIndex + 1,
		stops: ctbStops,
	} : undefined, [ctbRoute, ctbStops, ctbStopIndex, driverInfo, isKmb])
	const selectCtbRoute = useCallback(route => {
		setCtbRoute(route)
		setCtbStopIndex(0)
	}, [])
	const oppositeCtbRoute = useMemo(() => {
		if (!ctbRoute || !['I', 'O'].includes(ctbRoute.bound)) return null
		const key = buildRouteSelectionKey({ ...ctbRoute, bound: ctbRoute.bound === 'I' ? 'O' : 'I' })
		return ctbRoutes.find(route => buildRouteSelectionKey(route) === key) ?? null
	}, [ctbRoute, ctbRoutes])
	const ctbNavigation = useMemo(() => ({
		canPrev: ctbStopIndex > 0,
		canNext: ctbStopIndex < (ctbRoute?.stops.length ?? 0) - 1,
		canReset: ctbStopIndex > 0,
		canSwitchDirection: Boolean(oppositeCtbRoute),
		onPrev: () => setCtbStopIndex(index => Math.max(0, index - 1)),
		onNext: () => setCtbStopIndex(index => Math.max(0, Math.min((ctbRoute?.stops.length ?? 0) - 1, index + 1))),
		onReset: () => setCtbStopIndex(0),
		onSwitchDirection: () => { if (oppositeCtbRoute) selectCtbRoute(oppositeCtbRoute) },
	}), [ctbStopIndex, ctbRoute, oppositeCtbRoute, selectCtbRoute])
	const toggleMainMonitorStyle = useCallback(() => setIsMainMonitorWide(isWide => !isWide), [])

	// Load route data into Redux once on startup
	useEffect(() => {
		dispatch(getRoutesThunk()).catch(error => {
			console.error('Error loading routes:', error)
		})
	}, [dispatch])

	// Check if stored data in localStorage
	const handleRestoreSelection = useCallback(async () => {
		if (storedData && routes.length > 0) {
			try {
				const selectedRoute = await dispatch(selectRouteThunk({ routeDetail: storedData, routes })).unwrap()
				const restoredIndex = Number.isInteger(storedData.currentStopIndex)
					? Math.max(0, Math.min(storedData.currentStopIndex, selectedRoute.stops.length - 1)) : 0
				dispatch(setCurrentStopIndex(restoredIndex))
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
		onPrev: isKmb ? () => dispatch(toPrevStop())
			: ctbNavigation.onPrev,
		onNext: isKmb ? () => dispatch(toNextStop())
			: ctbNavigation.onNext,
		onHome: isKmb ? () => dispatch(setCurrentStopIndex(0)) : ctbNavigation.onReset,
		onEnd: isKmb ? (isBoundSwitchable ? () => dispatch(changeBoundThunk()) : undefined)
			: (ctbNavigation.canSwitchDirection ? ctbNavigation.onSwitchDirection : undefined),
		isUserSelectedRoute: isKmb ? isUserSelectedRoute : Boolean(ctbRoute?.stops.length),
		debounceMs: 100,
		isDisabled: false,
	})

	return (
		<>
			<Background uiMode={uiMode} />

			{/* rootContainer to footer to stick at bottom */}
			<div className={styles.rootContainer} data-company={company}>
				<div className={styles.contentContainer} tabIndex={1}>
					<AppToolbar company={company} onCompanyChange={setCompany} />

					<div
						id={`company-panel-${company}`}
						role="tabpanel"
						aria-labelledby={`company-tab-${company}`}
						tabIndex={0}
						className="app-company-panel"
					>
					{/* Query section for route input and selection */}
					<section className={styles.querySection} data-theme={uiMode} aria-label={appText.routeQuerySectionLabel}>
						<div className={styles.queryStatusRouteValue}>
							<div className={styles.queryStatusRouteInputWrapper}>
								<RouteQueryInput
									key={company}
									operator={company}
									selectedRoute={isKmb ? undefined : ctbRoute}
									onRouteSelect={isKmb ? undefined : selectCtbRoute}
									label={appText.routeLabel}
									labelClassName={styles.queryStatusLabel}
								/>
							</div>
						</div>
						{hasQueryRoute && currentStop ? (
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
											value={queryStopIndex + 1}
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

					{/* DPIP main screen with full details */}
					<section className={styles.screenPanelSection}>
						{!isKmb ? (
							<>
								{routeLoadError && <ErrorMessage error={routeLoadError} />}
								<ResizableMonitorShell key="ctb-main" className={`${styles.monitorShell} monitor-resize--ctb`}
									monitorId="ctb-main" aspectRatio={16 / 9} startAtMaximum
									label={language === 'en' ? 'Resize main monitor' : '調整主螢幕大小'}>
									<div ref={mainScreenTarget} className={`${styles.monitorStyle} app-monitor--ctb`}>
										<FeatureErrorBoundary feature="CTB monitor">
											<Suspense fallback={<LoadingSpinner />}>
												<BusDisplay data={ctbDisplayData} />
											</Suspense>
										</FeatureErrorBoundary>
									</div>
								</ResizableMonitorShell>
								<div className={styles.monitorShell}>
									<div className={`${styles.monitorStyle} app-monitor--blank`} role="img" aria-label={appText.ctbAuxMonitor} />
								</div>
							</>
						) : routeLoadError || loadingError ?
							(<ErrorMessage error={routeLoadError || loadingError} />) :
							(<>
								<ResizableMonitorShell className={styles.monitorShell} monitorId="main"
									label={language === 'en' ? 'Resize main monitor' : '調整主螢幕大小'} enabled={!isMainMonitorWide}>
									<MainDisplayPanel
										monitorStyle={mainMonitorStyle}
										screenTarget={mainScreenTarget}
										isWide={isMainMonitorWide} />
								</ResizableMonitorShell>
								<ResizableMonitorShell className={styles.monitorShell} monitorId="auxiliary"
									label={language === 'en' ? 'Resize auxiliary monitor' : '調整副螢幕大小'}>
									<AuxiliaryDisplayPanel monitorStyle={styles.monitorStyle} screenTarget={secScreenTarget} />
								</ResizableMonitorShell>
							</>)}
					</section>

					{/* Control Panel with buttons and switches to control DPIP */}
					<section className={styles.controlPanelOrderSection}>
						<ControlPanel
							key={company}
							operator={company}
							navigation={isKmb ? undefined : ctbNavigation}
							routeSelected={isKmb ? isUserSelectedRoute : Boolean(ctbRoute?.stops.length)}
							uiMode={uiMode}
							mainScreenTarget={mainScreenTarget}
							secScreenTarget={secScreenTarget}
							isMainMonitorWide={isKmb && isMainMonitorWide}
							onToggleMainMonitorStyle={toggleMainMonitorStyle} />
					</section>
					</div>
				</div >

				{/* Footer section */}
				<Footer uiMode={uiMode} />
			</div>
		</>
	)
}

export default App

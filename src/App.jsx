import { useEffect, useState } from 'react'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { Popover } from '@base-ui-components/react/popover';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RefreshIcon from '@mui/icons-material/Refresh';
import CachedIcon from '@mui/icons-material/Cached';
import NotificationsIcon from '@mui/icons-material/Notifications';
import KeyboardHideIcon from '@mui/icons-material/KeyboardHide';

import { createFilter } from 'react-select';
import AsyncSelect from 'react-select/async';

import './App.css'
import { routeContext } from './context/Provider';
import { isEmptyObject } from "../util/util"
import { DPIPSecScreen } from './DpipSecScreen'
import { DPIPMainScreen } from './DpipMainScreen'
import { IconButton } from '@mui/material';

function App() {
	const [selection, setSelection] = useState(null)
	const [routeDetail, setRouteDetail] = useState({})
	const [currentStopIndex, setCurrentStopIndex] = useState(0)
	const [routeHasTwoBound, setRouteHasTwoBound] = useState(false)
	const [userPreference, setUserPreference] = useState(
		{
			containerStyle: "basic",
			stopPressed: false,
			driverInfo: { nameZh: "九巴仔", nameEn: "KMB Boy", staffNo: "1933" }
		}
	)
	const containerStyle = {
		basic: "max-sm:border-[.25em] max-sm:outline-[.75rem] border-[.5em] border-solid border-[#0e0e0fbf] rounded-xl outline outline-[1rem] outline-black",
		new: "border-solid border-black "
	}

	const theme = createTheme({
		palette: {
			ochre: {
				main: '#E3D026',
				light: '#E9DB5D',
				dark: '#A29415',
				contrastText: '#242105',
			},
		},
	});

	const getRouteList = () => JSON.parse(localStorage.getItem("routeList"))

	useEffect(() => {
		const fetchKMBData = async () => {
			const response = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/route/").then(
				resp => resp.json()).then(json => json.data)
			localStorage.setItem("routeList", JSON.stringify(response))
		}

		if (!getRouteList())
			fetchKMBData().catch(console.error())
	}, [])

	const lastStopIndex = routeDetail?.stops?.length - 1 ?? 0
	const isPrevStopAvailable = currentStopIndex - 1 >= 0
	const isNextStopAvailable = currentStopIndex + 3 <= lastStopIndex + 2

	const searchRoute = route => {
		// Input to uppercase to prevent result loss
		const upperCaseRoute = route.toUpperCase()
		return new Promise((resolve) => {
			setTimeout(() => { resolve(routeOptions(upperCaseRoute)) }, 200)
		})
	}

	const checkRoundTripBound = (inputRoute) => {
		const boundCheck =
			getRouteList().some(route => route.bound == "I" && route.route == inputRoute) &&
			getRouteList().some(route => route.bound == "O" && route.route == inputRoute)
		setRouteHasTwoBound(boundCheck)
	}

	// Render options for async select
	const routeOptions = () => {
		// Render route options array for async select
		return getRouteList().map(
			(route) => {
				return {
					label: `${route.route} ｜ ${route.orig_tc} 往 ${route.dest_tc} ｜${route.service_type != 1 ? "＊特別班" : ""}`,
					value:
						JSON.stringify(
							{
								route: route.route,
								bound: route.bound == "I" ? "inbound" : "outbound",
								service_type: route.service_type,
								dest_tc: route.dest_tc,
								dest_en: route.dest_en,
							}
						)
				}
			})
	}

	const selectRoute = async ({ value }) => {
		const routeInfo = JSON.parse(value)
		setCurrentStopIndex(0)
		setSelection(routeInfo)

		const { route, bound, service_type, dest_tc, dest_en } = routeInfo
		checkRoundTripBound(route)

		const stopIDs = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${route}/${bound}/${service_type}`).then(
			resp => resp.json()).then(json => json.data).then(data => data.map(stops => stops.stop))

		const routeAllStops = await Promise.all(
			stopIDs.map(stopID => fetch(`https://data.etabus.gov.hk/v1/transport/kmb/stop/${stopID}`).then(
				resp => resp.json()
			).then(json => json.data).then(data => { return { en: data.name_en, zh: data.name_tc } }))
		)
		setRouteDetail(routeDetail => {
			return { ...routeDetail, route, stops: routeAllStops, dest_en, dest_tc }
		})
	}

	const toPrevStop = () => { if (isPrevStopAvailable) setCurrentStopIndex(prev => prev - 1) }

	const toNextStop = () => { if (isNextStopAvailable) setCurrentStopIndex(prev => prev + 1) }

	const changeBound = () => {
		if ((selection != null || routeHasTwoBound) || selection?.service_type == 1) {
			const { bound } = selection
			selectRoute({
				value: JSON.stringify(
					{
						...selection,
						bound: bound == "inbound" ? "outbound" : "inbound",
					})
			})
		}
	}

	const handleKeyboardControl = (key) => {
		// Do nothing if no route selected
		if (selection == null)
			return

		// Check if key pressed is left or right and move stop
		switch (key) {
			case "ArrowLeft":
				toPrevStop()
				break
			case "ArrowRight":
				toNextStop()
				break
			case "Home":
				setCurrentStopIndex(0)
				break
			case "End":
				changeBound()
				break
			default:
				return
		}
	}

	return (
		<ThemeProvider theme={theme}>
			<routeContext.Provider value={{ routeDetail, currentStopIndex }}>
				<div className="focus:outline-hidden p-[2rem] flex flex-col gap-2" tabIndex={1}
					onKeyDown={(e) => handleKeyboardControl(e.key)}>

					{/* Query section for route input and selection */}
					<section className="flex gap-3">
						<IconButton
							disabled={true}
							// disabled={false}
							color="ochre"
							onClick={e => { }}>
							<KeyboardHideIcon />
						</IconButton>


						<div className='w-full md:w-2/3 lg:w-2/3 xl:w-2/5 2xl:w-2/5'>
							<AsyncSelect
								autoCapitalize="characters"
								autoFocus
								isClearable
								cacheOptions
								defaultOptions={false}
								placeholder="請輸入九巴路線編號 &nbsp; Please enter KMB route."
								filterOption={createFilter({ matchFrom: "start" })}
								loadOptions={searchRoute}
								onChange={selectRoute}
							/>
						</div>
					</section>

					{/* Button groups to control DPIP */}
					<section className='flex flex-wrap gap-[1vw] my-[1em] mx-0'>
						<Button
							color="error"
							variant="contained"
							startIcon={<ArrowBackIcon />}
							onClick={() => toPrevStop()}
							disabled={!isPrevStopAvailable}
						>
							上站
						</Button>
						<Button
							color="success"
							variant="contained"
							startIcon={<ArrowForwardIcon />}
							onClick={() => toNextStop()}
							disabled={!isNextStopAvailable}
						>
							下站
						</Button>
						<Button
							color="error"
							variant="contained"
							startIcon={<NotificationsIcon />}
							onClick={() => setUserPreference(prev => { return { ...prev, stopPressed: !prev.stopPressed } })}
						>
							{userPreference.stopPressed ? `解除鐘` : `按鐘`}
						</Button>
						<Button
							variant="contained"
							startIcon={<RefreshIcon />}
							onClick={() => setCurrentStopIndex(0)}
							disabled={isEmptyObject(routeDetail) || currentStopIndex == 0}
						>
							重新開始
						</Button>
						<Button
							color="secondary"
							variant="contained"
							startIcon={<CachedIcon />}
							onClick={() => changeBound()}
							disabled={(selection == null || !routeHasTwoBound) || selection?.service_type != 1}
						>
							切換路線方向
						</Button>
					</section>

					{/* DPIP main screen with full details */}
					<section className="py-4 flex flex-wrap gap-[3vw] noselect">
						<DPIPMainScreen
							detail={routeDetail}
							currentStopIndex={currentStopIndex}
							userPreference={userPreference}
							containerStyle={containerStyle}
						/>

						<DPIPSecScreen
							stops={routeDetail.stops}
							currentStopIndex={currentStopIndex}
							userPreference={userPreference}
							containerStyle={containerStyle}
						/>

					</section>

					{/* Customizeable driver info with input group */}
					{/* <section className="flex gap-3">
					<Input
						placeholder="車長中文姓氏"
						maxLength={2}
						defaultValue={userPreference.driverInfo.nameZh}
						onChange={v => {
							if (v == "") v = "九巴仔"
							setUserPreference({
								...userPreference,
								driverInfo: { ...userPreference.driverInfo, nameZh: v }
							})
						}} />

					<Input
						style={"capitalize"}
						placeholder="車長英文姓氏"
						maxLength={10}
						defaultValue={userPreference.driverInfo.nameEn}
						onChange={v => {
							if (v == "") v = "KMB Boy"
							setUserPreference({
								...userPreference,
								driverInfo: { ...userPreference.driverInfo, nameEn: v }
							})
						}} />

					<Input placeholder="職員編號"
						minLength={1}
						maxLength={6}
						defaultValue={userPreference.driverInfo.staffNo}
						onChange={v => {
							if (v == "") v = "1933"
							setUserPreference({
								...userPreference,
								driverInfo: { ...userPreference.driverInfo, staffNo: v }
							})
						}} />
				</section> */}

					{/* Keyboard shortcut guideline */}
					{/* <section className="rounded-xl my-5 relative overflow-x-auto">
					<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th scope="col" className="px-6 py-3">
									Keyboard Shortcut
								</th>
								<th scope="col" className="py-3">
									Usage
								</th>
							</tr>
						</thead>
						<tbody>
							<tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
								<th scope="row" className="inline-flex items-center px-6 py-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
									<kbd className="rtl:rotate-180 inline-flex items-center me-1  px-2 py-1.5 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
										<svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
											<path d="M8.766.566A2 2 0 0 0 6.586 1L1 6.586a2 2 0 0 0 0 2.828L6.586 15A2 2 0 0 0 10 13.586V2.414A2 2 0 0 0 8.766.566Z" />
										</svg>
										<span className="sr-only">Arrow key left</span>
									</kbd>
									<kbd className="rtl:rotate-180 inline-flex items-center px-2 py-1.5 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
										<svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
											<path d="M3.414 1A2 2 0 0 0 0 2.414v11.172A2 2 0 0 0 3.414 15L9 9.414a2 2 0 0 0 0-2.828L3.414 1Z" />
										</svg>
										<span className="sr-only">Arrow key right</span>
									</kbd>
								</th>
								<td className="py-4">
									Proceed to previous / next bus stop.
								</td>
							</tr>
							<tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
								<th scope="row" className="px-6 py-4 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400">
									<kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">Home</kbd>
								</th>
								<td className="py-4">
									Navigate to the first bus stop.
								</td>
							</tr>
							<tr className="bg-white dark:bg-gray-900 dark:border-gray-700">
								<th scope="row" className="px-6 py-4 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400">
									<kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">End</kbd>
								</th>
								<td className="py-4">
									Switch bound if the selected bus route has return journey.
								</td>
							</tr>
						</tbody>
					</table>
				</section> */}


				</div >
			</routeContext.Provider>
		</ThemeProvider >
	)
}

export default App

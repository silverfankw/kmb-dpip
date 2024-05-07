import { useEffect, useState, useRef } from 'react'

import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RefreshIcon from '@mui/icons-material/Refresh';
import CachedIcon from '@mui/icons-material/Cached';
import NotificationsIcon from '@mui/icons-material/Notifications';

import AsyncSelect from 'react-select/async';
import { components } from "react-select"

import './App.css'
import { isEmptyObject } from "../util/util"
import { DPIPSecScreen } from './DpipSecScreen'
import { DPIPMainScreen } from './DpipMainScreen'

function App() {

	const [selection, setSelection] = useState(null)
	const [routeDetail, setRouteDetail] = useState({})
	const [currentStopIndex, setCurrentStopIndex] = useState(0)
	const [routeHasTwoBound, setRouteHasTwoBound] = useState(false)
	const [mainDpipBg, setMainDpipBg] = useState(0)

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
		// Clear previous selection
		setSelection(null)

		// Input to uppercase to prevent result loss
		const upperCaseRoute = route.toUpperCase()
		return new Promise((resolve) => {
			setTimeout(() => { resolve(routeOptions(upperCaseRoute)) }, 100)
		})
	}

	const checkBound = filteredRoute => {
		const boundCheck = filteredRoute.some(route => route.bound == "I") && filteredRoute.some(route => route.bound == "O")
		setRouteHasTwoBound(boundCheck)
	}

	// Render options for async select
	const routeOptions = (inputRoute) => {
		if (!inputRoute) return

		const filteredRoute = getRouteList().filter(route => route.route == inputRoute)
		checkBound(filteredRoute)

		// Render route options array for async select
		return filteredRoute.map(
			(route, index) => {
				return {
					label: `${route.route} ｜ ${route.orig_tc} 往 ${route.dest_tc}${route.service_type != 1 ? "｜*特別班次" : ""}`,
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

	const selectRoute = async ({ label, value }) => {
		const routeInfo = JSON.parse(value)
		setCurrentStopIndex(0)
		setSelection(routeInfo)
		const { route, bound, service_type, dest_tc, dest_en } = routeInfo

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
		<div style={{ outline: "none" }} tabIndex={1} onKeyDown={(e) => handleKeyboardControl(e.key)}>

			{/* Query section for route input and selection */}
			<section className='query-section'>
				<AsyncSelect
					// components={{ Input: props => <components.Input {...props} maxLength={4} /> }}
					autoCapitalize="characters"
					autoFocus
					cacheOptions
					placeholder="請輸入九巴路線編號 &nbsp; Please enter KMB route"
					noOptionsMessage={() => "No result."}
					loadOptions={searchRoute}
					onChange={selectRoute}
				/>
			</section>

			{/* Button groups to control DPIP */}
			<section className='button-handler-section'>
				<Button
					color="error"
					variant="contained"
					startIcon={<ArrowBackIcon />}
					onClick={() => toPrevStop()}
					disabled={!isPrevStopAvailable}
				>
					上一站
				</Button>
				<Button
					color="success"
					variant="contained"
					startIcon={<ArrowForwardIcon />}
					onClick={() => toNextStop()}
					disabled={!isNextStopAvailable}
				>
					下一站
				</Button>
				<Button
					color="error"
					variant="contained"
					startIcon={<NotificationsIcon />}
					onClick={() => setMainDpipBg(prev => prev === 0 ? 1 : 0)}
				>
					{mainDpipBg == 0 ? `按鐘` : `解除鐘`}
				</Button>
				<Button
					variant="contained"
					startIcon={<RefreshIcon />}
					onClick={() => setCurrentStopIndex(0)}
					disabled={isEmptyObject(routeDetail)}
				>
					從首站開始
				</Button>
				<Button
					color="secondary"
					variant="contained"
					startIcon={<CachedIcon />}
					onClick={() => changeBound()}
					disabled={(selection == null || !routeHasTwoBound) || selection?.service_type != 1}
				>
					切換方向
				</Button>
			</section>

			{/* DPIP main screen with full details */}
			<section className='dpip-monitors-section'>
				<DPIPMainScreen
					detail={routeDetail}
					currentStopIndex={currentStopIndex}
					currentBg={mainDpipBg}
				/>
				<DPIPSecScreen
					stops={routeDetail.stops}
					currentStopIndex={currentStopIndex} />

			</section>
		</div >
	)
}

export default App

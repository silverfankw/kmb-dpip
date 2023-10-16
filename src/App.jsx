import { useEffect, useState, useRef } from 'react'

import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RefreshIcon from '@mui/icons-material/Refresh';
import CachedIcon from '@mui/icons-material/Cached';

import { components } from 'react-select';
import AsyncSelect from 'react-select/async';

import './App.css'
import { isEmptyObject } from "../util/util"
import { DPIPSecScreen } from './DpipSecScreen'
import { DPIPMainScreen } from './DpipMainScreen'

function App() {

	const [selection, setSelection] = useState(null)
	const [routeDetail, setRouteDetail] = useState({})
	const [currentStopIndex, setCurrentStopIndex] = useState(0)
	const [routeHasTwoBound, setRouteHasTwoBound] = useState(false)

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
								service_type: route.service_type
							}
						)
				}
			})
	}

	const selectRoute = async ({ label, value }) => {
		const routeInfo = JSON.parse(value)
		setCurrentStopIndex(0)
		setSelection(routeInfo)
		const { route, bound, service_type } = routeInfo

		const stopIDs = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${route}/${bound}/${service_type}`).then(
			resp => resp.json()).then(json => json.data).then(data => data.map(stops => stops.stop))

		const routeAllStops = await Promise.all(
			stopIDs.map(stopID => fetch(`https://data.etabus.gov.hk/v1/transport/kmb/stop/${stopID}`).then(
				resp => resp.json()
			).then(json => json.data).then(data => { return { en: data.name_en, zh: data.name_tc } }))
		)
		setRouteDetail(routeDetail => {
			return { ...routeDetail, route, stops: routeAllStops }
		})
	}

	const changeBound = () => {
		const { route, bound, service_type } = selection
		selectRoute({ value: JSON.stringify({ route, bound: bound == "inbound" ? "outbound" : "inbound", service_type }) })
	}

	return (
		<div className="@container">

			{/* Query section for route input and selection */}
			<section className='@xs:text-xs @sm:text-sm @md:text-md query-section'>
				<AsyncSelect
					// components={{ Input: props => <components.Input {...props} maxLength={4} /> }}
					autoCapitalize="characters"
					autoFocus
					cacheOptions
					placeholder="Please enter KMB route"
					noOptionsMessage={() => "Route not exist."}
					loadOptions={searchRoute}
					onChange={selectRoute}
				/>
			</section>

			{/* Button groups to control DPIP */}
			<section className='button-handler-section'>
				<Button
					color="success"
					variant="contained"
					startIcon={<ArrowForwardIcon />}
					onClick={() => {
						if (isNextStopAvailable) setCurrentStopIndex(prev => prev + 1)
					}}
					disabled={!isNextStopAvailable}
				>
					下一站 Next Stop
				</Button>
				<Button
					color="error"
					variant="contained"
					startIcon={<ArrowBackIcon />}
					onClick={() => {
						if (isPrevStopAvailable) setCurrentStopIndex(prev => prev - 1)
					}}
					disabled={!isPrevStopAvailable}
				>
					前一站 Prev. Stop
				</Button>
				<Button
					variant="contained"
					startIcon={<RefreshIcon />}
					onClick={() => setCurrentStopIndex(0)}
					disabled={isEmptyObject(routeDetail)}
				>
					重新開始 Restart
				</Button>
				<Button
					color="secondary"
					variant="contained"
					startIcon={<CachedIcon />}
					onClick={() => changeBound()}
					disabled={(selection == null || !routeHasTwoBound) || selection?.service_type != 1}
				>
					切換方向 Switch bound
				</Button>
				{/* <Button style={`${!isNextStopAvailable && `opacity-30 cursor-not-allowed`} 
				from-green-500 via-green-600 to-green-700 focus:ring-green-300
				`}
					onClick={() => {
						if (isNextStopAvailable) setCurrentStopIndex(prev => prev + 1)
					}}
					text="下一站 Next stop" />
				<Button
					style={`${!isPrevStopAvailable && `opacity-30 cursor-not-allowed`} 
					from-red-500 via-red-600 to-red-700 focus:ring-red-300`}
					onClick={() => {
						if (isPrevStopAvailable) setCurrentStopIndex(prev => prev - 1)
					}}
					text="前一站 Previous Stop" />
				<Button
					style={`${isEmptyObject(routeDetail) && `opacity-30 cursor-not-allowed`}
					from-cyan-500 via-cyan-600 to-cyan-700 focus:ring-cyan-300`
					}
					onClick={() => setCurrentStopIndex(0)}
					text="重新開始 Restart"
				/>
				<Button
					style={`${(selection == null || !routeHasTwoBound) && `opacity-30 cursor-not-allowed`}
					from-purple-500 via-purple-600 to-purple-700 focus:ring-purple-300`
					}
					onClick={() => {
						if ((selection != null && routeHasTwoBound))
							changeBound()
					}}
					text="切換至另一方向站位 Switch bound"
				/> */}
			</section>

			{/* DPIP main screen with full details */}
			<section className='dpip-monitors-section'>
				<DPIPMainScreen
					detail={routeDetail}
					currentStopIndex={currentStopIndex}
				/>
				<DPIPSecScreen
					stops={routeDetail.stops}
					currentStopIndex={currentStopIndex} />
			</section>



		</div >
	)
}

export default App

import { useEffect, useState } from 'react'
import { useSearchParams } from "react-router-dom";

import './App.css'
import { Button } from './component/Button'
import { Input } from './component/Input'
import { Selector } from './component/Selector';
import { isEmptyObject } from "../util/util"
import { DPIPSecScreen } from './DpipSecScreen'
import { DPIPMainScreen } from './DpipMainScreen'

function App() {

	const [validInput, setValidInput] = useState(true)
	const [routeDetail, setRouteDetail] = useState({})
	const [searchParams, setSearchParams] = useSearchParams({ route: "" });
	const [currentStopIndex, setCurrentStopIndex] = useState(0)

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

	const searchRoute = route => setSearchParams({ route: route.toUpperCase() })

	// Check for input validity and render options if input valids
	const renderRouteOptions = () => {
		const inputRoute = searchParams.get("route")

		if (!inputRoute) return (<option value="沒有選項" disabled>沒有選項</option>)

		const filteredRoute = getRouteList().filter(
			route => route.route == inputRoute)

		// Set valid state for input component
		if (filteredRoute.length == 0)
			setValidInput(false)
		else
			setValidInput(true)

		// Render route options for select component
		return filteredRoute.map(
			(route, index) => {
				return (
					<option
						key={`route-option-${route.route}-${index}`}
						data-key={`${route}-${route.dest_tc}`}
						value={`${route.route}/${route.bound == "I" ? "inbound" : "outbound"}/${route.service_type}`}>
						{`${route.route}  ${route.orig_tc} 往 ${route.dest_tc}${route.service_type != 1 ? " *特別班次" : ""}`}</option>)
			})
	}

	const selectRoute = async routeInfo => {
		setCurrentStopIndex(0)

		const stopIDs = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${routeInfo}`).then(
			resp => resp.json()).then(json => json.data).then(data => data.map(stops => stops.stop))

		const routeAllStops = await Promise.all(
			stopIDs.map(stopID => fetch(`https://data.etabus.gov.hk/v1/transport/kmb/stop/${stopID}`).then(
				resp => resp.json()
			).then(json => json.data).then(data => { return { en: data.name_en, zh: data.name_tc } }))
		)
		setRouteDetail(routeDetail => {
			return { ...routeDetail, route: routeInfo.split("/")[0], stops: routeAllStops }
		})
	}

	return (
		<>

			{/* Query section for route input and selection */}
			<section className='query-section'>
				<Input
					validInput={validInput}
					invalidMessage="沒有此路線。"
					className="route-input"
					value={searchParams.get("route")}
					placeholder="請先輸入九巴路線編號"
					maxLength={4}
					onChange={searchRoute}
					submitAction={searchRoute}
				/>
				<Selector onChange={selectRoute} optionRenderLogic={renderRouteOptions} />
			</section>

			{/* Button groups to control DPIP */}
			<section className='button-handler-section'>
				<Button style={`${!isNextStopAvailable && `opacity-30 cursor-not-allowed`} 
				from-green-500 via-green-600 to-green-700 focus:ring-green-300
				`}
					onClick={() => {
						if (isNextStopAvailable) setCurrentStopIndex(prev => prev + 1)
					}}
					text="下一站" />
				<Button
					style={`${!isPrevStopAvailable && `opacity-30 cursor-not-allowed`} 
					from-red-500 via-red-600 to-red-700 focus:ring-red-300`}
					onClick={() => {
						if (isPrevStopAvailable) setCurrentStopIndex(prev => prev - 1)
					}}
					text="前一站" />
				<Button
					style={`${isEmptyObject(routeDetail) && `opacity-30 cursor-not-allowed`}
					from-cyan-500 via-cyan-600 to-cyan-700 focus:ring-cyan-300`
					}
					onClick={() => setCurrentStopIndex(0)}
					text="重新開始"
				/>
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



		</>
	)
}

export default App

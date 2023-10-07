import { useEffect, useState } from 'react'
import { useSearchParams } from "react-router-dom";


import './App.css'
import { Button } from './component/Button'
import { Input } from './component/Input'
import { Selector } from './component/Selector';
import { DPIPSecScreen } from './DpipSecScreen'
import { DPIPMainScreen } from './DpipMainScreen'

function App() {

	const [stops, setStops] = useState([])

	const [searchParams, setSearchParams] = useSearchParams({ route: "" });
	const [currentStopIndex, setCurrentStopIndex] = useState(0)

	const route = {
		"route": "289R",
		"dest": {
			"en": "SHATIN CENTRAL",
			"zh": "沙田巿中心"
		},
		"stops": [
			{
				"zh": "黃石碼頭總站",
				"en": "WONG SHEK PIER BUS TERMINUS"
			},
			{
				"zh": "高塘下洋",
				"en": "KO TONG HA YEUNG"
			},
			{
				"zh": "高塘",
				"en": "KO TONG"
			},
			{
				"zh": "土瓜坪",
				"en": "TO KWA PIN"
			},
			{
				"zh": "北潭凹",
				"en": "PAK TAM AU"
			},
			{
				"zh": "北潭凹管理站",
				"en": "PAK TAM AU MANAGEMENT CENTRE"
			},
			{
				"zh": "麥理浩夫人度假村",
				"en": "LADY MACLEHOSE HOLIDAY VILLAGE"
			},
			{
				"zh": "鯽魚湖",
				"en": "TSAK YUE WU"
			},
			{
				"zh": "上窰",
				"en": "SHEUNG YIU"
			},
			{
				"zh": "北潭涌",
				"en": "PAK TAM CHUNG"
			},
			{
				"zh": "黃麖地",
				"en": "WONG KENG TEI"
			},
			{
				"zh": "斬竹灣",
				"en": "TSAM CHUK WAN"
			},
			{
				"zh": "西貢戶外訓練營",
				"en": "SAI KUNG OUTDOOR TRAINING CAMP"
			},
			{
				"zh": "大網仔新村",
				"en": "TAI MONG TSAI SAN TSUEN"
			},
			{
				"zh": "大網仔",
				"en": "TAI MONG TSAI"
			},
			{
				"zh": "亞公灣",
				"en": "AH KUNG WAN"
			},
			{
				"zh": "鳳秀路",
				"en": "FUNG SAU ROAD"
			},
			{
				"zh": "早禾坑",
				"en": "TSO WO HANG"
			},
			{
				"zh": "大網仔路黃竹灣",
				"en": "TAI MONG TSAI ROAD WONG CHUK WAN"
			},
			{
				"zh": "西沙路黃竹灣",
				"en": "SAI SHA ROAD WONG CHUK WAN"
			},
			{
				"zh": "澳頭",
				"en": "O TAU"
			},
			{
				"zh": "澳頭新村",
				"en": "O TAU NEW VILLAGE"
			},
			{
				"zh": "水浪窩",
				"en": "SHUI LONG WO"
			},
			{
				"zh": "企嶺下老圍",
				"en": "KEI LING HA LO WAI"
			},
			{
				"zh": "企嶺下新圍",
				"en": "KEI LING HA SAN WAI"
			},
			{
				"zh": "西徑",
				"en": "SAI KENG"
			},
			{
				"zh": "瓦窰頭",
				"en": "NGA YIU TAU"
			},
			{
				"zh": "田寮",
				"en": "TIN LIU"
			},
			{
				"zh": "輋下",
				"en": "CHE HA"
			},
			{
				"zh": "西澳",
				"en": "SAI O"
			},
			{
				"zh": "樟木頭帝琴灣",
				"en": "SYMPHONY BAY"
			},
			{
				"zh": "石門轉車站-新界鄉議局大樓 (S5)",
				"en": "SHEK MUN BBI - HEUNG YEE KUK BUILDING (S5)"
			},
			{
				"zh": "沙田第一城",
				"en": "CITY ONE SHATIN"
			},
			{
				"zh": "富豪花園",
				"en": "BELAIR GARDEN"
			},
			{
				"zh": "麗豪酒店",
				"en": "REGAL RIVERSIDE HOTEL"
			},
			{
				"zh": "沙田市中心總站",
				"en": "SHATIN CENTRAL BUS TERMINUS"
			},
			{
				"zh": "",
				"en": ""
			},
			{
				"zh": "",
				"en": ""
			}
		]
	}

	const inputRoute = searchParams.get("route")

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

	const lastStopIndex = route.stops.length - 1 ?? 0
	const isPrevStopAvailable = currentStopIndex - 1 >= 0
	const isNextStopAvailable = currentStopIndex + 3 <= lastStopIndex

	const searchRoute = route => setSearchParams({ route: route.toUpperCase() })

	const renderRouteOptions = () => {
		return inputRoute ? getRouteList().filter(
			route => route.route == inputRoute
		).map(
			(route, index) => {
				return (
					<option
						key={`route-option-${index}`}
						data-key={`${route}-${route.dest_tc}`}
						value={`${route.route}/${route.bound == "I" ? "inbound" : "outbound"}/${route.service_type}`}>
						{`${route.route}  ${route.orig_tc} 往 ${route.dest_tc} `}</option>)
			}) : <option value="沒有選項" disabled>沒有選項</option>
	}

	const selectRoute = async routeInfo => {
		const stopIDs = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${routeInfo}`).then(
			resp => resp.json()).then(json => json.data).then(data => data.map(stops => stops.stop))

		const routeAllStops = await Promise.all(
			stopIDs.map(stopID => fetch(`https://data.etabus.gov.hk/v1/transport/kmb/stop/${stopID}`).then(
				resp => resp.json()
			).then(json => json.data).then(data => { return { en: data.name_en, zh: data.name_tc } }))
		)
		// console.log(routeAllStops)
		setStops(routeAllStops)
	}

	return (
		<>

			{/* Query section for route input and selection */}
			<div className='query_section'>
				<Input
					className="route_input"
					value={searchParams.get("route")}
					placeholder="請先輸入路線編號"
					maxLength={4}
					onChange={searchRoute}
					submitAction={searchRoute}
				/>
				<Selector onChange={selectRoute} optionRenderLogic={renderRouteOptions} />
			</div>

			{/* Button groups to control DPIP */}
			<div className='button_handler_section'>
				<Button style={`${!isNextStopAvailable && `opacity-40 cursor-not-allowed`} bg-green-600`}
					onClick={() => {
						if (isNextStopAvailable) setCurrentStopIndex(prev => prev + 1)
					}}
					text="Next Stop" />
				<Button
					style={`${!isPrevStopAvailable && `opacity-40 cursor-not-allowed`} bg-red-700`}
					onClick={() => {
						if (isPrevStopAvailable) setCurrentStopIndex(prev => prev - 1)
					}}
					text="Last Stop" />
				<Button
					style="bg-cyan-600"
					onClick={() => setCurrentStopIndex(0)}
					text="Rerun"
				/>
			</div>

			{/* DPIP main screen with full details */}
			<div className='dpip_monitors_section'>
				{/* <DPIPMainScreen
					detail={route}
					currentStopIndex={currentStopIndex}
				/> */}

				<DPIPSecScreen
					stops={stops}
					currentStopIndex={currentStopIndex} />
			</div>



		</>
	)
}

export default App

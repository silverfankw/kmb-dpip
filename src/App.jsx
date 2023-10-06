import { useEffect, useState } from 'react'
import './App.css'
import { Button } from './component/Button'
import { DPIPSecScreen } from './DpipSecScreen'
import { DPIPMainScreen } from './DpipMainScreen'

function App() {

	const [currentStopIndex, setCurrentStopIndex] = useState(0)

	const route = {
		"route": "35A",
		"dest": {
			"en": "KWAI CHUNG (ON YAM ESTATE)",
			"zh": "葵涌(安蔭邨)"
		},
		"stops": [
			{
				"zh": "尖沙咀東總站",
				"en": "TSIM SHA TSUI EAST BUS TERMINUS"
			},
			{
				"zh": "香港科學館",
				"en": "HONG KONG SCIENCE MUSEUM"
			},
			{
				"zh": "尖沙咀麼地道",
				"en": "MODY ROAD TSIM SHA TSUI"
			},
			{
				"zh": "尖東站",
				"en": "EAST TSIM SHA TSUI STATION"
			},
			{
				"zh": "尖沙咀轉車站 - 中間道 (N2)",
				"en": "TSIM SHA TSUI BBI - MIDDLE ROAD (N2)"
			},
			{
				"zh": "金巴利道 (N11)",
				"en": "KIMBERLEY ROAD (N11)"
			},
			{
				"zh": "油麻地寶靈街 (N20)",
				"en": "BOWRING STREET YAU MA TEI (N20)"
			},
			{
				"zh": "九龍中央郵政局 (N30)",
				"en": "KOWLOON CENTRAL POST OFFICE (N30)"
			},
			{
				"zh": "旺角登打士街 (N51)",
				"en": "DUNDAS STREET MONG KOK (N51)"
			},
			{
				"zh": "旺角奶路臣街 (N61)",
				"en": "NELSON STREET MONG KOK (N61)"
			},
			{
				"zh": "旺角弼街 (N72)",
				"en": "BUTE STREET MONG KOK (N72)"
			},
			{
				"zh": "太子站 (N76)",
				"en": "PRINCE EDWARD STATION (N76)"
			},
			{
				"zh": "深水埗楓樹街",
				"en": "MAPLE STREET SHAM SHUI PO"
			},
			{
				"zh": "深水埗北河街",
				"en": "PEI HO STREET SHAM SHUI PO"
			},
			{
				"zh": "麗閣邨",
				"en": "LAI KOK ESTATE"
			},
			{
				"zh": "貿易廣場",
				"en": "TRADE SQUARE"
			},
			{
				"zh": "荔枝角站",
				"en": "LAI CHI KOK STATION"
			},
			{
				"zh": "饒宗頤文化館",
				"en": "JAO TSUNG-I ACADEMY"
			},
			{
				"zh": "鐘山台",
				"en": "CHUNG SHAN TERRACE"
			},
			{
				"zh": "華員邨",
				"en": "WAH YUEN CHUEN"
			},
			{
				"zh": "葵涌業成街",
				"en": "YIP SHING STREET KWAI CHUNG"
			},
			{
				"zh": "葵涌打磚坪街",
				"en": "TA CHUEN PING STREET KWAI CHUNG"
			},
			{
				"zh": "石籬(大隴街)總站",
				"en": "SHEK LEI (TAI LOONG STREET) BUS TERMINUS"
			},
			{
				"zh": "石籬邨石佳樓",
				"en": "SHEK KAI HOUSE SHEK LEI ESTATE"
			},
			{
				"zh": "石籬天主教小學",
				"en": "SHEK LEI CATHOLIC PRIMARY SCHOOL"
			},
			{
				"zh": "石排街石歡樓",
				"en": "SHEK FOON HOUSE SHEK PAI STREET"
			},
			{
				"zh": "北葵涌街市",
				"en": "NORTH KWAI CHUNG MARKET"
			},
			{
				"zh": "石蔭東邨",
				"en": "SHEK YAM EAST ESTATE"
			},
			{
				"zh": "安蔭邨豐蔭樓",
				"en": "FUNG YAM HOUSE ON YAM ESTATE"
			},
			{
				"zh": "安蔭巴士總站",
				"en": "ON YAM BUS TERMINUS"
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

	const lastStopIndex = route.stops.length - 1 ?? 0
	const isPrevStopAvailable = currentStopIndex - 1 >= 0
	const isNextStopAvailable = currentStopIndex + 3 <= lastStopIndex

	return (
		<>
			<div className='button_handler_group'>
				<Button style={`${!isNextStopAvailable && `opacity-50 cursor-not-allowed`} bg-green-600`}
					onClick={() => {
						if (isNextStopAvailable) setCurrentStopIndex(prev => prev + 1)
					}}
					text="Next Stop" />
				<Button
					style={`${!isPrevStopAvailable && `opacity-50 cursor-not-allowed`} bg-red-700`}
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
			<div className='dpip_monitors_group'>
				<DPIPMainScreen
					detail={route}
					currentStopIndex={currentStopIndex}
				/>

				<DPIPSecScreen
					stops={route.stops}
					currentStopIndex={currentStopIndex} />
			</div>

		</>
	)
}

export default App

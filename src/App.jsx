import { useEffect, useState } from 'react'
import './App.css'
import { Button } from './component/Button'
import { DPIPSecScreen } from './DpipSecScreen'
import { DPIPMainScreen } from './DpipMainScreen'

function App() {

	const [currentStopIndex, setCurrentStopIndex] = useState(0)

	const stops = [
		{
			"name_zh": "如心廣場巴士總站",
			"name_en": "NINA TOWER BUS TERMINUS"
		},
		{
			"name_zh": "荃灣富華街",
			"name_en": "FU WAH STREET TSUEN WAN"
		},
		{
			"name_zh": "荃景圍天橋",
			"name_en": "TSUEN KING CIRCUIT FLYOVER"
		},
		{
			"name_zh": "荃灣柴灣角街",
			"name_en": "CHAI WAN KOK STREET TSUEN WAN"
		},
		{
			"name_zh": "麗城花園第三期",
			"name_en": "BELVEDERE GARDEN PHASE 3"
		},
		{
			"name_zh": "灣景花園",
			"name_en": "BAYVIEW GARDEN"
		},
		{
			"name_zh": "翠景臺",
			"name_en": "GREENVIEW TERRACE"
		},
		{
			"name_zh": "油柑頭",
			"name_en": "YAU KOM TAU"
		},
		{
			"name_zh": "近水灣",
			"name_en": "APPROACH BEACH"
		},
		{
			"name_zh": "南山游泳會",
			"name_en": "SOUTH MOUNTAIN SWIMMING ASSOCIATION"
		},
		{
			"name_zh": "汀九",
			"name_en": "TING KAU"
		},
		{
			"name_zh": "麗都灣",
			"name_en": "LIDO BEACH"
		},
		{
			"name_zh": "海美灣",
			"name_en": "HOI MEI BEACH"
		},
		{
			"name_zh": "深井深慈街",
			"name_en": "SHAM TSZ STREET SHAM TSENG"
		},
		{
			"name_zh": "碧堤半島",
			"name_en": "BELLAGIO"
		},
		{
			"name_zh": "深井村",
			"name_en": "SHAM TSENG VILLAGE"
		},
		{
			"name_zh": "馬灣碼頭",
			"name_en": "MA WAN PIER"
		},
		{
			"name_zh": "浪翠園第三期",
			"name_en": "SEA CREST VILLA PHASE 3"
		},
		{
			"name_zh": "浪翠園第四期",
			"name_en": "SEA CREST VILLA PHASE 4"
		},
		{
			"name_zh": "青龍頭村",
			"name_en": "TSING LUNG TAU TSUEN"
		},
		{
			"name_zh": "豪景花園",
			"name_en": "HONG KONG GARDEN"
		},
		{
			"name_zh": "豪景花園商場",
			"name_en": "HONG KONG GARDEN COMMERCIAL COMPLEX"
		},
		{
			"name_zh": "御天峰",
			"name_en": "VISTACLIFF"
		},
		{
			"name_zh": "御海峰",
			"name_en": "VISTACOVE"
		},
		{
			"name_zh": "嘉龍村",
			"name_en": "KA LOON TSUEN"
		},
		{
			"name_zh": "屯門公路轉車站 (C5)",
			"name_en": "TUEN MUN ROAD BBI (C5)"
		},
		{
			"name_zh": "大欖涌",
			"name_en": "TAI LAM CHUNG"
		},
		{
			"name_zh": "小欖",
			"name_en": "SIU LAM"
		},
		{
			"name_zh": "小欖澄麗路",
			"name_en": "CHING LAI ROAD SIU LAM"
		},
		{
			"name_zh": "小欖村",
			"name_en": "SIU LAM TSUEN"
		},
		{
			"name_zh": "小欖新村",
			"name_en": "SIU LAM SAN TSUEN"
		},
		{
			"name_zh": "愛琴灣",
			"name_en": "THE AEGEAN"
		},
		{
			"name_zh": "小秀上村",
			"name_en": "SIU SAU SHEUNG TSUEN"
		},
		{
			"name_zh": "龍珠島",
			"name_en": "PEARL ISLAND"
		},
		{
			"name_zh": "香港黃金海岸",
			"name_en": "HONG KONG GOLD COAST"
		},
		{
			"name_zh": "黃金泳灘",
			"name_en": "GOLDEN BEACH"
		},
		{
			"name_zh": "咖啡灣",
			"name_en": "CAFETERIA BEACH"
		},
		{
			"name_zh": "碧翠花園",
			"name_en": "BAYVIEW TERRACE"
		},
		{
			"name_zh": "青山灣碼頭",
			"name_en": "CASTLE PEAK PIER"
		},
		{
			"name_zh": "三聖邨",
			"name_en": "SAM SHING ESTATE"
		},
		{
			"name_zh": "屯門兆麟政府綜合大樓",
			"name_en": "TUEN MUN SIU LUN GOVERNMENT COMPLEX"
		},
		{
			"name_zh": "青善遊樂場",
			"name_en": "TSING SIN PLAYGROUND"
		},
		{
			"name_zh": "置樂花園",
			"name_en": "CHI LOK FA YUEN"
		},
		{
			"name_zh": "華都花園",
			"name_en": "WALDORF GARDEN"
		},
		{
			"name_zh": "何福堂書院",
			"name_en": "HOH FUK TONG COLLEGE"
		},
		{
			"name_zh": "庇護工場",
			"name_en": "SHELTERED WORKSHOP"
		},
		{
			"name_zh": "景峰花園",
			"name_en": "PRIME VIEW GARDEN"
		},
		{
			"name_zh": "屯門醫院(鳳地站)",
			"name_en": "TUEN MUN HOSPITAL (FUNG TEI STATION)"
		},
		{
			"name_zh": "彩暉花園",
			"name_en": "BRILLIANT GARDEN"
		},
		{
			"name_zh": "嶺南大學",
			"name_en": "LINGNAN UNIVERSITY"
		},
		{
			"name_zh": "富泰邨",
			"name_en": "FU TAI ESTATE"
		},
		{
			"name_zh": "藍地站",
			"name_en": "LAM TEI STATION"
		},
		{
			"name_zh": "青磚圍",
			"name_en": "TSING CHUEN WAI"
		},
		{
			"name_zh": "泥圍站",
			"name_en": "NAI WAI STATION"
		},
		{
			"name_zh": "亦園村",
			"name_en": "YICK YUEN TSUEN"
		},
		{
			"name_zh": "鍾屋村站",
			"name_en": "CHUNG UK TSUEN STATION"
		},
		{
			"name_zh": "鄉事委員會",
			"name_en": "RURAL COMMITTEE"
		},
		{
			"name_zh": "田心",
			"name_en": "TIN SUM"
		},
		{
			"name_zh": "新李屋村",
			"name_en": "SAN LEE UK TSUEN"
		},
		{
			"name_zh": "新生村",
			"name_en": "SAN SANG TSUEN"
		},
		{
			"name_zh": "李屋村",
			"name_en": "LEE UK TSUEN"
		},
		{
			"name_zh": "新屋村",
			"name_en": "SAN UK TSUEN"
		},
		{
			"name_zh": "廈村市",
			"name_en": "HA TSUEN SHI"
		},
		{
			"name_zh": "廈村",
			"name_en": "HA TSUEN"
		},
		{
			"name_zh": "沙洲里村",
			"name_en": "SHA CHAU LEI TSUEN"
		},
		{
			"name_zh": "天水圍站",
			"name_en": "TIN SHUI WAI STATION"
		},
		{
			"name_zh": "上章圍",
			"name_en": "SHEUNG CHEUNG WAI"
		},
		{
			"name_zh": "坑尾村",
			"name_en": "HANG MEI TSUEN"
		},
		{
			"name_zh": "屏山屏興里",
			"name_en": "PING HING LANE PING SHAN"
		},
		{
			"name_zh": "屏山",
			"name_en": "PING SHAN"
		},
		{
			"name_zh": "水邊圍邨",
			"name_en": "SHUI PIN WAI ESTATE"
		},
		{
			"name_zh": "元朗喜利徑 (N6)",
			"name_en": "HI LEE PATH YUEN LONG (N6)"
		},
		{
			"name_zh": "元朗谷亭街 (N14)",
			"name_en": "KUK TING STREET YUEN LONG (N14)"
		},
		{
			"name_zh": "元朗 形點",
			"name_en": "YOHO MALL (YUEN LONG)"
		}
	].concat({ "name_zh": " ", "name_en": " " },
		{ "name_zh": " ", "name_en": " " })

	const lastStopIndex = stops.length - 1
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
			{/* <DPIPMainScreen
					stops={stops}
				/> */}

			<DPIPSecScreen
				stops={stops}
				currentStopIndex={currentStopIndex} />


		</>
	)
}

export default App

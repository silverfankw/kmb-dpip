import './App.css'

import { useEffect, useState } from 'react'
import { createFilter } from 'react-select';
import AsyncSelect from 'react-select/async';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RefreshIcon from '@mui/icons-material/Refresh';
import CachedIcon from '@mui/icons-material/Cached';
import NotificationsIcon from '@mui/icons-material/Notifications';
import KeyboardHideIcon from '@mui/icons-material/KeyboardHide';
import BadgeIcon from '@mui/icons-material/Badge';
import FeedbackIcon from '@mui/icons-material/Feedback';
import DoorSlidingIcon from '@mui/icons-material/DoorSliding';
import { Popover } from '@base-ui-components/react/popover';

import { routeContext } from './context/Provider';
import { isEmptyObject } from "../util/util"
import { DPIPSecScreen } from './DpipSecScreen'
import { DPIPMainScreen } from './DpipMainScreen'
// import { BellButton } from './component/BellButton';
import { Input } from "./component/Input"
import Footer from './component/Footer';
import { SwitchButton } from './component/SwitchButton';

function App() {
	const [selection, setSelection] = useState(null)
	const [routeDetail, setRouteDetail] = useState({})
	const [currentStopIndex, setCurrentStopIndex] = useState(0)
	const [routeHasTwoBound, setRouteHasTwoBound] = useState(false)
	const [userPreference, setUserPreference] = useState(
		{
			containerStyle: "basic",
			stopPressed: false,
			driverInfo: { nameZh: "九巴仔", nameEn: "KMB Boy", staffNo: "1933" },
			customizeDriverInfo: false,
			mindDoorNotice: false,
			handrailNotice: false,
		}
	)
	const containerStyle = {
		basic: "shadow-[0.5rem_0.5rem_1rem_0.25rem_#FFF] max-sm:border-[.25em] max-sm:outline-[.75rem] border-[.5em] border-solid border-[#0e0e0fbf] rounded-xl outline outline-[1rem] outline-[#1B1212]",
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
			gold: {
				main: "#996515",
				light: '#B17A02',
				dark: '#B17A02',
				contrastText: '#B17A02',
			},
			navy: {
				main: "#12296C",
			},
			darkred: {
				main: "#8B0000",
				light: '#8B0000',
				dark: '#8B0000',
				contrastText: '#8B0000',
			},
			snowwhite: {
				main: "#FFFFFF",
			}
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

	const lastStopIndex = routeDetail?.stops?.length - 1
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
			<routeContext.Provider value={{ routeDetail, currentStopIndex, lastStopIndex }}>
				<div className="select-none focus:outline-hidden p-[2rem] flex flex-col gap-2" tabIndex={1}
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

					{/* <BellButton onClick={() => setUserPreference(prev => { return { ...prev, stopPressed: !prev.stopPressed } })} /> */}

					{/* Switch groups to control DPIP */}
					<section className='flex flex-wrap max-sm:gap-[2vw] gap-[1vw] my-[0.5em]'>

						{/* Stop Bell toggle */}
						<SwitchButton
							sx={{
								width: "max-content",
								bgcolor: "error.main",
								borderRadius: 1,
								paddingRight: "10px", // Expand box to fit content
								marginLeft: "0px", // Reset the default left overflow
								boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
								"&:hover": { bgcolor: "error.dark" }
							}}
							control={
								<Switch
									checked={userPreference.stopPressed}
									color="darkred"
									onChange={() => setUserPreference(prev => {
										return { ...prev, stopPressed: !prev.stopPressed }
									})}
									name="stop pressed" />
							}
							label={
								<>
									<NotificationsIcon color="snowwhite" />
									<Typography variant="button" color="white">
										{userPreference.stopPressed ? `  解除鐘` : ` 按鐘`}
									</Typography>
								</>}
						/>

						{/* Hold Handrail Notice toggle */}
						<SwitchButton
							sx={{
								width: "max-content",
								bgcolor: "ochre.main",
								borderRadius: 1,
								paddingRight: "10px",
								boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
								"&:hover": { bgcolor: "ochre.dark" }
							}}
							control={
								<Switch
									checked={userPreference.handrailNotice}
									color="gold"
									onChange={() => setUserPreference(prev => {
										return {
											...prev,
											handrailNotice: !prev.handrailNotice,
											mindDoorNotice: prev.mindDoorNotice && false
										}
									})} name="handrail notice" />
							}
							label={
								<>
									<FeedbackIcon />
									<Typography variant="button">
										「緊握扶手」提示
									</Typography>
								</>}
						/>

						{/* Mind Door Notice toggle */}
						<SwitchButton
							sx={
								theme => ({
									width: "max-content",
									bgcolor: "ochre.main",
									borderRadius: 1,
									paddingRight: "10px",
									boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
									"&:hover": { bgcolor: "ochre.dark" },
									marginLeft: { // fix responsive layout flex-wrap causing margin left overflow
										[theme.breakpoints.down('md')]: { marginLeft: "0px" },
									}
								})}
							control={
								<Switch
									checked={userPreference.mindDoorNotice}
									color="gold"
									onChange={() => setUserPreference(prev => {
										return {
											...prev,
											handrailNotice: prev.handrailNotice && false,
											mindDoorNotice: !prev.mindDoorNotice
										}
									})} name="mind door notice" />
							}
							label={
								<>
									<DoorSlidingIcon />
									<Typography variant="button">
										「車門正在關上」提示
									</Typography>
								</>}
						/>
					</section>

					{/* Button groups to control DPIP */}
					<section className='flex flex-wrap max-sm:gap-[2vw] gap-[1vw] mb-[1em] mx-0'>
						<Tooltip
							arrow
							placement="bottom-start"
							title="鍵盤快捷鍵: '←'">
							<span>
								<Button
									color="error"
									variant="contained"
									startIcon={<ArrowBackIcon />}
									onClick={() => toPrevStop()}
									disabled={!isPrevStopAvailable}
								>
									上站
								</Button>
							</span>
						</Tooltip>

						<Tooltip
							arrow
							placement="bottom-start"
							title="鍵盤快捷鍵: '→'">
							<span>
								<Button
									color="success"
									variant="contained"
									startIcon={<ArrowForwardIcon />}
									onClick={() => toNextStop()}
									disabled={!isNextStopAvailable}
								>
									下站
								</Button>
							</span>
						</Tooltip>

						<Tooltip
							arrow
							placement="bottom-start"
							title="鍵盤快捷鍵: 'HOME'">
							<span>
								<Button
									variant="contained"
									startIcon={<RefreshIcon />}
									onClick={() => setCurrentStopIndex(0)}
									disabled={isEmptyObject(routeDetail) || currentStopIndex == 0}
								>
									首站重新開始
								</Button>
							</span>
						</Tooltip>

						<Tooltip
							arrow
							placement="bottom-start"
							title="鍵盤快捷鍵: 'END'">
							<span>
								<Button
									color="secondary"
									variant="contained"
									startIcon={<CachedIcon />}
									onClick={() => changeBound()}
									disabled={(selection == null || !routeHasTwoBound) || selection?.service_type != 1}
								>
									切換路線方向
								</Button>
							</span>
						</Tooltip>

						<Button
							color="ochre"
							variant="contained"
							startIcon={<BadgeIcon />}
							onClick={() => { setUserPreference(prev => { return { ...prev, customizeDriverInfo: !prev.customizeDriverInfo } }) }}
						>
							自定義車長資料
						</Button>
					</section>

					{/* Customizeable driver info with input group */}
					{userPreference.customizeDriverInfo ?
						<section className="flex gap-3 mb-[1em]">
							<Input
								placeholder="車長中文姓氏 (最多2字)"
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
								placeholder="車長英文姓氏 (最多10字)"
								maxLength={10}
								defaultValue={userPreference.driverInfo.nameEn}
								onChange={v => {
									if (v == "") v = "KMB Boy"
									setUserPreference({
										...userPreference,
										driverInfo: { ...userPreference.driverInfo, nameEn: v }
									})
								}} />

							<Input placeholder="職員編號 (0至6位數字)"
								type="number"
								minLength={1}
								maxLength={6}
								defaultValue={userPreference.driverInfo.staffNo}
								onInput={e => e.target.value = Math.abs(e.target.value.slice(0, 6))}
								onChange={v => {
									if (v == "") v = "1933"
									setUserPreference({
										...userPreference,
										driverInfo: { ...userPreference.driverInfo, staffNo: v }
									})
								}} />
						</section> : <></>}

					{/* DPIP main screen with full details */}
					<section className="py-4 flex flex-wrap 
					max-md:gap-[6vw] gap-[3vw]">
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

					<Footer />
				</div >
			</routeContext.Provider>
		</ThemeProvider >
	)
}

export default App

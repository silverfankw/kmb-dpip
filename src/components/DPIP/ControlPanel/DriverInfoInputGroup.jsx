import { useSelector, useDispatch } from "react-redux"
import { getAppTextConfig } from '@components/sharedComponentConfig'
import { setDriverInfo } from "@store/userPreferenceSlice"

import { Input } from "@components"

export const DriverInfoInputGroup = () => {

	const { driverInfo, language } = useSelector(state => state.userPreference)
	const appText = getAppTextConfig(language)
	const dispatch = useDispatch()

	return (
		<>
			<Input
				placeholder={appText.driverInfoZhPlaceholder}
				maxLength={2}
				value={driverInfo?.nameZh}
				defaultValue={driverInfo?.nameZh}
				onChange={v => {
					dispatch(setDriverInfo({ nameZh: v }))
				}}
			/>
			<Input
				style={"capitalize"}
				placeholder={appText.driverInfoEnPlaceholder}
				maxLength={10}
				value={driverInfo?.nameEn}
				defaultValue={driverInfo?.nameEn}
				onChange={v => {
					dispatch(setDriverInfo({ nameEn: v }))
				}}
			/>

			<Input placeholder={appText.staffNoPlaceholder}
				type="number"
				minLength={1}
				maxLength={6}
				value={driverInfo?.staffNo}
				defaultValue={driverInfo?.staffNo}
				onInput={e => e.target.value = Math.abs(e.target.value.slice(0, 6))}
				onChange={v => {
					dispatch(setDriverInfo({ staffNo: v }))
				}}
			/>
		</>
	)
}
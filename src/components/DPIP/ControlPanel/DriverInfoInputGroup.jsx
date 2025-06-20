import { useSelector, useDispatch } from "react-redux"
import { setDriverInfo } from "@store/userPreferenceSlice"

import { Input } from "@components"

export const DriverInfoInputGroup = () => {

	const { driverInfo } = useSelector(state => state.userPreference)
	const dispatch = useDispatch()

	return (
		<>
			<p className="">車長資料</p>
			<Input
				placeholder="車長中文姓氏 (最多2字)"
				maxLength={2}
				value={driverInfo?.nameZh}
				defaultValue={driverInfo?.nameZh}
				onChange={v => {
					if (v == "") v = "九巴仔"
					dispatch(setDriverInfo({ nameZh: v }))
				}}
			/>
			<Input
				style={"capitalize"}
				placeholder="車長英文姓氏 (最多10字)"
				maxLength={10}
				value={driverInfo?.nameEn}
				defaultValue={driverInfo?.nameEn}
				onChange={v => {
					if (v == "") v = "KMB Boy"
					dispatch(setDriverInfo({ nameEn: v }))
				}}
			/>

			<Input placeholder="職員編號 (1位至6位數字)"
				type="number"
				minLength={1}
				maxLength={6}
				value={driverInfo?.staffNo}
				defaultValue={driverInfo?.staffNo}
				onInput={e => e.target.value = Math.abs(e.target.value.slice(0, 6))}
				onChange={v => {
					if (v == "") v = "1933"
					dispatch(setDriverInfo({ staffNo: v }))
				}}
			/>
		</>
	)
}
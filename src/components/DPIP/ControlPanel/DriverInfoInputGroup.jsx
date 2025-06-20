import { Input } from "@components"

export const DriverInfoInputGroup = ({ userPreference, dispatchUserPreference }) => (
	<>
		<p className="">車長資料</p>
		<Input
			placeholder="車長中文姓氏 (最多2字)"
			maxLength={2}
			value={userPreference?.driverInfo?.nameZh}
			defaultValue={userPreference?.driverInfo?.nameZh}
			onChange={v => {
				if (v == "") v = "九巴仔"
				dispatchUserPreference({
					type: "SET_DRIVER_INFO",
					payload: { nameZh: v }
				})
			}} />
		<Input
			style={"capitalize"}
			placeholder="車長英文姓氏 (最多10字)"
			maxLength={10}
			value={userPreference?.driverInfo?.nameEn}
			defaultValue={userPreference?.driverInfo?.nameEn}
			onChange={v => {
				if (v == "") v = "KMB Boy"
				dispatchUserPreference({
					type: "SET_DRIVER_INFO",
					payload: { nameEn: v }
				})
			}} />

		<Input placeholder="職員編號 (1位至6位數字)"
			type="number"
			minLength={1}
			maxLength={6}
			value={userPreference?.driverInfo?.staffNo}
			defaultValue={userPreference?.driverInfo?.staffNo}
			onInput={e => e.target.value = Math.abs(e.target.value.slice(0, 6))}
			onChange={v => {
				if (v == "") v = "1933"
				dispatchUserPreference({
					type: "SET_DRIVER_INFO",
					payload: { staffNo: v }
				})
			}} />
	</>)
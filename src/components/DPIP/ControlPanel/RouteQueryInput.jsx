import "@css/asyncSelect.css"

import React from "react"
import { useCallback, useMemo, useState } from "react"
import AsyncSelect from 'react-select/async'
import { components } from 'react-select'

import { useSelector, useDispatch } from 'react-redux'
import { selectRouteThunk } from "@store/routeSelectionSlice"
import { getRouteTypeStyle } from "@utils"

const separator = '｜'
const specialTripKey = "＊ 特別班"

const styles = {
    specialTripLabel: {
        marginLeft: "6px",
        padding: "2px",
        border: "1px solid rgba(255, 214, 0, 0.85)",
        borderRadius: "2px",
        backgroundColor: "rgba(255, 214, 0, 0.85)",
        color: "#000"
    }
}

// Function to create async-select data structure from routes array for drop down option 
const toRouteOption = route => ({
    label: `${route.route}${separator} ${route.orig_tc} 往 ${route.dest_tc} ${separator}${route.service_type != 1 ? specialTripKey : ""}`,
    value: `${route.route}-${route.bound}-${route.service_type}`,
    detail: route,
})

const SpecialTripLabelRender = Component => {
    const Wrapped = props => {
        const { label } = props.data
        const [routeLabel, terminusLabel, specialTripLabel] = label.split(separator)
        const routeStyle = useMemo(() => getRouteTypeStyle(routeLabel), [routeLabel])
        return (
            <Component {...props}>
                <span style={routeStyle}>
                    {routeLabel}
                </span>
                {specialTripLabel?.includes(specialTripKey) && (
                    <span style={styles.specialTripLabel}>
                        {specialTripKey}
                    </span>
                )}
                {separator}
                {terminusLabel}
                {separator}
            </Component>
        )
    }
    Wrapped.displayName = `SpecialTripLabelRender(${Component.displayName || Component.name || "Component"})`
    return Wrapped
}

export const RouteQueryInput = () => {

    const dispatch = useDispatch()

    const routes = useSelector(state => state.routes)

    // States for keeping previous route query in async-select dropdown
    const [selectedOption, setSelectedOption] = useState(null)
    const [prevOptions, setPrevOptions] = useState([])

    // Create first 50 default routes dropdown for the input
    const defaultRouteOptions = useMemo(
        () => routes?.slice(0, 50)?.map(toRouteOption),
        [routes])

    //  Return async select dropdown options after promises fulfilled
    const searchRoute = useCallback((inputValue, callback) => {
        let filtered

        if (!inputValue) {
            filtered = routes.slice(0, 50)
        }
        else {
            const upperCaseInput = inputValue.toUpperCase()
            filtered = routes.filter(route => route.route.toUpperCase().startsWith(upperCaseInput))
        }

        const results = filtered.map(route => toRouteOption(route))

        setPrevOptions(results)
        callback(results)
    }, [routes])

    const selectRoute = (routeDetail) => {
        dispatch(selectRouteThunk({ routeDetail, routes }))
    }

    // Memoize the styled dropdown option to prevent unnecessary render
    const MemoizedOption = React.memo(SpecialTripLabelRender(components.Option))
    const MemoizedSingleValue = React.memo(SpecialTripLabelRender(components.SingleValue))

    return (
        <AsyncSelect
            components={{
                Option: MemoizedOption,
                SingleValue: MemoizedSingleValue
            }}
            classNamePrefix="routeInputSelect"
            menuPortalTarget={document.body}
            // menuPosition="fixed"
            // menuPlacement="auto"
            styles={{
                control: (base, state) => ({
                    ...base,
                    backgroundColor: "rgba(24, 27, 27, 0.5)",
                    color: "#fff",
                    borderColor: state.isFocused ? "#2563eb" : "#444",
                    boxShadow: state.isFocused ? "0 0 0 2px #2563eb" : base.boxShadow,
                    height: 42,
                }),
                menu: base => ({
                    ...base,
                    backgroundColor: "rgba(35, 39, 47, 0.85)",
                    color: "#fff",
                    zIndex: 9999,
                }),
                placeholder: (base) => ({
                    ...base,
                    color: "#777",
                    opacity: 1,
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused
                        ? "rgba(0, 15, 15, 1)"
                        : "rgba(20, 35, 40, 0.9)",
                    color: "#fff",
                }),
                input: (base) => ({
                    ...base,
                    color: "#fff",
                }),
                singleValue: (base) => ({
                    ...base,
                    color: "#fff",
                }),
                indicatorSeparator: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? "#2563eb" : "#444"
                }),
                dropdownIndicator: (base, state) => ({
                    ...base,
                    color: state.isFocused ? "#00194f" : "#444",
                    "&:hover": { color: "#999" },
                }),
                clearIndicator: (base, state) => ({
                    ...base,
                    color: state.isFocused ? "#2563eb" : "#444",
                    "&:hover": { color: "#999" },
                }),
            }}
            autoFocus
            isClearable
            cacheOptions
            defaultOptions={prevOptions.length == 0 ? defaultRouteOptions : prevOptions}
            placeholder="輸入九巴路線編號　Input KMB route"
            loadOptions={searchRoute}
            value={selectedOption}
            onChange={option => {
                selectRoute(option.detail)
                setSelectedOption(option)
            }}
        />
    )
}
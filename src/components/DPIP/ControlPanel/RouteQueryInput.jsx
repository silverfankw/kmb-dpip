import "@css/asyncSelect.css"

import React from "react"
import { useCallback, useMemo, useState } from "react"
import AsyncSelect from 'react-select/async'
import { components } from 'react-select'

import { useSelector, useDispatch } from 'react-redux'
import { selectRouteThunk } from "@store/routeSelectionSlice"
import { getRouteTypeStyle } from "@utils"

const itemSeparator = '｜'
const toSeparator = "往"

const specialTripKey = "特別班"

const styles = {
    // Wrapper for each dropdown option
    labelWrapper: {
        display: "flex",
        gap: "4px",
        alignItems: "center",
        fontSize: "18px",
        fontWeight: 500,
        minWidth: 0,
    },
    // Route label: column for Option, row for SingleValue
    getRouteLabelStyle: type => ({
        display: type === "Option" ? "inline-flex" : "flex",
        flexDirection: type === "Option" ? "column" : "row",
        gap: type === "Option" ? 0 : "4px",
        width: type === "Option" ? "52px" : "fit-content",
        alignItems: "center",
        justifyContent: "center",
        letterSpacing: "-0.25px",
        minWidth: "52px",
        position: "relative",
    }),
    // Special trip label
    specialTripLabel: {
        marginTop: "2px",
        fontSize: "12px",
        padding: "2px 6px",
        border: "1px solid rgba(8, 28, 81, 1)",
        borderRadius: "4px",
        backgroundColor: "rgba(255, 214, 0, 0.75)",
        color: "#000",
        lineHeight: 1.1,
        maxWidth: "100%",
        textAlign: "center",
    },
    // Terminus label (origin/destination)
    terminusLabel: {
        display: "inline-flex",
        letterSpacing: "0.5px",
        alignItems: "center",
        gap: "10px",
        minWidth: 0,
        flex: 1,
    },
    // "往" label
    toLabel: {
        fontSize: "14px",
        fontWeight: 400,
    },
    // react-select sx overrides
    reactSelect: {
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
        placeholder: base => ({
            ...base,
            color: "#777",
            opacity: 1,
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused
                ? "rgba(0, 0, 0, 1)"
                : "rgba(32, 36, 38, 0.9)",
            color: "#fff",
        }),
        input: base => ({
            ...base,
            color: "#fff",
        }),
        singleValue: base => ({
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
    }
}

// Function to create async-select data structure from routes array for drop down option 
const toRouteOption = route => ({
    label: `${route.route}${itemSeparator} ${route.orig_tc} ${toSeparator} ${route.dest_tc} ${itemSeparator}${route.service_type != 1 ? specialTripKey : ""}`,
    value: `${route.route}-${route.bound}-${route.service_type}`,
    detail: route,
})

// Higher-order function to create styled route menu option component
const getStyledRouteMenuOption = (Component, type) => {
    const Wrapped = props => {

        const { label } = props.data

        const [routeLabel, terminusLabel, specialTripLabel] = label.split(itemSeparator)
        const routeStyle = useMemo(() => getRouteTypeStyle(routeLabel), [routeLabel])
        const [originLabel, destinationLabel] = terminusLabel.split(toSeparator)

        return (
            <Component {...props}>
                <div style={styles.labelWrapper}>

                    <div style={styles.getRouteLabelStyle(type)}>
                        <span style={routeStyle}>{routeLabel}</span>
                        {specialTripLabel?.includes(specialTripKey) && (
                            <span style={styles.specialTripLabel}>{specialTripKey}</span>
                        )}
                    </div>

                    <div style={styles.terminusLabel}>
                        {itemSeparator}
                        {originLabel}
                        <span style={styles.toLabel}>{toSeparator}</span>
                        {destinationLabel}
                        {itemSeparator}
                    </div>
                </div>
            </Component>
        )
    }
    Wrapped.displayName = `getStyledRouteMenuOption(${type})`
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
    const MemoizedOption = React.memo(getStyledRouteMenuOption(components.Option, "Option"))
    const MemoizedSingleValue = React.memo(getStyledRouteMenuOption(components.SingleValue, "SingleValue"))

    return (
        <AsyncSelect
            components={{
                Option: MemoizedOption,
                SingleValue: MemoizedSingleValue
            }}
            classNamePrefix="routeInputSelect"
            menuPortalTarget={document.body}
            styles={styles.reactSelect}
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
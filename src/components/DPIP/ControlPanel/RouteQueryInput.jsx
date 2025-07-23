import "@styles/asyncSelect.css"
import debounce from 'lodash/debounce'

import React from "react"
import { useCallback, useMemo, useState, useRef, useEffect } from "react"
import AsyncSelect from 'react-select/async'
import { components } from 'react-select'
import { ClipLoader } from "react-spinners"

import { useSelector, useDispatch } from 'react-redux'
import { selectRouteThunk } from "@store/routeSelectionSlice"
import { useWindowSize } from "@hooks"
import { RouteNumber, RouteDetails } from '@components'
import { itemSeparator, toSeparator, specialTripKey } from "@utils"

const createRouteLabel = (route) => {
    const specialTrip = route.service_type != 1 ? specialTripKey : ""
    const remark = route.specialRemark ?? ""

    return `${route.route}${itemSeparator} ${route.orig_tc} ${toSeparator} ${route.dest_tc} ${itemSeparator}${specialTrip}${itemSeparator}${remark}`
}

const createRouteOption = (route) => ({
    label: createRouteLabel(route),
    value: `${route.route}-${route.bound}-${route.service_type}`,
    detail: route,
})

const RouteOption = ({ componentType, data, ...props }) => {
    const { isMobile } = useWindowSize()
    const { label } = data
    const [routeLabel, terminusLabel, specialTripLabel, specialRemarkLabel = ''] = label.split(itemSeparator)
    const [originLabel, destinationLabel] = terminusLabel.split(toSeparator)

    const WrappedComponent = componentType === 'Option' ? components.Option : components.SingleValue

    const style = useMemo(() => ({
        display: "flex",
        gap: isMobile ? "2px" : "4px",
        alignItems: "center",
        fontSize: isMobile ? "14px" : "18px",
        fontWeight: 500,
        minWidth: 0,
    }), [isMobile])

    return (
        <WrappedComponent {...props} data={data}>
            <div style={style}>
                <RouteNumber
                    route={routeLabel}
                    isSpecial={specialTripLabel?.includes(specialTripKey)}
                    componentType={componentType}
                    isMobile={isMobile}
                />
                <RouteDetails
                    origin={originLabel}
                    destination={destinationLabel}
                    remark={specialRemarkLabel}
                />
            </div>
        </WrappedComponent >
    )
}

const MemoizedOption = React.memo(props => <RouteOption {...props} componentType="Option" />)
const MemoizedSingleValue = React.memo(props => <RouteOption {...props} componentType="SingleValue" />)

export const RouteQueryInput = () => {
    const { isMobile } = useWindowSize()
    const dispatch = useDispatch()
    const { routes } = useSelector(state => state.route)
    const { routeDetail } = useSelector(state => state.routeSelection)

    const [selectedOption, setSelectedOption] = useState(null)
    const [prevOptions, setPrevOptions] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const isRoutesLoading = !routes || routes.length === 0
    const searchCache = useRef(new Map())

    useEffect(() => {
        if (routeDetail && Object.keys(routeDetail).length > 0) {
            setSelectedOption(createRouteOption(routeDetail))
        }
    }, [routeDetail])

    const defaultOptions = useMemo(
        () => routes?.slice(0, 50)?.map(createRouteOption),
        [routes]
    )

    // Debounced search with caching
    const debouncedSearch = useMemo(
        () => debounce((inputValue, callback) => {
            const cacheKey = inputValue?.toUpperCase() || ''

            if (searchCache.current.has(cacheKey)) {
                const cachedResults = searchCache.current.get(cacheKey)
                setPrevOptions(cachedResults)
                callback(cachedResults)
                setIsSearching(false)
                return
            }

            setTimeout(() => {
                try {
                    const filtered = !inputValue
                        ? routes.slice(0, 50)
                        : routes.filter(route =>
                            route.route.toUpperCase().startsWith(cacheKey)
                        )

                    const results = filtered.slice(0, 50).map(route => createRouteOption(route, false))

                    searchCache.current.set(cacheKey, results)
                    setPrevOptions(results)
                    callback(results)
                    setIsSearching(false)
                } catch (error) {
                    console.error('Search error:', error)
                    setIsSearching(false)
                }
            }, 0)
        }, 150),
        [routes]
    )

    // Cleanup on unmount
    useEffect(() => {
        const cacheRef = searchCache.current
        return () => {
            debouncedSearch.cancel()
            cacheRef.clear()
        }
    }, [debouncedSearch])

    const handleSearch = useCallback((inputValue, callback) => {
        setIsSearching(true)
        debouncedSearch(inputValue, callback)
    }, [debouncedSearch])

    const handleSelect = useCallback((option) => {
        if (!option) {
            setSelectedOption(null)
            return
        }
        dispatch(selectRouteThunk({ routeDetail: option.detail, routes }))
        setSelectedOption(option)
    }, [dispatch, routes])

    const selectStyles = useMemo(() => ({
        control: (base, state) => ({
            ...base,
            backgroundColor: "rgba(24, 27, 27, 0.5)",
            color: "#fff",
            boxShadow: state.isFocused ? "0 0 0 2px #2563eb" : base.boxShadow,
            height: isMobile ? 36 : 42,
            minHeight: isMobile ? 36 : 42,
            border: `2px solid ${state.isFocused ? "#2563eb" : "#444"}`,
        }),
        menu: base => ({
            ...base,
            backgroundColor: "rgba(35, 39, 47, 0.85)",
            color: "#fff",
            zIndex: 9999,
            fontSize: isMobile ? "14px" : base.fontSize,
        }),
        menuList: base => ({
            ...base,
            maxHeight: isMobile ? "250px" : "500px",
            overflowY: "auto",
        }),
        placeholder: base => ({
            ...base,
            color: "#777",
            opacity: 1,
        }),
        option: (base, state) => ({
            ...base,
            border: `2px solid ${state.isFocused ? "#2563eb" : "transparent"}`,
            borderRadius: "6px",
            backgroundColor: state.isFocused ? "rgba(0, 0, 0, 1)" : "rgba(32, 36, 38, 0.9)",
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
            color: state.isFocused ? "#2563eb" : "#444",
            "&:hover": { color: "#444" },
        }),
        clearIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? "#2563eb" : "#444",
            "&:hover": { color: "#999" },
        }),
    }), [isMobile])

    return (
        <AsyncSelect
            components={{
                Option: MemoizedOption,
                SingleValue: MemoizedSingleValue
            }}
            classNamePrefix="routeInputSelect"
            menuPortalTarget={document.body}
            styles={selectStyles}
            isDisabled={isRoutesLoading}
            isClearable
            cacheOptions
            defaultOptions={prevOptions.length ? prevOptions : defaultOptions}
            placeholder={isRoutesLoading ?
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    zIndex: 10
                }}>
                    <ClipLoader color="#2563eb" size={25} />
                    <span>正在同步路線數據...</span>
                </div> : "輸入九巴路線編號　Input KMB route."}
            loadingMessage={() => "搜尋路線中..."}
            isLoading={isSearching}
            filterOption={null}
            loadOptions={handleSearch}
            value={selectedOption}
            onChange={handleSelect}
        />
    )
}
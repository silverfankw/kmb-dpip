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
            boxShadow: state.isFocused ? "0 0 0 2px #2563eb" : "none",
            height: isMobile ? 36 : 42,
            minHeight: isMobile ? 36 : 42,
            border: `2px solid ${state.isFocused ? "#2563eb" : "#444"}`,
            borderRadius: "8px",
            transition: "all 0.2s ease",
            "&:hover": {
                border: "2px solid rgba(37, 99, 235, 0.5)",
            }
        }),
        menu: base => ({
            ...base,
            backgroundColor: "rgba(23, 25, 28, 0.95)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(37, 99, 235, 0.2)",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            color: "#fff",
            zIndex: 9999,
            fontSize: isMobile ? "14px" : base.fontSize,
            overflow: "hidden",
            transition: "all 0.2s ease",
            width: "100%",
        }),
        menuList: base => ({
            ...base,
            maxHeight: isMobile ? "250px" : "500px",
            overflowX: "hidden",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
                width: "8px",
            },
            "&::-webkit-scrollbar-track": {
                background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
                background: "#444",
                borderRadius: "4px",
                "&:hover": {
                    background: "#555",
                },
            },
        }),
        option: (base, state) => ({
            ...base,
            position: "relative",
            border: state.isSelected
                ? "2px solid #3b82f6"
                : state.isFocused
                    ? "2px solid rgba(59, 130, 246, 0.5)"
                    : "2px solid transparent",
            borderRadius: "8px",
            backgroundColor: state.isSelected
                ? "rgba(59, 130, 246, 0.3)"
                : state.isFocused
                    ? "rgba(17, 24, 39, 0.95)"
                    : "transparent",
            color: state.isSelected ? "#fff" : "#e5e7eb",
            cursor: "pointer",
            margin: "4px",
            padding: "8px 12px",
            width: "auto",
            whiteSpace: "normal",
            wordWrap: "break-word",
            transition: "all 0.2s ease",
            "&:hover": {
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                border: "2px solid rgba(59, 130, 246, 0.6)",
                transform: "translateX(4px)",
            },
            "&:active": {
                backgroundColor: "rgba(59, 130, 246, 0.25)",
                transform: "translateX(2px)",
            }
        }),
        input: base => ({
            ...base,
            color: "#fff",
            margin: "0 2px",
        }),
        placeholder: base => ({
            ...base,
            color: "#777",
            opacity: 1,
        }),
        singleValue: base => ({
            ...base,
            color: "#fff",
            margin: "0 2px",
        }),
        valueContainer: base => ({
            ...base,
            padding: "2px 8px",
        }),
        indicatorsContainer: base => ({
            ...base,
            "> div": {
                padding: "6px",
            },
        }),
        indicatorSeparator: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#2563eb" : "#444",
            margin: "4px 0",
            width: "2px",
            transition: "all 0.2s ease",
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? "#2563eb" : "#444",
            padding: "6px",
            transition: "all 0.2s ease",
            "&:hover": {
                color: "#2563eb",
            },
        }),
        clearIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? "#2563eb" : "#444",
            padding: "6px",
            transition: "all 0.2s ease",
            "&:hover": {
                color: "#2563eb",
            },
        }),
        noOptionsMessage: base => ({
            ...base,
            color: "#777",
            textAlign: "center",
            padding: "12px",
        }),
        loadingMessage: base => ({
            ...base,
            color: "#777",
            textAlign: "center",
            padding: "12px",
        }),
        multiValue: base => ({
            ...base,
            backgroundColor: "rgba(37, 99, 235, 0.15)",
            borderRadius: "4px",
        }),
        multiValueLabel: base => ({
            ...base,
            color: "#fff",
        }),
        multiValueRemove: base => ({
            ...base,
            color: "#777",
            "&:hover": {
                backgroundColor: "rgba(37, 99, 235, 0.3)",
                color: "#fff",
            },
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
import "@styles/asyncSelect.css"
import debounce from 'lodash/debounce'
import SearchIcon from '@mui/icons-material/Search'

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
        fontWeight: 600,
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

    const Control = useCallback((props) => (
        <components.Control {...props}>
            <SearchIcon
                sx={{
                    color: props.isFocused ? "#67e8f9" : "#8fdcff",
                    fontSize: isMobile ? 20 : 24,
                    marginLeft: isMobile ? "10px" : "14px",
                    marginRight: isMobile ? "6px" : "8px",
                    flexShrink: 0,
                }}
            />
            {props.children}
        </components.Control>
    ), [isMobile])

    const selectStyles = useMemo(() => ({
        control: (base, state) => ({
            ...base,
            background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.72))",
            color: "#fff",
            boxShadow: state.isFocused
                ? "0 0 0 2px rgba(34, 211, 238, 0.28), 0 16px 40px rgba(8, 47, 73, 0.35)"
                : "0 14px 34px rgba(2, 6, 23, 0.24)",
            height: isMobile ? 46 : 60,
            minHeight: isMobile ? 46 : 60,
            border: `1px solid ${state.isFocused ? "rgba(34, 211, 238, 0.55)" : "rgba(148, 163, 184, 0.2)"}`,
            borderRadius: "20px",
            transition: "all 0.24s ease",
            "&:hover": {
                border: "1px solid rgba(34, 211, 238, 0.4)",
            }
        }),
        menu: base => ({
            ...base,
            backgroundColor: "rgba(8, 15, 32, 0.96)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(148, 163, 184, 0.16)",
            borderRadius: "20px",
            boxShadow: "0 22px 50px rgba(2, 6, 23, 0.48)",
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
            padding: "8px",
            "&::-webkit-scrollbar": {
                width: "8px",
            },
            "&::-webkit-scrollbar-track": {
                background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
                background: "rgba(148, 163, 184, 0.35)",
                borderRadius: "4px",
                "&:hover": {
                    background: "rgba(148, 163, 184, 0.5)",
                },
            },
        }),
        option: (base, state) => ({
            ...base,
            position: "relative",
            border: state.isSelected
                ? "1px solid rgba(56, 189, 248, 0.55)"
                : state.isFocused
                    ? "1px solid rgba(56, 189, 248, 0.35)"
                    : "1px solid transparent",
            borderRadius: "16px",
            backgroundColor: state.isSelected
                ? "rgba(14, 165, 233, 0.2)"
                : state.isFocused
                    ? "rgba(15, 23, 42, 0.92)"
                    : "transparent",
            color: state.isSelected ? "#f8fafc" : "#e2e8f0",
            cursor: "pointer",
            margin: 0,
            padding: "10px 12px",
            width: "auto",
            whiteSpace: "normal",
            wordWrap: "break-word",
            transition: "all 0.2s ease",
            "&:hover": {
                backgroundColor: "rgba(14, 165, 233, 0.14)",
                border: "1px solid rgba(56, 189, 248, 0.45)",
                transform: "translateX(2px)",
            },
            "&:active": {
                backgroundColor: "rgba(14, 165, 233, 0.22)",
            }
        }),
        input: base => ({
            ...base,
            color: "#fff",
            margin: isMobile ? "0 2px" : "0 4px",
        }),
        placeholder: base => ({
            ...base,
            color: "rgba(203, 213, 225, 0.72)",
            opacity: 1,
        }),
        singleValue: base => ({
            ...base,
            color: "#fff",
            margin: isMobile ? "0 2px" : "0 4px",
        }),
        valueContainer: base => ({
            ...base,
            padding: isMobile ? "1px 8px 1px 2px" : "2px 12px 2px 4px",
        }),
        indicatorsContainer: base => ({
            ...base,
            "> div": {
                padding: isMobile ? "4px" : "6px",
            },
        }),
        indicatorSeparator: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "rgba(34, 211, 238, 0.55)" : "rgba(148, 163, 184, 0.24)",
            margin: "8px 0",
            width: "1px",
            transition: "all 0.2s ease",
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? "#67e8f9" : "#94a3b8",
            padding: "6px",
            transition: "all 0.2s ease",
            "&:hover": {
                color: "#67e8f9",
            },
        }),
        clearIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? "#67e8f9" : "#94a3b8",
            padding: "6px",
            transition: "all 0.2s ease",
            "&:hover": {
                color: "#67e8f9",
            },
        }),
        noOptionsMessage: base => ({
            ...base,
            color: "rgba(203, 213, 225, 0.72)",
            textAlign: "center",
            padding: "12px",
        }),
        loadingMessage: base => ({
            ...base,
            color: "rgba(203, 213, 225, 0.72)",
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
                Control,
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
                    gap: isMobile ? ".5rem" : "1rem",
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
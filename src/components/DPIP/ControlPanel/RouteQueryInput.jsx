import "@styles/asyncSelect.css"
import debounce from 'lodash/debounce'

import React from "react"
import { useCallback, useMemo, useState, useRef, useEffect } from "react"
import AsyncSelect from 'react-select/async'
import { components } from 'react-select'

import { useSelector, useDispatch } from 'react-redux'
import { selectRouteThunk } from "@store/routeSelectionSlice"
import { useWindowSize } from "@hooks"
import { RouteNumber, RouteDetails } from '@components'
import { itemSeparator, toSeparator, specialTripKey } from "@utils"

const styles = {
    labelWrapper: {
        display: "flex",
        gap: "1.5px",
        alignItems: "center",
        fontSize: window.innerWidth <= 768 ? "14px" : "18px",
        fontWeight: 500,
        minWidth: 0,
    },
    // react-select sx overrides
    reactSelect: {
        control: (base, state) => ({
            ...base,
            backgroundColor: "rgba(24, 27, 27, 0.5)",
            color: "#fff",
            borderColor: state.isFocused ? "#2563eb" : "#444",
            boxShadow: state.isFocused ? "0 0 0 2px #2563eb" : base.boxShadow,
            height: window.innerWidth <= 768 ? 36 : 42,
            minHeight: window.innerWidth <= 768 ? 36 : 42,
        }),
        menu: base => ({
            ...base,
            backgroundColor: "rgba(35, 39, 47, 0.85)",
            color: "#fff",
            zIndex: 9999,
            fontSize: window.innerWidth <= 768 ? "14px" : base.fontSize,
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
    label: `${route.route}${itemSeparator} ${route.orig_tc} ${toSeparator} ${route.dest_tc} ${itemSeparator}${route.service_type != 1 ? specialTripKey : ""}${itemSeparator}${route.specialRemark ?? ""}`,
    value: `${route.route}-${route.bound}-${route.service_type}`,
    detail: route,
})

const StyledRouteOption = ({ componentType, data, ...props }) => {
    const { isMobile } = useWindowSize()

    const { label } = data
    const [routeLabel, terminusLabel, specialTripLabel, specialRemarkLabel = ''] = label.split(itemSeparator)
    const [originLabel, destinationLabel] = terminusLabel.split(toSeparator)

    const WrappedComponent = componentType === 'Option' ? components.Option : components.SingleValue

    const responsiveStyle = useMemo(() => ({
        ...styles.labelWrapper,
        fontSize: isMobile ? "14px" : "18px",
        gap: isMobile ? "2px" : "4px"
    }), [isMobile])

    return (
        <WrappedComponent {...props} data={data}>
            <div style={responsiveStyle}>
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
        </WrappedComponent>
    )
}

const MemoizedOption = React.memo(props => <StyledRouteOption {...props} componentType="Option" />)
MemoizedOption.displayName = 'MemoizedOption'

const MemoizedSingleValue = React.memo(props => <StyledRouteOption {...props} componentType="SingleValue" />)
MemoizedSingleValue.displayName = 'MemoizedSingleValue'

export const RouteQueryInput = () => {
    const { isMobile } = useWindowSize()

    const dispatch = useDispatch()
    const { routes } = useSelector(state => state.route)

    const [selectedOption, setSelectedOption] = useState(null)
    const [prevOptions, setPrevOptions] = useState([])

    const defaultOptions = useMemo(
        () => routes?.slice(0, 50)?.map(toRouteOption),
        [routes]
    )

    const searchCache = useRef(new Map())
    const [isSearching, setIsSearching] = useState(false)

    // Memoize the search function with debounce
    const debouncedSearch = useMemo(
        () => debounce((inputValue, callback) => {
            const cacheKey = inputValue?.toUpperCase() || ''

            // Check cache first
            if (searchCache.current.has(cacheKey)) {
                const cachedResults = searchCache.current.get(cacheKey)
                setPrevOptions(cachedResults)
                callback(cachedResults)
                setIsSearching(false)
                return
            }

            // Use setTimeout to move filtering to next tick
            setTimeout(() => {
                try {
                    // Filter routes
                    const filtered = !inputValue
                        ? routes.slice(0, 50)
                        : routes.filter(route =>
                            route.route.toUpperCase().startsWith(cacheKey)
                        )

                    // Process results in chunks of 50
                    const processChunk = (start = 0) => {
                        const chunk = filtered.slice(start, start + 50)
                        const results = chunk.map(toRouteOption)

                        if (start === 0) {
                            // Cache and update UI with first chunk immediately
                            searchCache.current.set(cacheKey, results)
                            setPrevOptions(results)
                            callback(results)
                            setIsSearching(false)
                        }
                    }

                    processChunk(0)
                } catch (error) {
                    console.error('Search error:', error)
                    setIsSearching(false)
                }
            }, 0)
        }, 150),
        [routes]
    )

    // Clean up on unmount
    useEffect(() => {
        return () => {
            debouncedSearch.cancel()
            // eslint-disable-next-line react-hooks/exhaustive-deps
            searchCache.current.clear()
        }
    }, [debouncedSearch])

    const handleSearch = useCallback((inputValue, callback) => {
        setIsSearching(true)
        debouncedSearch(inputValue, callback)
    }, [debouncedSearch])

    const handleSelect = useCallback((option) => {
        // Return when user clears selection
        if (!option) return

        dispatch(selectRouteThunk({ routeDetail: option.detail, routes }))
        setSelectedOption(option)
    }, [dispatch, routes])

    const responsiveStyles = useMemo(() => ({
        ...styles.reactSelect,
        control: (base, state) => ({
            ...base,
            backgroundColor: "rgba(24, 27, 27, 0.5)",
            color: "#fff",
            borderColor: state.isFocused ? "#2563eb" : "#444",
            boxShadow: state.isFocused ? "0 0 0 2px #2563eb" : base.boxShadow,
            height: isMobile ? 36 : 42,
            minHeight: isMobile ? 36 : 42,
        }),
        menu: base => ({
            ...base,
            backgroundColor: "rgba(35, 39, 47, 0.85)",
            color: "#fff",
            zIndex: 9999,
            fontSize: isMobile ? "14px" : base.fontSize,
        })
    }), [isMobile])

    return (
        <AsyncSelect
            components={{
                Option: MemoizedOption,
                SingleValue: MemoizedSingleValue
            }}
            classNamePrefix="routeInputSelect"
            menuPortalTarget={document.body}
            styles={responsiveStyles}
            autoFocus
            isClearable
            cacheOptions
            defaultOptions={prevOptions.length ? prevOptions : defaultOptions}
            placeholder="輸入九巴路線編號　Input KMB route."
            loadingMessage={() => "搜尋路線中..."}
            isLoading={isSearching}
            filterOption={null}
            loadOptions={handleSearch}
            value={selectedOption}
            onChange={handleSelect}
        />
    )
}
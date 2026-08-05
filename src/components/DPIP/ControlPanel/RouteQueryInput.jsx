import "@styles/asyncSelect.css"
import SearchIcon from '@mui/icons-material/Search'

import { useCallback, useMemo, useState, useRef, useEffect } from "react"
import AsyncSelect from 'react-select/async'
import { components } from 'react-select'
import { ClipLoader } from "react-spinners"

import { useSelector, useDispatch } from 'react-redux'
import { fetchRouteStops } from "@api/kmb"
import { selectRouteThunk } from "@store/routeSelectionSlice"
import { ensureRouteRemarkThunk } from "@store/routeSlice"
import { useWindowSize, useRouteTypeStyle } from "@hooks"
import { RouteNumber, RouteDetails } from '@components'
import { createRouteOption } from "@utils"

const RouteOptionContent = ({ componentType, data, compact = false, isMobile, getRouteStyle, ...props }) => {
    const {
        routeLabel,
        originLabel,
        destinationLabel,
        specialRemarkLabel = '',
        isSpecial
    } = data

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
                    isSpecial={isSpecial}
                    componentType={componentType}
                    isMobile={isMobile}
                    getRouteStyle={getRouteStyle}
                />
                {!(componentType === 'SingleValue' && compact) && (
                    <RouteDetails
                        origin={originLabel}
                        destination={destinationLabel}
                        remark={specialRemarkLabel}
                        isMobile={isMobile}
                    />
                )}
            </div>
        </WrappedComponent >
    )
}

export const RouteQueryInput = ({ compact = false, label = '', labelClassName = '' }) => {
    const { isMobile } = useWindowSize()
    const getRouteStyle = useRouteTypeStyle()
    const dispatch = useDispatch()
    const { routes } = useSelector(state => state.route)
    const { routeDetail } = useSelector(state => state.routeSelection)
    const { uiMode } = useSelector(state => state.userPreference)
    const isLightMode = uiMode === "light"

    const [selectedOption, setSelectedOption] = useState(null)
    const isRoutesLoading = !routes || routes.length === 0
    const prefetchedRouteKeys = useRef(new Set())
    const prefetchedRouteRemarkKeys = useRef(new Set())

    useEffect(() => {
        if (routeDetail && Object.keys(routeDetail).length > 0) {
            setSelectedOption(createRouteOption(routeDetail))
        }
    }, [routeDetail])

    const routeOptions = useMemo(
        () => routes?.map(createRouteOption) ?? [],
        [routes]
    )

    const searchIndex = useMemo(() => {
        const index = new Map([['', routeOptions.slice(0, 50)]])

        routeOptions.forEach(option => {
            const routeNumber = option.detail.route.toUpperCase()

            for (let i = 1; i <= routeNumber.length; i += 1) {
                const prefix = routeNumber.slice(0, i)
                const results = index.get(prefix) ?? []

                if (results.length < 50) {
                    results.push(option)
                    index.set(prefix, results)
                }
            }
        })

        return index
    }, [routeOptions])

    const defaultOptions = useMemo(
        () => searchIndex.get('') ?? [],
        [searchIndex]
    )

    const prefetchSearchResults = useCallback((inputValue, results) => {
        const normalizedInput = inputValue.trim().toUpperCase()

        if (normalizedInput.length < 2 || results.length === 0) {
            return
        }

        results.slice(0, 4).forEach(({ detail }) => {
            const routeKey = `${detail.route}-${detail.bound}-${detail.service_type}`

            if (prefetchedRouteKeys.current.has(routeKey)) {
                return
            }

            prefetchedRouteKeys.current.add(routeKey)
            void fetchRouteStops(detail.route, detail.bound, detail.service_type).catch(error => {
                prefetchedRouteKeys.current.delete(routeKey)
                console.error(`Error prefetching stops for route ${routeKey}:`, error)
            })

            if (detail.service_type !== "1" && !detail.specialRemark && !prefetchedRouteRemarkKeys.current.has(routeKey)) {
                prefetchedRouteRemarkKeys.current.add(routeKey)
                void dispatch(ensureRouteRemarkThunk(detail))
            }
        })
    }, [dispatch])

    const handleSearch = useCallback((inputValue, callback) => {
        const normalizedInput = inputValue.trim().toUpperCase()
        const results = searchIndex.get(normalizedInput) ?? []

        callback(results)
        prefetchSearchResults(inputValue, results)
    }, [prefetchSearchResults, searchIndex])

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
                    color: props.isFocused
                        ? (isLightMode ? "#0284c7" : "#67e8f9")
                        : (isLightMode ? "#64748b" : "#8fdcff"),
                    fontSize: isMobile ? 20 : 24,
                    marginLeft: isMobile ? "10px" : "14px",
                    marginRight: isMobile ? "6px" : "8px",
                    flexShrink: 0,
                }}
            />
            {label && (
                <span
                    className={labelClassName}
                    style={{
                        marginRight: isMobile ? "6px" : "8px",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                    }}
                >
                    {label}
                </span>
            )}
            {props.children}
        </components.Control>
    ), [isLightMode, isMobile, label, labelClassName])

    const Option = useCallback(
        props => (
            <RouteOptionContent
                {...props}
                componentType="Option"
                isMobile={isMobile}
                getRouteStyle={getRouteStyle}
            />
        ),
        [getRouteStyle, isMobile]
    )

    const SingleValue = useCallback(
        props => (
            <RouteOptionContent
                {...props}
                componentType="SingleValue"
                compact={compact}
                isMobile={isMobile}
                getRouteStyle={getRouteStyle}
            />
        ),
        [compact, getRouteStyle, isMobile]
    )

    const selectStyles = useMemo(() => ({
        control: (base, state) => ({
            ...base,
            background: isLightMode
                ? "linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.96))"
                : "linear-gradient(135deg, rgba(30, 41, 59, 0.90), rgba(51, 65, 85, 0.80))",
            color: isLightMode ? "#0f172a" : "#fff",
            boxShadow: state.isFocused
                ? (isLightMode
                    ? "0 0 0 2px rgba(14, 165, 233, 0.2), 0 16px 36px rgba(148, 163, 184, 0.22)"
                    : "0 0 0 2px rgba(56, 189, 248, 0.22), 0 12px 28px rgba(15, 23, 42, 0.22)")
                : (isLightMode
                    ? "0 12px 28px rgba(148, 163, 184, 0.18)"
                    : "0 10px 24px rgba(15, 23, 42, 0.18)"),
            height: isMobile ? 46 : 60,
            minHeight: isMobile ? 46 : 60,
            border: `1px solid ${state.isFocused
                ? (isLightMode ? "rgba(14, 165, 233, 0.45)" : "rgba(56, 189, 248, 0.42)")
                : (isLightMode ? "rgba(148, 163, 184, 0.45)" : "rgba(148, 163, 184, 0.34)")}`,
            borderRadius: "20px",
            transition: "border-color 0.18s ease, box-shadow 0.18s ease",
            "&:hover": {
                border: `1px solid ${isLightMode ? "rgba(14, 165, 233, 0.35)" : "rgba(34, 211, 238, 0.4)"}`,
            }
        }),
        menu: base => ({
            ...base,
            backgroundColor: isLightMode ? "rgba(255, 255, 255, 0.995)" : "rgba(30, 41, 59, 0.96)",
            backdropFilter: "blur(18px)",
            border: `1px solid ${isLightMode ? "rgba(203, 213, 225, 0.95)" : "rgba(148, 163, 184, 0.22)"}`,
            borderRadius: "20px",
            boxShadow: isLightMode ? "0 22px 50px rgba(148, 163, 184, 0.28)" : "0 18px 36px rgba(15, 23, 42, 0.28)",
            color: isLightMode ? "#0f172a" : "#fff",
            zIndex: 99999,
            fontSize: isMobile ? "14px" : base.fontSize,
            overflow: "hidden",
            transition: "none",
            width: "100%",
        }),
        menuPortal: base => ({
            ...base,
            zIndex: 99999,
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
                ? `1px solid ${isLightMode ? "rgba(14, 165, 233, 0.45)" : "rgba(56, 189, 248, 0.55)"}`
                : state.isFocused
                    ? `1px solid ${isLightMode ? "rgba(14, 165, 233, 0.28)" : "rgba(56, 189, 248, 0.35)"}`
                    : "1px solid transparent",
            borderRadius: "16px",
            backgroundColor: state.isSelected
                ? (isLightMode ? "rgba(14, 165, 233, 0.12)" : "rgba(14, 165, 233, 0.2)")
                : state.isFocused
                    ? (isLightMode ? "rgba(248, 250, 252, 0.96)" : "rgba(15, 23, 42, 0.92)")
                    : "transparent",
            color: isLightMode ? "#0f172a" : (state.isSelected ? "#f8fafc" : "#e2e8f0"),
            cursor: "pointer",
            margin: 0,
            padding: "10px 12px",
            width: "auto",
            whiteSpace: "normal",
            wordWrap: "break-word",
            transition: "none",
            "&:hover": {
                backgroundColor: isLightMode ? "rgba(186, 230, 253, 0.28)" : "rgba(14, 165, 233, 0.14)",
                border: `1px solid ${isLightMode ? "rgba(14, 165, 233, 0.4)" : "rgba(56, 189, 248, 0.45)"}`,
                transform: "translateX(2px)",
            },
            "&:active": {
                backgroundColor: isLightMode ? "rgba(186, 230, 253, 0.38)" : "rgba(14, 165, 233, 0.22)",
            }
        }),
        input: base => ({
            ...base,
            color: isLightMode ? "#0f172a" : "#fff",
            fontSize: isMobile ? "16px" : base.fontSize,
            margin: isMobile ? "0 2px" : "0 4px",
        }),
        placeholder: base => ({
            ...base,
            color: isLightMode ? "rgba(71, 85, 105, 0.78)" : "rgba(203, 213, 225, 0.72)",
            opacity: 1,
        }),
        singleValue: base => ({
            ...base,
            color: isLightMode ? "#0f172a" : "#fff",
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
            backgroundColor: state.isFocused
                ? (isLightMode ? "rgba(14, 165, 233, 0.45)" : "rgba(56, 189, 248, 0.42)")
                : (isLightMode ? "rgba(148, 163, 184, 0.45)" : "rgba(148, 163, 184, 0.24)"),
            margin: "8px 0",
            width: "1px",
            transition: "none",
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: state.isFocused
                ? (isLightMode ? "#0284c7" : "#67e8f9")
                : (isLightMode ? "#64748b" : "#94a3b8"),
            padding: "6px",
            transition: "none",
            "&:hover": {
                color: isLightMode ? "#0284c7" : "#67e8f9",
            },
        }),
        clearIndicator: (base, state) => ({
            ...base,
            color: state.isFocused
                ? (isLightMode ? "#0284c7" : "#67e8f9")
                : (isLightMode ? "#64748b" : "#94a3b8"),
            padding: "6px",
            transition: "none",
            "&:hover": {
                color: isLightMode ? "#0284c7" : "#67e8f9",
            },
        }),
        noOptionsMessage: base => ({
            ...base,
            color: isLightMode ? "rgba(71, 85, 105, 0.82)" : "rgba(203, 213, 225, 0.72)",
            textAlign: "center",
            padding: "12px",
        }),
        loadingMessage: base => ({
            ...base,
            color: isLightMode ? "rgba(71, 85, 105, 0.82)" : "rgba(203, 213, 225, 0.72)",
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
    }), [isLightMode, isMobile])

    return (
        <AsyncSelect
            components={{
                Control,
                Option,
                SingleValue
            }}
            classNamePrefix="routeInputSelect"
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={selectStyles}
            isDisabled={isRoutesLoading}
            isClearable
            cacheOptions
            defaultOptions={defaultOptions}
            placeholder={isRoutesLoading ?
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: isMobile ? ".5rem" : "1rem",
                    zIndex: 10
                }}>
                    <ClipLoader color="#2563eb" size={25} />
                    <span>{"\u6b63\u5728\u540c\u6b65\u8def\u7dda\u6578\u64da..."}</span>
                </div> : "\u8f38\u5165\u4e5d\u5df4\u8def\u7dda\u7de8\u865f\u3000Input KMB route."}
            loadingMessage={() => "\u641c\u5c0b\u8def\u7dda\u4e2d..."}
            isLoading={isRoutesLoading}
            filterOption={null}
            loadOptions={handleSearch}
            value={selectedOption}
            onChange={handleSelect}
        />
    )
}

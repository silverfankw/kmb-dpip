import "@styles/asyncSelect.css"
import SearchIcon from '@mui/icons-material/Search'

import { useCallback, useMemo, useState, useEffect } from "react"
import AsyncSelect from 'react-select/async'
import { components } from 'react-select'
import { ClipLoader } from "react-spinners"

import { useSelector, useDispatch } from 'react-redux'
import { selectRouteThunk } from "@store/routeSelectionSlice"
import { useWindowSize, useRouteTypeStyle } from "@hooks"
import { getAppTextConfig } from '@components/sharedComponentConfig'
import { RouteNumber, RouteDetails } from '@components'
import { createRouteOption } from "@utils"

const MAX_SEARCH_RESULTS = 50

const buildSearchIndex = (routeOptions) => {
    const index = new Map([['', routeOptions.slice(0, MAX_SEARCH_RESULTS)]])

    routeOptions.forEach((option) => {
        const routeNumber = option.detail.route.toUpperCase()

        for (let i = 1; i <= routeNumber.length; i += 1) {
            const prefix = routeNumber.slice(0, i)
            const results = index.get(prefix) ?? []

            if (results.length < MAX_SEARCH_RESULTS) {
                results.push(option)
                index.set(prefix, results)
            }
        }
    })

    return index
}

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
    const { uiMode, language } = useSelector(state => state.userPreference)
    const appText = getAppTextConfig(language)
    const isLightMode = uiMode === "light"

    const [selectedOption, setSelectedOption] = useState(null)
    const isRoutesLoading = !routes || routes.length === 0

    useEffect(() => {
        if (routeDetail && Object.keys(routeDetail).length > 0) {
            setSelectedOption(createRouteOption(routeDetail))
        }
    }, [routeDetail])

    const routeOptions = useMemo(
        () => routes?.map(createRouteOption) ?? [],
        [routes]
    )

    const searchIndex = useMemo(() => buildSearchIndex(routeOptions), [routeOptions])

    const defaultOptions = useMemo(() => {
        const selectedRouteKey = selectedOption?.detail?.route?.toUpperCase() ?? ''
        const preferredOptions = selectedRouteKey
            ? (searchIndex.get(selectedRouteKey) ?? [])
            : (searchIndex.get('') ?? [])

        if (!selectedOption) {
            return preferredOptions
        }

        const dedupedOptions = preferredOptions.filter(option => option.value !== selectedOption.value)
        return [selectedOption, ...dedupedOptions]
    }, [searchIndex, selectedOption])

    const handleSearch = useCallback((inputValue, callback) => {
        const normalizedInput = inputValue.trim().toUpperCase()
        const results = searchIndex.get(normalizedInput) ?? []

        if (!normalizedInput) {
            callback(defaultOptions)
            return
        }

        callback(results)
    }, [defaultOptions, searchIndex])

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
                ? "linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(248, 250, 252, 0.94))"
                : "linear-gradient(180deg, rgba(15, 23, 42, 0.72), rgba(30, 41, 59, 0.78))",
            color: isLightMode ? "#0f172a" : "#f8fafc",
            boxShadow: state.isFocused
                ? (isLightMode
                    ? "0 0 0 2px rgba(14, 165, 233, 0.12), 0 8px 18px rgba(148, 163, 184, 0.12)"
                    : "0 0 0 2px rgba(56, 189, 248, 0.12), 0 10px 18px rgba(15, 23, 42, 0.2)")
                : (isLightMode
                    ? "0 6px 16px rgba(148, 163, 184, 0.08)"
                    : "0 8px 18px rgba(15, 23, 42, 0.12)"),
            height: isMobile ? 42 : 48,
            minHeight: isMobile ? 42 : 48,
            border: `1px solid ${state.isFocused
                ? (isLightMode ? "rgba(14, 165, 233, 0.18)" : "rgba(34, 211, 238, 0.18)")
                : (isLightMode ? "rgba(148, 163, 184, 0.2)" : "rgba(148, 163, 184, 0.12)")}`,
            borderRadius: "12px",
            transition: "all 0.18s ease",
            paddingLeft: isMobile ? "2px" : "4px",
            "&:hover": {
                border: `1px solid ${isLightMode ? "rgba(148, 163, 184, 0.34)" : "rgba(148, 163, 184, 0.24)"}`,
                boxShadow: isLightMode
                    ? "0 8px 18px rgba(148, 163, 184, 0.1)"
                    : "0 10px 18px rgba(15, 23, 42, 0.14)",
            }
        }),
        menu: base => ({
            ...base,
            background: isLightMode
                ? "linear-gradient(180deg, rgba(255,255,255,0.97), rgba(248,250,252,0.94))"
                : "linear-gradient(180deg, rgba(15,23,42,0.86), rgba(15,23,42,0.92))",
            backdropFilter: "blur(14px)",
            border: `1px solid ${isLightMode ? "rgba(203, 213, 225, 0.82)" : "rgba(148, 163, 184, 0.18)"}`,
            borderRadius: "14px",
            boxShadow: isLightMode ? "0 12px 24px rgba(148, 163, 184, 0.12)" : "0 18px 32px rgba(2, 6, 23, 0.28)",
            color: isLightMode ? "#0f172a" : "#f8fafc",
            zIndex: 99999,
            fontSize: isMobile ? "14px" : base.fontSize,
            overflow: "hidden",
            width: "100%",
        }),
        menuPortal: base => ({
            ...base,
            zIndex: 99999,
        }),
        menuList: base => ({
            ...base,
            maxHeight: isMobile ? "220px" : "420px",
            overflowX: "hidden",
            overflowY: "auto",
            padding: "5px",
            "&::-webkit-scrollbar": {
                width: "8px",
            },
            "&::-webkit-scrollbar-track": {
                background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
                background: "rgba(148, 163, 184, 0.35)",
                borderRadius: "999px",
                "&:hover": {
                    background: "rgba(148, 163, 184, 0.5)",
                },
            },
        }),
        option: (base, state) => ({
            ...base,
            position: "relative",
            border: state.isSelected
                ? `1px solid ${isLightMode ? "rgba(14, 165, 233, 0.52)" : "rgba(96, 165, 250, 0.56)"}`
                : state.isFocused
                    ? `1px solid ${isLightMode ? "rgba(148, 163, 184, 0.2)" : "rgba(148, 163, 184, 0.14)"}`
                    : "1px solid transparent",
            borderRadius: "10px",
            backgroundColor: state.isSelected
                ? (isLightMode ? "linear-gradient(135deg, rgba(224, 242, 254, 0.92), rgba(191, 219, 254, 0.78))" : "linear-gradient(135deg, rgba(30, 64, 175, 0.18), rgba(14, 116, 144, 0.2))")
                : state.isFocused
                    ? (isLightMode ? "rgba(248, 250, 252, 0.94)" : "rgba(30, 41, 59, 0.8)")
                    : "transparent",
            color: isLightMode ? "#0f172a" : (state.isSelected ? "#e0f2fe" : "#e2e8f0"),
            cursor: "pointer",
            margin: "1px 0",
            padding: "8px 10px",
            width: "auto",
            whiteSpace: "normal",
            wordWrap: "break-word",
            transition: "background-color 0.18s ease, border-color 0.18s ease",
            "&:hover": {
                backgroundColor: isLightMode ? "rgba(186, 230, 253, 0.44)" : "rgba(59, 130, 246, 0.12)",
                border: `1px solid ${isLightMode ? "rgba(14, 165, 233, 0.36)" : "rgba(96, 165, 250, 0.28)"}`,
            },
            "&:active": {
                backgroundColor: isLightMode ? "rgba(186, 230, 253, 0.58)" : "rgba(59, 130, 246, 0.16)",
            }
        }),
        input: base => ({
            ...base,
            color: isLightMode ? "#0f172a" : "#f8fafc",
            fontSize: isMobile ? "15px" : base.fontSize,
            margin: isMobile ? "0 2px" : "0 4px",
            fontWeight: 500,
        }),
        placeholder: base => ({
            ...base,
            color: isLightMode ? "rgba(71, 85, 105, 0.72)" : "rgba(203, 213, 225, 0.7)",
            opacity: 1,
            fontWeight: 500,
        }),
        singleValue: base => ({
            ...base,
            color: isLightMode ? "#0f172a" : "#f8fafc",
            margin: isMobile ? "0 2px" : "0 4px",
            fontWeight: 500,
        }),
        valueContainer: base => ({
            ...base,
            padding: isMobile ? "1px 8px 1px 2px" : "2px 12px 2px 4px",
            gap: "2px",
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
                : (isLightMode ? "rgba(148, 163, 184, 0.38)" : "rgba(148, 163, 184, 0.18)"),
            margin: "8px 0",
            width: "1px",
            transition: "background-color 0.18s ease",
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: state.isFocused
                ? (isLightMode ? "#0284c7" : "#67e8f9")
                : (isLightMode ? "#64748b" : "#94a3b8"),
            padding: "6px",
            transition: "color 0.18s ease",
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
            transition: "color 0.18s ease",
            "&:hover": {
                color: isLightMode ? "#0284c7" : "#67e8f9",
            },
        }),
        noOptionsMessage: base => ({
            ...base,
            color: isLightMode ? "rgba(71, 85, 105, 0.82)" : "rgba(203, 213, 225, 0.72)",
            textAlign: "center",
            padding: "12px",
            fontWeight: 500,
        }),
        loadingMessage: base => ({
            ...base,
            color: isLightMode ? "rgba(71, 85, 105, 0.82)" : "rgba(203, 213, 225, 0.72)",
            textAlign: "center",
            padding: "12px",
            fontWeight: 500,
        }),
        multiValue: base => ({
            ...base,
            backgroundColor: "rgba(37, 99, 235, 0.15)",
            borderRadius: "6px",
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
                </div> : "\u8f38\u5165\u4e5d\u5df4\u8def\u7dda\u7de8\u865f\u3000Input KMB route"}
            loadingMessage={() => "\u641c\u5c0b\u8def\u7dda\u4e2d..."}
            isLoading={isRoutesLoading}
            filterOption={null}
            loadOptions={handleSearch}
            value={selectedOption}
            onChange={handleSelect}
        />
    )
}

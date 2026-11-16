import "@styles/routeSearch/asyncSelect.css"
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

import { memo, useCallback, useId, useMemo, useRef, useState, useEffect } from "react"
import AsyncSelect from 'react-select/async'
import { components } from 'react-select'

import { shallowEqual, useSelector, useDispatch } from 'react-redux'
import { selectRouteThunk } from "@store/routeSelectionSlice"
import { useWindowSize, useRouteTypeStyle } from "@hooks"
import { RouteNumber, RouteDetails, RouteSearchKeypad } from '@components'
import { createRouteOption, buildRouteSearchIndex, getRouteSearchResult } from "@utils"
import { getAppTextConfig } from '@components/sharedComponentConfig'
import { SELECT_THEME, createRouteSelectStyles } from './routeQueryStyles.js'

const getOptionContentStyle = (isMobile) => ({
    display: "flex",
    gap: isMobile ? "2px" : "4px",
    alignItems: "center",
    fontSize: isMobile ? "14px" : "18px",
    fontWeight: 600,
    minWidth: 0,
})

const RouteOptionContent = ({ componentType, data, compact = false, isMobile, getRouteStyle, ...props }) => {
    const {
        routeLabel,
        originLabel,
        destinationLabel,
        specialRemarkLabel = '',
        isSpecial,
        isCancelled,
    } = data

    const WrappedComponent = componentType === 'Option' ? components.Option : components.SingleValue

    const style = getOptionContentStyle(isMobile)

    return (
        <WrappedComponent {...props} data={data}>
            <div style={style}>
                <RouteNumber
                    route={routeLabel}
                    operator={data.detail.operator}
                    isSpecial={isSpecial}
                    isCancelled={isCancelled}
                    componentType={componentType}
                    isMobile={isMobile}
                    getRouteStyle={getRouteStyle}
                />
                {!(componentType === 'SingleValue' && compact) && (
                    <RouteDetails
                        origin={originLabel}
                        destination={destinationLabel}
                        remark={specialRemarkLabel}
                    />
                )}
            </div>
        </WrappedComponent >
    )
}

export const RouteQueryInput = memo(function RouteQueryInput({
    compact = false, label = '', labelClassName = '', operator = 'kmb', selectedRoute, onRouteSelect,
}) {
    const { isMobile } = useWindowSize()
    const getRouteStyle = useRouteTypeStyle(operator)
    const dispatch = useDispatch()
    const selectRef = useRef(null)
    const inputId = useId()
    const hintId = `${inputId}-hint`
    const routes = useSelector(state => operator === 'ctb' ? state.route.ctbRoutes : state.route.routes)
    const isRoutesLoading = useSelector(state => state.route.isLoading)
    const storedRouteDetail = useSelector(state => operator === 'kmb' ? state.routeSelection.routeDetail : null)
    const routeDetail = operator === 'kmb' ? storedRouteDetail : selectedRoute
    const { uiMode, language } = useSelector(state => ({
        uiMode: state.userPreference.uiMode,
        language: state.userPreference.language,
    }), shallowEqual)
    const appText = getAppTextConfig(language)
    const isLightMode = uiMode === "light"
    const selectTheme = isLightMode ? SELECT_THEME.light : SELECT_THEME.night

    const [selectedOption, setSelectedOption] = useState(null)
    const [isKeypadOpen, setIsKeypadOpen] = useState(false)

    useEffect(() => {
        if (routeDetail && Object.keys(routeDetail).length > 0) {
            setSelectedOption(createRouteOption(routeDetail))
        } else {
            setSelectedOption(null)
        }
    }, [routeDetail])

    useEffect(() => {
        if (!isMobile) setIsKeypadOpen(false)
    }, [isMobile])

    const routeOptions = useMemo(
        () => routes?.map(createRouteOption) ?? [],
        [routes]
    )

    const searchIndex = useMemo(() => buildRouteSearchIndex(routeOptions), [routeOptions])

    const defaultOptions = useMemo(() => {
        const selectedRouteKey = selectedOption?.detail?.route?.toUpperCase() ?? ''
        const preferredOptions = getRouteSearchResult(searchIndex, selectedRouteKey).matches

        if (!selectedOption) {
            return preferredOptions
        }

        const dedupedOptions = preferredOptions.filter(option => option.value !== selectedOption.value)
        return [selectedOption, ...dedupedOptions]
    }, [searchIndex, selectedOption])

    const handleSearch = useCallback((inputValue, callback) => {
        const normalizedInput = inputValue.trim().toUpperCase()
        const results = getRouteSearchResult(searchIndex, normalizedInput).matches

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
        if (onRouteSelect) {
            onRouteSelect(option.detail)
        } else {
            dispatch(selectRouteThunk({ routeDetail: option.detail, routes }))
        }
        setSelectedOption(option)
    }, [dispatch, routes, onRouteSelect])

    const Control = useCallback((props) => (
        <components.Control {...props}>
            <SearchIcon
                sx={{
                    color: props.isFocused
                        ? selectTheme.focusedIcon
                        : selectTheme.icon,
                    fontSize: 20,
                    marginLeft: "12px",
                    marginRight: "8px",
                    flexShrink: 0,
                }}
            />
            {props.children}
        </components.Control>
    ), [selectTheme])

    const ClearIndicator = useCallback(({ clearValue }) => (
        <button
            type="button"
            className="route-query__clear"
            aria-label={appText.clearRouteSearch}
            title={appText.clearRouteSearch}
            onMouseDown={event => {
                event.preventDefault()
                event.stopPropagation()
            }}
            onTouchEnd={event => event.stopPropagation()}
            onKeyDown={event => event.stopPropagation()}
            onClick={event => {
                event.stopPropagation()
                clearValue()
                selectRef.current?.focus()
            }}
        >
            <CloseIcon fontSize="small" />
        </button>
    ), [appText.clearRouteSearch])

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

    const Input = useCallback(props => (
        <components.Input
            {...props}
            aria-describedby={[props['aria-describedby'], hintId].filter(Boolean).join(' ')}
        />
    ), [hintId])

    const selectComponents = useMemo(() => ({
        Control, Option, SingleValue, Input, ClearIndicator, IndicatorSeparator: null,
    }), [Control, Option, SingleValue, Input, ClearIndicator])

    const selectStyles = useMemo(
        () => createRouteSelectStyles(isLightMode, isMobile, selectTheme),
        [isLightMode, isMobile, selectTheme]
    )

    // Search navigation must not reach the simulator's window-level stop shortcuts.
    return (
        <div className="route-query" data-theme={uiMode} onKeyDown={event => event.stopPropagation()}>
            <div className="route-query__header">
                <label htmlFor={inputId} className={`route-query__label ${labelClassName}`}>
                    {label || appText.routeLabel}
                </label>
                <p id={hintId} className="route-query__hint">
                    {language === 'en' ? '(' : '（'}
                    {selectedOption ? appText.routeChangeHint : appText.routeSearchHint}
                    {language === 'en' ? ')' : '）'}
                </p>
            </div>
            {isMobile ? (
                <>
                    <button
                        id={inputId}
                        type="button"
                        className="route-query__mobile-trigger"
                        aria-haspopup="dialog"
                        aria-expanded={isKeypadOpen}
                        aria-describedby={hintId}
                        disabled={isRoutesLoading}
                        onClick={() => setIsKeypadOpen(true)}
                    >
                        <SearchIcon aria-hidden="true" />
                        {selectedOption ? (
                            <>
                                <RouteNumber
                                    operator={operator}
                                    route={selectedOption.routeLabel}
                                    isSpecial={selectedOption.isSpecial}
                                    isCancelled={selectedOption.isCancelled}
                                    componentType="SingleValue"
                                    isMobile
                                    getRouteStyle={getRouteStyle}
                                />
                                {!compact && (
                                    <RouteDetails
                                        origin={selectedOption.originLabel}
                                        destination={selectedOption.destinationLabel}
                                        remark={selectedOption.specialRemarkLabel}
                                    />
                                )}
                            </>
                        ) : (
                            <span>{isRoutesLoading ? appText.loadingRoutes : appText.routeInputPlaceholder}</span>
                        )}
                    </button>
                    {isKeypadOpen && (
                        <RouteSearchKeypad
                            searchIndex={searchIndex}
                            language={language}
                            uiMode={uiMode}
                            onClose={() => setIsKeypadOpen(false)}
                            onSelect={option => {
                                handleSelect(option)
                                setIsKeypadOpen(false)
                            }}
                        />
                    )}
                </>
            ) : <AsyncSelect
                ref={selectRef}
                inputId={inputId}
                instanceId={inputId}
                components={selectComponents}
                classNamePrefix="routeInputSelect"
                menuPortalTarget={isMobile ? undefined : document.body}
                menuPosition={isMobile ? "absolute" : "fixed"}
                styles={selectStyles}
                isDisabled={isRoutesLoading}
                isClearable
                blurInputOnSelect
                cacheOptions
                defaultOptions={defaultOptions}
                placeholder={isRoutesLoading ? appText.loadingRoutes : appText.routeInputPlaceholder}
                loadingMessage={() => appText.searchRoutes}
                noOptionsMessage={() => appText.routeSearchNoResults}
                isLoading={isRoutesLoading}
                filterOption={null}
                loadOptions={handleSearch}
                value={selectedOption}
                onChange={handleSelect}
            />}
        </div>
    )
})

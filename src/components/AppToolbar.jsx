import { useEffect, useId, useRef, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import DirectionsBusFilledOutlinedIcon from '@mui/icons-material/DirectionsBusFilledOutlined'
import { setLanguage, setUiMode } from '@store/userPreferenceSlice'
import { getAppTextConfig, getFooterConfig } from './sharedComponentConfig'
import '@styles/layout/appChrome.css'

const companies = ['kmb', 'ctb']

export const AppToolbar = ({ company, onCompanyChange }) => {
    const dispatch = useDispatch()
    const [preferencesOpen, setPreferencesOpen] = useState(false)
    const preferencesId = useId()
    const toggleRef = useRef(null)
    const { language, uiMode } = useSelector(state => ({
        language: state.userPreference.language,
        uiMode: state.userPreference.uiMode,
    }), shallowEqual)
    const text = getAppTextConfig(language)
    const footerText = getFooterConfig(language)
    const isLight = uiMode === 'light'

    useEffect(() => {
        const favicon = document.querySelector('link[rel="icon"]')
        favicon.href = `${import.meta.env.BASE_URL}${company === 'ctb' ? 'favicon-ctb.svg' : 'favicon.svg'}`
    }, [company])

    return (
        <header
            className="app-toolbar"
            data-theme={uiMode}
            data-company={company}
            onKeyDown={event => {
                if (event.key === 'Escape' && preferencesOpen) {
                    setPreferencesOpen(false)
                    toggleRef.current?.focus()
                }
            }}
        >
            <div className="app-toolbar__brand">
                <span className="app-toolbar__brand-mark" aria-hidden="true">
                    <DirectionsBusFilledOutlinedIcon />
                    <svg className="app-toolbar__stop-sign" viewBox="0 0 10 26" fill="none" focusable="false">
                        <circle cx="5" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M2 6h6M5 10v14M2 24h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </span>
                <div className="app-toolbar__brand-copy">
                    <h1 className="app-toolbar__title">{company.toUpperCase()} <span>DPIP</span></h1>
                    <p className="app-toolbar__subtitle">{text.appSubtitle}</p>
                </div>
                <div
                    className="app-toolbar__company-tabs"
                    role="tablist"
                    aria-label={text.companyTabs}
                    onKeyDown={event => {
                        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
                        event.preventDefault()
                        event.stopPropagation()
                        const nextCompany = event.key === 'Home' ? companies[0]
                            : event.key === 'End' ? companies.at(-1)
                            : companies[(companies.indexOf(company) + 1) % companies.length]
                        onCompanyChange(nextCompany)
                        event.currentTarget.querySelector(`#company-tab-${nextCompany}`)?.focus()
                    }}
                >
                    {companies.map(operator => (
                        <button
                            key={operator}
                            id={`company-tab-${operator}`}
                            type="button"
                            role="tab"
                            className="app-toolbar__company-tab"
                            aria-selected={company === operator}
                            aria-controls={`company-panel-${operator}`}
                            tabIndex={company === operator ? 0 : -1}
                            onClick={() => onCompanyChange(operator)}
                        >
                            {text.companyNames[operator]}
                        </button>
                    ))}
                </div>
            </div>
            <button
                ref={toggleRef}
                type="button"
                className="app-chrome-button app-toolbar__settings"
                aria-expanded={preferencesOpen}
                aria-controls={preferencesId}
                onClick={() => setPreferencesOpen(open => !open)}
            >
                <SettingsOutlinedIcon aria-hidden="true" />
                <span>{text.settings}</span>
            </button>
            <div
                id={preferencesId}
                className="app-toolbar__preferences"
                data-open={preferencesOpen}
                role="group"
                aria-label={text.preferences}
            >
                <button
                    type="button"
                    className="app-chrome-button"
                    aria-label={language === 'en' ? 'Switch to Traditional Chinese' : '切換為英文'}
                    onClick={() => dispatch(setLanguage(language === 'en' ? 'zh' : 'en'))}
                >
                    {language === 'en' ? '繁中' : 'English'}
                </button>
                <button
                    type="button"
                    className="app-chrome-button"
                    aria-label={footerText.modeToggle[uiMode]}
                    onClick={() => dispatch(setUiMode(isLight ? 'night' : 'light'))}
                >
                    {isLight ? <DarkModeIcon aria-hidden="true" /> : <LightModeIcon aria-hidden="true" />}
                    <span>{isLight ? text.nightMode : text.dayMode}</span>
                </button>
            </div>
        </header>
    )
}

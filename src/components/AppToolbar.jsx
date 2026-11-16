import { useEffect, useId, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import DirectionsBusFilledOutlinedIcon from '@mui/icons-material/DirectionsBusFilledOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckIcon from '@mui/icons-material/Check'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { getAppTextConfig } from './sharedComponentConfig'
import '@styles/layout/appChrome.css'

const companies = ['kmb', 'ctb']

export const AppToolbar = ({ company, onCompanyChange, children, routeStatus }) => {
    const [companyAnchor, setCompanyAnchor] = useState(null)
    const companyMenuId = useId()
    const companyButtonId = useId()
    const { language, uiMode } = useSelector(state => ({
        language: state.userPreference.language,
        uiMode: state.userPreference.uiMode,
    }), shallowEqual)
    const text = getAppTextConfig(language)
    const isLight = uiMode === 'light'

    useEffect(() => {
        const favicon = document.querySelector('link[rel="icon"]')
        favicon.href = `${import.meta.env.BASE_URL}${company === 'ctb' ? 'favicon-ctb.svg' : 'favicon.svg'}`
    }, [company])

    return (
        <header
            className={`app-toolbar${routeStatus ? ' app-toolbar--with-status' : ''}`}
            data-theme={uiMode}
            data-company={company}
        >
            <h1 className="app-toolbar__brand" aria-label={`${company.toUpperCase()} DPIP`}>
                <button
                    id={companyButtonId}
                    type="button"
                    className="app-toolbar__company-trigger"
                    aria-label={`${text.companyTabs}: ${text.companyNames[company]}`}
                    aria-haspopup="menu"
                    aria-expanded={Boolean(companyAnchor)}
                    aria-controls={companyAnchor ? companyMenuId : undefined}
                    onClick={event => setCompanyAnchor(event.currentTarget)}
                >
                    <span className="app-toolbar__brand-mark" aria-hidden="true">
                        <DirectionsBusFilledOutlinedIcon />
                        <svg className="app-toolbar__stop-sign" viewBox="0 0 10 26" fill="none" focusable="false">
                            <circle cx="5" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M2 6h6M5 10v14M2 24h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </span>
                    <span className="app-toolbar__brand-copy">
                        <span className="app-toolbar__title">{company.toUpperCase()} <span>DPIP</span></span>
                        <span className="app-toolbar__subtitle">{text.appSubtitle}</span>
                    </span>
                    <ExpandMoreIcon className="app-toolbar__company-chevron" aria-hidden="true" />
                </button>
            </h1>
            <Menu
                id={companyMenuId}
                anchorEl={companyAnchor}
                open={Boolean(companyAnchor)}
                onClose={() => setCompanyAnchor(null)}
                MenuListProps={{
                    'aria-labelledby': companyButtonId,
                    onKeyDown: event => {
                        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
                            event.stopPropagation()
                        }
                    },
                }}
                PaperProps={{
                    sx: {
                        minWidth: 180,
                        marginTop: 1,
                        borderRadius: '12px',
                        backgroundColor: isLight ? '#ffffff' : '#162033',
                        color: isLight ? '#1e293b' : '#e2e8f0',
                    },
                }}
            >
                {companies.map(operator => (
                    <MenuItem
                        key={operator}
                        role="menuitemradio"
                        aria-checked={company === operator}
                        selected={company === operator}
                        onClick={() => {
                            onCompanyChange(operator)
                            setCompanyAnchor(null)
                        }}
                        sx={{ gap: 2, minHeight: 44 }}
                    >
                        <span>{text.companyNames[operator]}</span>
                        {company === operator && <CheckIcon fontSize="small" sx={{ marginLeft: 'auto' }} />}
                    </MenuItem>
                ))}
            </Menu>
            <div className="app-toolbar__search">{children}</div>
            {routeStatus && <div className="app-toolbar__status">{routeStatus}</div>}
        </header>
    )
}

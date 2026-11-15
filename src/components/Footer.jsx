import { memo } from 'react'
import { useSelector } from 'react-redux'
import { RouteDataStatus } from './RouteDataStatus'
import { getFooterConfig } from './sharedComponentConfig'
import '@styles/layout/appChrome.css'

export const Footer = memo(function Footer({ uiMode = 'night' }) {
    const language = useSelector(state => state.userPreference.language)
    const text = getFooterConfig(language)

    return (
        <footer className="app-footer" data-theme={uiMode}>
            <details className="app-footer__help">
                <summary>{text.helpLabel}</summary>
                <div className="app-footer__help-content">
                    <h2>{text.keyboardShortcutLabel}</h2>
                    <ul className="app-footer__shortcuts">
                        {text.shortcuts.map(({ keys, label }) => (
                            <li key={label}>
                                {keys.map(key => <kbd key={key}>{key}</kbd>)}
                                <span>{label}</span>
                            </li>
                        ))}
                    </ul>
                    <p>{text.note}</p>
                    <p>{text.legal}</p>
                </div>
            </details>
            <RouteDataStatus />
        </footer>
    )
})

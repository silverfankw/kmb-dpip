import { useState } from 'react'
import { useSelector } from 'react-redux'
import { VersionHistoryDialog } from '@components/VersionHistoryDialog'
import { versionHistory } from '@utils/versionHistory'
import { getFooterConfig } from './sharedComponentConfig'
import '@styles/layout/appChrome.css'

export const Footer = ({ uiMode = 'night' }) => {
    const [versionHistoryOpen, setVersionHistoryOpen] = useState(false)
    const language = useSelector(state => state.userPreference.language)
    const text = getFooterConfig(language)

    return (
        <footer className="app-footer" data-theme={uiMode}>
            <div className="app-footer__links">
                <a target="_blank" rel="noreferrer" href={text.repoUrl}>{text.repoLabel}</a>
                <button type="button" className="app-chrome-button" onClick={() => setVersionHistoryOpen(true)}>
                    {text.versionHistoryLabel}
                </button>
            </div>
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
            <VersionHistoryDialog
                open={versionHistoryOpen}
                onConfirm={() => setVersionHistoryOpen(false)}
                versionHistory={versionHistory}
            />
        </footer>
    )
}

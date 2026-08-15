import { useState } from "react"
import { useDispatch } from "react-redux"
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'

import { VersionHistoryDialog } from "@components/VersionHistoryDialog"
import { versionHistory } from '@utils/versionHistory'
import { setUiMode } from "@store/userPreferenceSlice"
import { footerConfig } from './sharedComponentConfig'

const styles = {
    footer: "w-full px-4 pb-4 sm:px-5 lg:px-8 lg:pb-6 max-sm:px-2 max-sm:pb-2",
    shell: [
        "mx-auto flex w-full max-w-[1720px] flex-col gap-3 rounded-[1.5rem]",
        "px-4 py-3 text-xs backdrop-blur-lg",
        "max-sm:gap-1 max-sm:px-3 max-sm:py-2",
        "sm:flex-row sm:items-center sm:justify-between"
    ].join(" "),
    shellNight: "text-slate-200",
    shellLight: "text-slate-700",
    linkNight: "underline hover:cursor-pointer text-slate-200 transition text-xs hover:text-cyan-200",
    linkLight: "underline hover:cursor-pointer text-slate-700 transition text-xs hover:text-cyan-700",
    actionRow: "flex flex-col items-end gap-1 self-end sm:self-auto",
    shortcutRow: "flex flex-wrap items-center gap-2 text-[10px] leading-none opacity-80 sm:text-[11px] lg:text-[12px] max-sm:justify-center max-sm:gap-x-1.5 max-sm:gap-y-1.5 max-sm:max-w-[260px] max-sm:leading-tight",
    shortcutLabel: "mr-1 font-medium tracking-[0.08em] text-[9px] opacity-90 sm:text-[10px] lg:text-[11px] max-sm:mr-0 max-sm:w-full max-sm:text-center",
    shortcutKey: [
        "inline-flex h-4 min-w-4 items-center justify-center rounded-[4px] border px-1 font-mono text-[9px] font-bold leading-none sm:h-5 sm:min-w-5 sm:px-1.5 sm:text-[10px] lg:h-5 lg:min-w-5 lg:text-[10px]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.35),0_1px_0_rgba(0,0,0,0.22)]"
    ].join(" "),
    stackedShortcutPair: "flex items-center gap-1.5 sm:gap-2 max-sm:flex-col max-sm:items-start max-sm:gap-0.5 max-sm:mt-0.5",
    shortcutKeyNight: "border-slate-400/35 bg-slate-800/90 text-slate-100",
    shortcutKeyLight: "border-slate-300 bg-slate-100 text-slate-700",
    modeToggle: [
        "relative inline-flex items-center gap-1 rounded-full border p-1 transition-colors duration-150",
        "focus:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-400/60 hover:cursor-pointer"
    ].join(" "),
    modeToggleNight: "border-slate-400/35 bg-[#1e293b]/95 text-slate-100 shadow-[0_4px_12px_rgba(8,15,32,0.32)]",
    modeToggleLight: "border-slate-300/90 bg-white text-slate-700 shadow-[0_4px_12px_rgba(148,163,184,0.18)]",
    modeToggleIcon: "relative z-10 flex h-7 w-7 items-center justify-center rounded-full transition-colors",
    modeToggleThumb: "absolute top-1 h-7 w-7 rounded-full transition-[left,background-color,box-shadow] duration-150 ease-out",
}

export const Footer = ({ uiMode = "night" }) => {
    const [versionHistoryOpen, setVersionHistoryOpen] = useState(false)
    const dispatch = useDispatch()
    const isLightMode = uiMode === "light"
    const shellClassName = `${styles.shell} ${isLightMode ? styles.shellLight : styles.shellNight}`
    const linkClassName = isLightMode ? styles.linkLight : styles.linkNight
    const footerTextClassName = `${styles.shortcutLabel} ${isLightMode ? "text-slate-600" : "text-slate-300"}`
    const modeToggleClassName = `${styles.modeToggle} ${isLightMode ? styles.modeToggleLight : styles.modeToggleNight}`
    const lightIconColor = isLightMode ? "#f59e0b" : "#94a3b8"
    const darkIconColor = isLightMode ? "#64748b" : "#e2e8f0"

    return (
        <>
            <footer className={styles.footer}>
                <div className={shellClassName}>
                    <div className="flex flex-col gap-2 sm:items-center">
                        <p className="select-none">
                            <a
                                target="_blank"
                                rel="noreferrer"
                                className={`${linkClassName} ${footerTextClassName}`}
                                href={footerConfig.repoUrl}
                            >
                                {footerConfig.repoLabel}
                            </a>
                        </p>
                        <button
                            type="button"
                            className={`${linkClassName} ${footerTextClassName}`}
                            onClick={() => setVersionHistoryOpen(true)}
                        >
                            {footerConfig.versionHistoryLabel}
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 sm:items-center">
                        <div className={`${styles.shortcutRow} ${isLightMode ? 'text-slate-600' : 'text-slate-300'}`}>
                            <span className={footerTextClassName}>{footerConfig.keyboardShortcutLabel}</span>
                            <span className={styles.stackedShortcutPair}>
                                {footerConfig.shortcuts.slice(0, 2).map(({ keys, label }) => (
                                    <span key={label} className="flex items-center gap-1">
                                        <span className={`${styles.shortcutKey} ${isLightMode ? styles.shortcutKeyLight : styles.shortcutKeyNight}`}>
                                            {keys[0]}
                                        </span>
                                        <span className={footerTextClassName}>{label}</span>
                                    </span>
                                ))}
                            </span>
                            <span className={styles.stackedShortcutPair}>
                                {footerConfig.shortcuts.slice(2).map(({ keys, label }) => (
                                    <span key={label} className="flex items-center gap-1">
                                        <span className={`${styles.shortcutKey} ${isLightMode ? styles.shortcutKeyLight : styles.shortcutKeyNight}`}>
                                            {keys[0]}
                                        </span>
                                        <span className={footerTextClassName}>{label}</span>
                                    </span>
                                ))}
                            </span>
                        </div>

                        <p className={`select-none ${footerTextClassName}`}>
                            {footerConfig.note.split('\n').map((line, index) => (
                                <span key={line + index} className="block">
                                    {line}
                                </span>
                            ))}
                        </p>
                        <p className={`select-none ${footerTextClassName}`}>
                            {footerConfig.legal}
                        </p>
                    </div>

                    <div className={styles.actionRow}>
                        <button
                            type="button"
                            className={modeToggleClassName}
                            onClick={() => dispatch(setUiMode(uiMode === "light" ? "night" : "light"))}
                            aria-label={uiMode === "light" ? footerConfig.modeToggle.light : footerConfig.modeToggle.night}
                            title={uiMode === "light" ? footerConfig.modeToggle.light : footerConfig.modeToggle.night}
                        >
                            <span
                                className={styles.modeToggleThumb}
                                style={{
                                    left: isLightMode ? "4px" : "32px",
                                    backgroundColor: isLightMode ? "rgba(255,255,255,0.98)" : "rgba(15,23,42,0.98)",
                                    boxShadow: isLightMode
                                        ? "0 2px 10px rgba(148,163,184,0.35)"
                                        : "0 2px 12px rgba(2,6,23,0.55)",
                                }}
                            />
                            <span className={styles.modeToggleIcon} style={{ color: lightIconColor }}>
                                <LightModeIcon fontSize="small" />
                            </span>
                            <span className={styles.modeToggleIcon} style={{ color: darkIconColor }}>
                                <DarkModeIcon fontSize="small" />
                            </span>
                        </button>
                    </div>
                </div>
            </footer>
            <VersionHistoryDialog
                open={versionHistoryOpen}
                onConfirm={() => setVersionHistoryOpen(false)}
                versionHistory={versionHistory}
            />
        </>
    )
}
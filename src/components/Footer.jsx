import { useState } from "react"
import { useDispatch } from "react-redux"
import { Tooltip } from "@mui/material"
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'

import { VersionHistoryDialog } from "@components/VersionHistoryDialog"
import { versionHistory } from '@utils/versionHistory'
import { setUiMode } from "@store/userPreferenceSlice"

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
    linkNight: "text-slate-200 transition text-xs hover:text-cyan-200",
    linkLight: "text-slate-700 transition text-xs hover:text-cyan-700",
    buttonNight: "text-slate-300 underline transition hover:text-cyan-200 hover:cursor-pointer",
    buttonLight: "text-slate-700 underline transition hover:text-cyan-700 hover:cursor-pointer",
    actionRow: "flex items-center gap-4 self-end sm:self-auto",
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
    const buttonClassName = isLightMode ? styles.buttonLight : styles.buttonNight
    const modeToggleClassName = `${styles.modeToggle} ${isLightMode ? styles.modeToggleLight : styles.modeToggleNight}`
    const lightIconColor = isLightMode ? "#f59e0b" : "#94a3b8"
    const darkIconColor = isLightMode ? "#64748b" : "#e2e8f0"

    return (
        <>
            <footer className={styles.footer}>
                <div className={shellClassName}>
                    <p className="select-none">
                        <a
                            target="_blank"
                            rel="noreferrer"
                            className={linkClassName}
                            href="https://github.com/silverfankw/kmb-dpip"
                        >
                            silverfankw/kmb-dpip-v2 @ 2026
                        </a>
                    </p>
                    <p className="select-none">This website is best viewed at 16:9 resolution.</p>
                    <div className={styles.actionRow}>
                        <button
                            type="button"
                            className={buttonClassName}
                            onClick={() => setVersionHistoryOpen(true)}
                        >
                            Version History
                        </button>
                        <Tooltip title={uiMode === "light" ? "切換夜間模式" : "切換日間模式"}>
                            <button
                                type="button"
                                className={modeToggleClassName}
                                onClick={() => dispatch(setUiMode(uiMode === "light" ? "night" : "light"))}
                                aria-label={uiMode === "light" ? "切換夜間模式" : "切換日間模式"}
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
                        </Tooltip>
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
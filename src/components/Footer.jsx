import { useState } from "react"

import { VersionHistoryDialog } from "@components/VersionHistoryDialog"
import { versionHistory } from '@utils/versionHistory'

const styles = {
    footer: "w-full px-4 pb-4 sm:px-5 lg:px-8 lg:pb-6 max-sm:px-2 max-sm:pb-2",
    shell: [
        "mx-auto flex w-full max-w-[1720px] flex-col gap-3 rounded-[1.5rem] ",
        "bg-slate-950/35 px-4 py-3 text-xs text-slate-300 shadow-[0_20px_50px_rgba(2,6,23,0.28)] backdrop-blur-lg",
        "max-sm:gap-1 max-sm:px-3 max-sm:py-2",
        "sm:flex-row sm:items-center sm:justify-between"
    ].join(" "),
    link: "text-slate-200 underline transition text-xs hover:text-cyan-200",
    button: "text-slate-300 underline transition hover:text-cyan-200",
}

export const Footer = () => {
    const [versionHistoryOpen, setVersionHistoryOpen] = useState(false)

    return (
        <>
            <footer className={styles.footer}>
                <div className={styles.shell}>
                    <p className="select-none">
                        <a
                            target="_blank"
                            rel="noreferrer"
                            className={styles.link}
                            href="https://github.com/silverfankw/kmb-dpip"
                        >
                            silverfankw/kmb-dpip-v2 @ 2025
                        </a>
                    </p>
                    <button
                        type="button"
                        className={styles.button}
                        onClick={() => setVersionHistoryOpen(true)}
                    >
                        Version History
                    </button>
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
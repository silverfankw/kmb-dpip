export const Background = ({ uiMode = "night" }) => {
    const isLightMode = uiMode === "light"

    return (
        <div className={`fixed inset-0 -z-10 overflow-hidden ${isLightMode ? "bg-[#fdfefe]" : "bg-[#0a1022]"}`}>
            <div className={isLightMode
                ? "absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.10),transparent_24%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_22%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.08),transparent_24%),linear-gradient(160deg,#ffffff_0%,#f8fafc_52%,#f1f5f9_100%)]"
                : "absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,27,0.18),transparent_24%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.16),transparent_30%),linear-gradient(160deg,#0a1022_0%,#13203a_22%,#1e293b_100%)]"}
            />
            <div className={isLightMode
                ? "absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:42px_42px]"
                : "absolute inset-0 opacity-32 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)] [background-size:42px_42px]"}
            />
            <div className={`absolute left-[10%] top-[8%] h-64 w-64 rounded-full blur-3xl ${isLightMode ? "bg-cyan-200/18" : "bg-cyan-300/14"}`} />
            <div className={`absolute bottom-[12%] right-[8%] h-72 w-72 rounded-full blur-3xl ${isLightMode ? "bg-violet-200/16" : "bg-violet-400/12"}`} />
            <div className={`absolute inset-0 bg-linear-to-b from-transparent via-transparent ${isLightMode ? "to-white/45" : "to-slate-950/18"}`} />
        </div>
    )
}

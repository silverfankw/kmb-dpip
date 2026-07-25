export const Background = () =>
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050816]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_26%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_24%),radial-gradient(circle_at_bottom,rgba(34,197,94,0.14),transparent_28%),linear-gradient(160deg,#050816_0%,#0b1120_52%,#111827_100%)]" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(148,163,184,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute left-[10%] top-[8%] h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[12%] right-[8%] h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/30" />
    </div>

export const Background = ({ uiMode = "night" }) => (
    <div
        aria-hidden="true"
        className={`fixed inset-0 -z-10 ${uiMode === "light" ? "bg-[#f1f5f9]" : "bg-[#0f172a]"}`}
    />
)

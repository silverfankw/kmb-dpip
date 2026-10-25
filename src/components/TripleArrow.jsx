const chevronPaths = [
    "M12 10H36L70 50L36 90H12L46 50Z",
    "M65 10H89L123 50L89 90H65L99 50Z",
    "M118 10H142L176 50L142 90H118L152 50Z",
]

export const TripleArrow = (props) => (
    <svg
        width="100%"
        height="100%"
        style={{ display: "block", maxWidth: "200px", height: "auto" }}
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
        viewBox="0 0 180 100"
        {...props}
    >
        <g fill="#fff">
            {chevronPaths.map((path) => (
                <path key={path} d={path} />
            ))}
        </g>
    </svg>
)

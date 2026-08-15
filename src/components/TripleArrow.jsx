const arrowTransforms = [
    'translate(-714.021 -20.258)',
    'translate(-664.073 -19.578)',
    'translate(-613.467 -18.898)',
]

const arrowRectProps = {
    width: 100.287,
    height: 40.115,
    rx: 0,
    ry: 0,
}

export const TripleArrow = (props) => (
    <svg
        width="100%"
        height="100%"
        style={{ display: "block", maxWidth: "200px", height: "auto" }}
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
        viewBox="0 0 200 130"
        {...props}
    >
        <g fill="#fff">
            {arrowTransforms.map((transform) => (
                <g key={transform} transform={transform}>
                    <rect
                        {...arrowRectProps}
                        transform="matrix(.48535 -.48535 .62202 0 727.59 131.579)"
                    />
                    <rect
                        {...arrowRectProps}
                        transform="matrix(.49848 .49848 -.62202 0 751.225 32.957)"
                    />
                </g>
            ))}
        </g>
    </svg>
)

export const CurrentStopIndicator = props => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
        viewBox="0 0 160 300"
        {...props}
    >
        <g fill="#3f5787" stroke="#fbfbfb" strokeWidth={3}>
            <path
                d="M-96 0H4"
                transform="matrix(.64952 .375 -3.75 6.4952 82.563 45.202)"
            />
            <path
                d="M-96 0H4"
                transform="matrix(.64952 -.375 3.75 6.4952 136.34 10.702)"
            />
            <path
                d="M-96 0H4"
                transform="matrix(.64952 .375 -3.75 6.4952 82.563 91.702)"
            />
            <path
                d="M-96 0H4"
                transform="matrix(.64952 -.375 3.75 6.4952 136.34 57.202)"
            />
            <path
                d="M-96 0H4"
                transform="matrix(.64952 .375 -3.75 6.4952 82.563 138.202)"
            />
            <path
                d="M-96 0H4"
                transform="matrix(.64952 -.375 3.75 6.4952 136.34 103.702)"
            />
        </g>
        <g transform="matrix(.75 0 0 .75 -16.586 -9.692)">
            <ellipse
                fill="#fff"
                rx={66.997}
                ry={67.383}
                transform="matrix(1.32296 0 0 1.29333 128.995 324.173)"
            />
            <ellipse
                fill="#fffa00"
                stroke="red"
                strokeWidth={10}
                rx={66.997}
                ry={67.383}
                transform="matrix(.94385 0 0 .93055 128.995 322.985)"
            />
        </g>
    </svg>
)

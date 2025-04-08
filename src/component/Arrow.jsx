import PropTypes from 'prop-types'

export const Arrow = ({ direction = "right", stroke = "m", size = "m", style = "" }) => {

    const directionVariants = {
        down: "rotate-45",
        left: "rotate-[135deg]",
        up: "-rotate-[135deg]",
        right: "-rotate-45",
    }

    const sizeVariants = {
        s: "p-[1cqw]",
        sm: "p-[1.25cqw]",
        m: "p-[1.5cqw]",
        l: "p-[1.625cqw]",
        xl: "p-[1.75cqw]"
    }

    const strokeVariants = {
        s: "border-r-[0.5cqw] border-b-[0.5cqw]",
        sm: "border-r-[0.75cqw] border-b-[0.75cqw]",
        m: "border-r-[1cqw] border-b-[1cqw]",
        l: "border-r-[1.25cqw] border-b-[1.25cqw]",
        xl: "border-r-[1.5cqw] border-b-[1.5cqw]"
    }

    return (
        <i className={`${strokeVariants[stroke]}
            ${directionVariants[direction]} 
            ${sizeVariants[size]} ${style}
            inline-block
            border-solid border-white`}>
        </i>
    )
}

Arrow.propTypes = {
    direction: PropTypes.string.isRequired,
    stroke: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    style: PropTypes.string,
}
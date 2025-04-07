import PropTypes from 'prop-types'

export const Arrow = ({ direction = "right", stroke = "m", size = "m", style = "" }) => {

    const directionVariants = {
        down: "rotate-45",
        left: "rotate-[135deg]",
        up: "-rotate-[135deg]",
        right: "-rotate-45",
    }

    const sizeVariants = {
        s: "p-[3px]",
        sm: "p-[4px]",
        m: "p-[6px]",
        l: "p-[10px]",
        xl: "p-[15px]"
    }

    const strokeVariants = {
        s: "border-r-[3px] border-b-[3px]",
        sm: "border-r-[4px] border-b-[4px]",
        m: "border-r-[6px] border-b-[6px]",
        l: "border-r-[10px] border-b-[10px]",
        xl: "border-r-[15px] border-b-[15px]"
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
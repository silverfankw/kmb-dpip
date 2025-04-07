import PropTypes from 'prop-types'

export const Button = ({ style, text, disabled, onClick }) => {
    return (
        <button className={`font-medium rounded-lg text-sm text-center text-white 
            bg-linear-to-r hover:bg-linear-to-br 
            focus:ring-2 focus:outline-hidden
         px-5 py-2.5 mr-2 mb-2
        ${style}`}
            onClick={() => onClick()}
            disabled={disabled}
        >{text}</button>
    )
}

Button.propTypes = {
    style: PropTypes.string,
    text: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
}
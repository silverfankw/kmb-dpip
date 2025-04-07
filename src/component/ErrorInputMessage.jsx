import PropTypes from 'prop-types'

export const ErrorInputMessage = ({ message = "" }) => {
    return (
        <span className="text-xs text-red-600">
            {message}
        </span>)
}

ErrorInputMessage.propTypes = {
    message: PropTypes.string.isRequired
}
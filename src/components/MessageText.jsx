import PropTypes from 'prop-types'

export const MessageText = ({ message = "", style = {}, tailwindStyle = "" }) => {
    return (
        <span style={style} className={`text-xs ${tailwindStyle}`}>
            {message}
        </span>)
}

MessageText.propTypes = {
    message: PropTypes.string.isRequired,
    style: PropTypes.object,
    tailwindStyle: PropTypes.string,
}
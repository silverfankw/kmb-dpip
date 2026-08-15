import PropTypes from 'prop-types'

const defaultClassName = 'text-xs'

export const MessageText = ({ message = "", style = {}, tailwindStyle = "" }) => {
    return (
        <span style={style} className={`${defaultClassName} ${tailwindStyle}`}>
            {message}
        </span>
    )
}

MessageText.propTypes = {
    message: PropTypes.string.isRequired,
    style: PropTypes.object,
    tailwindStyle: PropTypes.string,
}
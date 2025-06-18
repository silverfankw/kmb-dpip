import PropTypes from 'prop-types'
import { ErrorInputMessage } from './ErrorInputMessage'

export const Input = ({
    id,
    type = "text",
    pattern,
    validInput = true,
    invalidMessage = "",
    value = "",
    style = "",
    placeholder = "",
    minLength,
    maxLength,
    onChange,
    onInput,
    // submitAction
}) => {
    // const inputRef = useRef()
    // const handleSearch = event => { if (event.key === "Enter") submitAction?.(event.target.value) }

    return (
        <div>
            {placeholder && (
                <label htmlFor={id} className="text-xs text-gray-200">{placeholder}</label>
            )}
            <input
                id={id}
                type={type}
                value={value}
                pattern={pattern}
                minLength={minLength}
                maxLength={maxLength}
                className={`block bg-white text-black text-xs w-full 
                    rounded-lg border border-gray-500 py-3 pl-3 pr-10 
                    placeholder:text-gray-400 placeholder:text-xs
                    ${style}`}
                onChange={e => onChange?.(e.target.value)}
                onInput={onInput}
            // onKeyUp={handleSearch}
            />
            {invalidMessage && !validInput && value.length > 0 && (
                <ErrorInputMessage message={invalidMessage} />
            )}
        </div>
    )
}

Input.propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    pattern: PropTypes.string,
    validInput: PropTypes.bool,
    invalidMessage: PropTypes.string,
    value: PropTypes.string,
    style: PropTypes.string,
    placeholder: PropTypes.string,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    onChange: PropTypes.func,
    onInput: PropTypes.func,
    submitAction: PropTypes.func,
}
import PropTypes from 'prop-types'
import { ErrorInputMessage } from './ErrorInputMessage';

export const Input = ({
    type = "text", pattern, validInput, invalidMessage = "",
    value, style, placeholder, defaultValue,
    minLength, maxLength, onChange, onInput, submitAction }) => {

    // const inputRef = useRef()

    // const handleSearch = event => { if (event.key == "Enter") submitAction(event.target.value) }

    return (
        <div>
            {placeholder ? <label className="text-xs text-gray-200">{placeholder}</label> : ""}
            <input
                // ref={inputRef}
                defaultValue={defaultValue}
                type={type}
                value={value}
                pattern={pattern}
                minLength={minLength}
                maxLength={maxLength}
                className={`block bg-white text-black text-xs w-full 
                    rounded-lg border border-gray-500 py-3 pl-3 pr-10 
        placeholder:text-gray-400 placeholder:text-xs
        ${style} `}
                onChange={e => onChange(e.target.value)}
                onInput={onInput ? (e) => onInput(e) : ""}
            // onKeyUp={e => handleSearch(e)}
            />

            {(invalidMessage != "" && !validInput && value.length != 0) ?
                (<ErrorInputMessage message={invalidMessage} />) :
                <></>}
        </div>)
}

Input.propTypes = {
    type: PropTypes.string,
    validInput: PropTypes.bool,
    invalidMessage: PropTypes.string,
    value: PropTypes.bool,
    style: PropTypes.string,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.string,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    onChange: PropTypes.func,
    submitAction: PropTypes.func
}
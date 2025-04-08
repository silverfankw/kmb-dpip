import PropTypes from 'prop-types'
import { ErrorInputMessage } from './ErrorInputMessage';

export const Input = ({
    validInput, invalidMessage = "",
    value, style, placeholder, defaultValue,
    minLength, maxLength, onChange, submitAction }) => {

    // const inputRef = useRef()

    // const handleSearch = event => { if (event.key == "Enter") submitAction(event.target.value) }

    return (
        <div>
            {placeholder ? <label className="text-xs text-gray-200">{placeholder}</label> : ""}
            <input
                // ref={inputRef}
                defaultValue={defaultValue}
                type="text"
                value={value}
                minLength={minLength}
                maxLength={maxLength}
                className={`block text-xs text-white w-full rounded-md border border-gray-300 
        py-3 pl-3 pr-10 
        text-black ring-1 ring-inset ring-neutral-400 
        placeholder:text-gray-400 placeholder:text-xs
        focus:ring-3 focus:ring-inset 
        focus:ring-zinc-400
        ${style} `}
                onChange={e => onChange(e.target.value)}
            // onKeyUp={e => handleSearch(e)}
            />

            {(invalidMessage != "" && !validInput && value.length != 0) ?
                (<ErrorInputMessage message={invalidMessage} />) :
                <></>}
        </div>)
}

Input.propTypes = {
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
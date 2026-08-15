import PropTypes from 'prop-types'
import { MessageText } from './MessageText'

const inputClassName = [
    'block w-full text-xs sm:text-sm text-slate-800',
    'rounded-xl border border-slate-200/80 bg-white/90',
    'py-2.5 pl-3 pr-10 shadow-[0_4px_12px_rgba(148,163,184,0.08)]',
    'placeholder:text-slate-400 placeholder:text-[11px] sm:placeholder:text-xs',
    'transition-all duration-200 ease-out',
    'focus:outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-200/80',
    'focus:shadow-[0_0_0_3px_rgba(14,165,233,0.08),0_8px_18px_rgba(148,163,184,0.12)]',
    'disabled:cursor-not-allowed disabled:opacity-60',
].join(' ')

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
}) => {
    return (
        <div>
            {placeholder && (
                <label
                    htmlFor={id}
                    className="mb-1 block text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500"
                >
                    {placeholder}
                </label>
            )}
            <input
                id={id}
                type={type}
                value={value}
                pattern={pattern}
                minLength={minLength}
                maxLength={maxLength}
                className={`${inputClassName} ${style}`}
                onChange={e => onChange?.(e.target.value)}
                onInput={onInput}
            />
            {invalidMessage && !validInput && value.length > 0 && (
                <MessageText message={invalidMessage} tailwindStyle="text-red-600" />
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
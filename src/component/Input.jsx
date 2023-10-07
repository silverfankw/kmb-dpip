import { useRef } from "react"

export const Input = ({ value, className, style, placeholder, maxLength, onChange, submitAction }) => {

    const inputRef = useRef()

    const handleSearch = event => { if (event.key == "Enter") submitAction(event.target.value) }

    return (
        <input
            style={style}
            ref={inputRef}
            type="text"
            value={value}
            maxLength={maxLength}
            className={`block text-xs w-full rounded-md border border-gray-300 
                py-1.5 pl-3 pr-10 
				text-black ring-1 ring-inset ring-neutral-400 
				placeholder:text-gray-400 placeholder:text-xs
                focus:ring-3 focus:ring-inset 
				focus:ring-zinc-400 
              
                ${className} `}
            placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            onKeyUp={e => handleSearch(e)}
        />
    )
}

// dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
// dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
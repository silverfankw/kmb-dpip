import { useState, useRef, useEffect } from 'react'

export const Keypad = ({ isOpen, onClose, position }) => {
    const keypadRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (keypadRef.current && !keypadRef.current.contains(event.target)) {
                onClose()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [onClose])

    if (!isOpen) return null

    const buttons = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['0']
    ]

    return (
        <div
            ref={keypadRef}
            style={{
                position: 'fixed',
                top: position.top,
                zIndex: 3
            }}
            className="bg-[#18181b]/95 backdrop-blur-md p-4 rounded-xl border border-gray-600/90 shadow-2xl"
        >
            <div className="grid grid-cols-3 gap-2">
                {buttons.map((row, rowIndex) => (
                    <div key={rowIndex} className="col-span-3 flex gap-2">
                        {row.map((num) => (
                            <button
                                key={num}
                                className={`
                                    ${num === '0' ? 'col-span-3 w-full' : ''}
                                    bg-gray-800/80 hover:bg-gray-700/80
                                    text-white font-semibold
                                    rounded-lg p-3
                                    transition-all duration-200 ease-in-out
                                    active:scale-95 active:bg-blue-600/80
                                    min-w-[48px] h-[48px]
                                    flex items-center justify-center hover:cursor-pointer
                                `}
                                onClick={() => console.log(num)}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined'
import { RouteNumber, RouteDetails } from './DPIP/ControlPanel/RouteOption'
import { getAppTextConfig } from './sharedComponentConfig'
import '@styles/routeSearch/routeSearchKeypad.css'

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

const keypadText = {
    zh: {
        title: '搜尋路線', close: '關閉', clear: '清除', backspace: '刪除一字',
        numbers: '數字', letters: '可用字母',
    },
    en: {
        title: 'Search routes', close: 'Close', clear: 'Clear', backspace: 'Backspace',
        numbers: 'Numbers', letters: 'Available letters',
    },
}

export const RouteSearchKeypad = ({ options, language, uiMode, onSelect, onClose }) => {
    const dialogRef = useRef(null)
    const queryRef = useRef(null)
    const hasSelectedRouteRef = useRef(false)
    const titleId = useId()
    const [query, setQuery] = useState('')
    const text = keypadText[language === 'en' ? 'en' : 'zh']
    const appText = getAppTextConfig(language)
    const { matches, letters, nextCharacters } = useMemo(() => {
        const matchingOptions = options.filter(option => option.detail.route.toUpperCase().startsWith(query))
        const nextCharacters = new Set()
        matchingOptions.forEach(option => {
            const next = option.detail.route.toUpperCase()[query.length]
            if (next) nextCharacters.add(next)
        })
        return {
            matches: matchingOptions.slice(0, 50),
            letters: [...nextCharacters].filter(character => /^[A-Z]$/.test(character)).sort(),
            nextCharacters,
        }
    }, [options, query])

    const updateQuery = value => {
        setQuery(value)
        queryRef.current?.focus({ preventScroll: true })
    }

    useEffect(() => {
        const dialog = dialogRef.current
        const returnFocusTarget = document.activeElement
        dialog.showModal()
        return () => {
            dialog.close()
            if (returnFocusTarget instanceof HTMLElement) {
                returnFocusTarget.focus({ preventScroll: true })
                if (hasSelectedRouteRef.current) returnFocusTarget.blur()
            }
        }
    }, [])

    return (
        <dialog
            ref={dialogRef}
            className="route-search-keypad"
            data-theme={uiMode}
            aria-labelledby={titleId}
            onCancel={event => {
                event.preventDefault()
                onClose()
            }}
            onKeyDown={event => {
                event.stopPropagation()
                if (event.ctrlKey || event.metaKey || event.altKey) return
                if (/^[0-9a-z]$/i.test(event.key)) {
                    event.preventDefault()
                    const character = event.key.toUpperCase()
                    if (nextCharacters.has(character)) updateQuery(value => value + character)
                } else if (event.key === 'Backspace') {
                    event.preventDefault()
                    updateQuery(value => value.slice(0, -1))
                }
            }}
        >
            <header className="route-search-keypad__header">
                <h2 id={titleId}>{text.title}</h2>
                <button type="button" onClick={onClose}>{text.close}</button>
            </header>
            <div className="route-search-keypad__query">
                <input
                    ref={queryRef}
                    aria-label={text.title}
                    value={query}
                    placeholder={appText.routeInputPlaceholder}
                    readOnly
                    inputMode="none"
                />
            </div>
            <div className="route-search-keypad__results" aria-label={text.title}>
                {matches.map(option => (
                    <button
                        key={option.value}
                        type="button"
                        className="route-search-keypad__result"
                        onClick={() => {
                            hasSelectedRouteRef.current = true
                            onSelect(option)
                        }}
                    >
                        <RouteNumber route={option.routeLabel} isSpecial={option.isSpecial} componentType="Option" isMobile />
                        <RouteDetails origin={option.originLabel} destination={option.destinationLabel} remark={option.specialRemarkLabel} />
                    </button>
                ))}
                {!matches.length && <p role="status">{appText.routeSearchNoResults}</p>}
            </div>
            <div className="route-search-keypad__keys">
                <div className="route-search-keypad__numbers" role="group" aria-label={text.numbers}>
                    {digits.map(digit => (
                        <button
                            key={digit}
                            type="button"
                            disabled={!nextCharacters.has(digit)}
                            onClick={() => updateQuery(value => value + digit)}
                        >{digit}</button>
                    ))}
                    <button
                        type="button"
                        className="route-search-keypad__clear"
                        disabled={!query}
                        onClick={() => updateQuery('')}
                    >{text.clear}</button>
                    <button
                        type="button"
                        disabled={!nextCharacters.has('0')}
                        onClick={() => updateQuery(value => value + '0')}
                    >0</button>
                    <button
                        type="button"
                        className="route-search-keypad__backspace"
                        aria-label={text.backspace}
                        disabled={!query}
                        onClick={() => updateQuery(value => value.slice(0, -1))}
                    ><BackspaceOutlinedIcon /></button>
                </div>
                <div className="route-search-keypad__letters" role="group" aria-label={text.letters}>
                    <div>
                        {letters.map(letter => (
                            <button key={letter} type="button" onClick={() => updateQuery(value => value + letter)}>{letter}</button>
                        ))}
                    </div>
                </div>
            </div>
        </dialog>
    )
}
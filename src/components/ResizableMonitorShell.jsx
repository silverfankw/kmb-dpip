import { useEffect, useRef, useState } from 'react'

export default function ResizableMonitorShell({ children, className, monitorId, label, enabled = true, aspectRatio = 5 / 3, startAtMaximum = false }) {
    const storageKey = `kmb-monitor-width-${monitorId}`
    const [width, setWidth] = useState(() => {
        try {
            const stored = localStorage.getItem(storageKey)
            if (stored === null) return null
            const value = Number(stored)
            if (!Number.isFinite(value) || value <= 0) throw new Error('Invalid saved monitor width')
            return value
        } catch (error) {
            console.error('Unable to restore monitor size:', error)
            return null
        }
    })
    const shellRef = useRef(null)
    const dragRef = useRef(null)
    const [bounds, setBounds] = useState({ min: 800, max: 1200 })

    useEffect(() => {
        const updateBounds = () => {
            const shell = shellRef.current
            setBounds({
                min: shell.querySelector('.monitor-resize__minimum').getBoundingClientRect().width,
                max: shell.querySelector('.monitor-resize__maximum').getBoundingClientRect().width,
            })
        }
        updateBounds()
        const observer = new ResizeObserver(updateBounds)
        observer.observe(shellRef.current.querySelector('.monitor-resize__minimum'))
        observer.observe(shellRef.current.querySelector('.monitor-resize__maximum'))
        window.addEventListener('resize', updateBounds)
        return () => {
            observer.disconnect()
            window.removeEventListener('resize', updateBounds)
        }
    }, [])

    const saveWidth = value => {
        try {
            localStorage.setItem(storageKey, String(value))
        } catch (error) {
            console.error('Unable to save monitor size:', error)
        }
    }
    const clamp = value => Math.min(bounds.max, Math.max(bounds.min, value))
    const currentWidth = clamp(width ?? (startAtMaximum ? bounds.max : bounds.min))
    const heightToWidth = 1 / aspectRatio
    const finishDrag = event => {
        if (!dragRef.current) return
        const value = clamp(dragRef.current.width)
        dragRef.current = null
        setWidth(value)
        saveWidth(value)
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
        }
    }

    return (
        <div ref={shellRef} className={`${className} monitor-resize${enabled ? ' monitor-resize--enabled' : ''}`}
            style={{
                '--monitor-width': width === null ? undefined : `${width}px`,
                '--monitor-default-width': startAtMaximum ? 'var(--monitor-max-width)' : 'var(--monitor-min-width)',
            }}>
            <span className="monitor-resize__minimum" aria-hidden="true" />
            <span className="monitor-resize__maximum" aria-hidden="true" />
            {children}
            {enabled && bounds.max > bounds.min && (
                <button type="button" className="monitor-resize__handle" role="slider"
                    aria-label={label} aria-valuemin={Math.round(bounds.min)} aria-valuemax={Math.round(bounds.max)}
                    aria-valuenow={Math.round(currentWidth)} aria-valuetext={`${Math.round(currentWidth)} × ${Math.round(currentWidth * heightToWidth)}`}
                    onPointerDown={event => {
                        if (event.button !== 0) return
                        event.preventDefault()
                        event.stopPropagation()
                        event.currentTarget.setPointerCapture(event.pointerId)
                        dragRef.current = {
                            x: event.clientX, y: event.clientY,
                            startWidth: currentWidth, width: currentWidth,
                        }
                    }}
                    onPointerMove={event => {
                        const drag = dragRef.current
                        if (!drag) return
                        const dx = event.clientX - drag.x
                        const dy = event.clientY - drag.y
                        const value = clamp(drag.startWidth + (dx + dy * heightToWidth) / (1 + heightToWidth ** 2))
                        drag.width = value
                        setWidth(value)
                    }}
                    onPointerUp={finishDrag} onPointerCancel={finishDrag} onLostPointerCapture={finishDrag}
                    onKeyDown={event => {
                        const changes = { ArrowLeft: -20, ArrowDown: -20, ArrowRight: 20, ArrowUp: 20 }
                        if (!(event.key in changes) && event.key !== 'Home' && event.key !== 'End') return
                        event.preventDefault()
                        event.stopPropagation()
                        const value = event.key === 'Home' ? bounds.min : event.key === 'End' ? bounds.max : clamp(currentWidth + changes[event.key])
                        setWidth(value)
                        saveWidth(value)
                    }} />
            )}
        </div>
    )
}

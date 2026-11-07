import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import './BusDisplay.css'

/**
 * @typedef {Object} Stop
 * @property {number} seq
 * @property {string} stopId
 * @property {string} nameZh
 * @property {string} [nameEn]
 * @property {string|string[]} [landmarksZh]
 * @property {number|null} [etaMin]
 */

/**
 * @typedef {Object} DisplayPayload
 * @property {string} route
 * @property {string} directionLabelZh
 * @property {string} directionLabelEn
 * @property {{surnameZh: string, nameEn: string, staffNo: string}} captain
 * @property {string} [now]
 * @property {number} currentSeq
 * @property {Stop[]} stops
 */

const clockFormat = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Hong_Kong', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
})
const STOP_PAGE_SIZE = 13
const DISPLAY_STAGE_INTERVAL = 10000
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value)
const isText = value => typeof value === 'string'

const renderDirectionLabel = (label, prefixPattern) => {
    if (!label) return '—'
    const prefix = label.match(prefixPattern)?.[0]
    return prefix ? <><span className="bus-display__direction-prefix">{prefix}</span>{label.slice(prefix.length)}</> : label
}

const validatePayload = payload => {
    if (!isRecord(payload) || !['route', 'directionLabelZh', 'directionLabelEn'].every(key => isText(payload[key])) ||
        !isRecord(payload.captain) || !['surnameZh', 'nameEn', 'staffNo'].every(key => isText(payload.captain[key])) ||
        !Number.isInteger(payload.currentSeq) || !Array.isArray(payload.stops)) {
        throw new Error('Invalid display payload: expected route, destination, captain, currentSeq and stops.')
    }
    if (payload.now !== undefined && (!isText(payload.now) || !Number.isFinite(Date.parse(payload.now)))) {
        throw new Error('Invalid display payload: now must be a valid timestamp.')
    }
    const sequences = new Set()
    payload.stops.forEach(stop => {
        if (!isRecord(stop) || !Number.isInteger(stop.seq) || !isText(stop.stopId) || !isText(stop.nameZh) ||
            (stop.nameEn !== undefined && !isText(stop.nameEn)) ||
            (stop.landmarksZh !== undefined && !isText(stop.landmarksZh) &&
                !(Array.isArray(stop.landmarksZh) && stop.landmarksZh.every(isText))) ||
            (stop.etaMin != null && (!Number.isFinite(stop.etaMin) || stop.etaMin < 0)) ||
            sequences.has(stop.seq)) {
            throw new Error('Invalid display payload: each stop needs a unique sequence, ID, names and valid optional ETA/landmarks.')
        }
        sequences.add(stop.seq)
    })
    return payload
}

const StopList = memo(function StopList({ stops, currentSeq, showEnglishNames }) {
    const listRef = useRef(null)
    const [visibleCount, setVisibleCount] = useState(3)
    const currentIndex = stops.findIndex(stop => stop.seq >= currentSeq)
    const visibleStops = currentIndex < 0 ? [] : stops.slice(currentIndex, currentIndex + visibleCount)
    const firstSequence = visibleStops[0]?.seq

    useLayoutEffect(() => {
        const list = listRef.current
        const firstRow = list.firstElementChild
        if (!firstRow) return
        const updateVisibleCount = () => {
            const rowHeight = firstRow.getBoundingClientRect().height
            if (rowHeight > 0) setVisibleCount(Math.max(1, Math.ceil(list.clientHeight / rowHeight)))
        }
        updateVisibleCount()
        const observer = new ResizeObserver(updateVisibleCount)
        observer.observe(list)
        observer.observe(firstRow)
        return () => observer.disconnect()
    }, [firstSequence])

    return (
        <ol className="bus-display__stops" ref={listRef} aria-label="站點 / Stops">
            {visibleStops.map((stop, index) => {
                const current = index === 0
                const landmarks = Array.isArray(stop.landmarksZh) ? stop.landmarksZh.join('、') : stop.landmarksZh
                return (
                    <li key={stop.seq} className={`bus-display__stop${current ? ' bus-display__stop--current' : ''}`}
                        aria-current={current ? 'true' : undefined}>
                        <div className="bus-display__rail" aria-hidden="true">
                            {index < 2 && currentIndex + index < stops.length - 1 && <svg viewBox="0 0 50 28" fill="white">
                                <path d="M3 2 25 15 47 2v11L25 26 3 13Z" />
                            </svg>}
                        </div>
                        <span className="bus-display__badge"><span>{stop.seq}</span></span>
                        <div className="bus-display__stop-copy">
                            <strong className="bus-display__stop-name" title={stop.nameZh}>{stop.nameZh}</strong>
                            {showEnglishNames && stop.nameEn && <span className="bus-display__english-name" title={stop.nameEn}>{stop.nameEn}</span>}
                            {current && landmarks && <span className="bus-display__landmarks" title={landmarks}>{landmarks}</span>}
                        </div>
                        {!current && <div className="bus-display__eta"><strong>{stop.etaMin == null ? '—' : Math.round(stop.etaMin)}</strong><span>分鐘</span></div>}
                    </li>
                )
            })}
        </ol>
    )
})

const StopStages = memo(function StopStages({ stops, currentSeq, showEnglishNames }) {
    const sortedStops = useMemo(() => stops.slice().sort((a, b) => a.seq - b.seq), [stops])
    const currentIndex = sortedStops.findIndex(stop => stop.seq >= currentSeq)
    const remainingCount = currentIndex < 0 ? 0 : sortedStops.length - currentIndex
    const pageCount = Math.ceil(remainingCount / STOP_PAGE_SIZE)
    const [stage, setStage] = useState(0)
    const activeStage = Math.min(stage, pageCount)

    useEffect(() => {
        setStage(value => Math.min(value, pageCount))
        if (!pageCount) return
        const interval = setInterval(() => setStage(value => (value + 1) % (pageCount + 1)), DISPLAY_STAGE_INTERVAL)
        return () => clearInterval(interval)
    }, [pageCount])

    if (activeStage === 0) {
        return (
            <div className="bus-display__body" data-stage="detail">
                <div className="bus-display__list-heading">
                    <span className="bus-display__triangle" aria-hidden="true" />
                    <span className="bus-display__current-label">此站</span>
                    <div className="bus-display__estimate" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 2" />
                        </svg>
                        <span>預計</span>
                    </div>
                </div>
                <StopList stops={sortedStops} currentSeq={currentSeq} showEnglishNames={showEnglishNames} />
            </div>
        )
    }

    const pageStart = currentIndex + (activeStage - 1) * STOP_PAGE_SIZE
    const pageStops = sortedStops.slice(pageStart, pageStart + STOP_PAGE_SIZE)
    const hasMoreStops = pageStart + pageStops.length < sortedStops.length
    return (
        <div className="bus-display__overview" data-stage="overview">
            <div className="bus-display__overview-heading">
                <span className="bus-display__overview-pointer" aria-hidden="true" />
                <span lang="zh-Hant">{activeStage === 1 ? '此站' : null}</span>
                <span lang="en">{activeStage === 1 ? 'This stop' : null}</span>
                <span className="bus-display__page" aria-label="頁數 / Page">{activeStage}/{pageCount}</span>
            </div>
            <ol className={`bus-display__overview-stops${hasMoreStops ? ' bus-display__overview-stops--continues' : ''}`}
                aria-label="站點 / Stops" style={{ '--stop-page-size': STOP_PAGE_SIZE }}>
                {pageStops.map((stop, index) => {
                    const current = pageStart + index === currentIndex
                    return (
                        <li key={stop.seq} className="bus-display__overview-stop" aria-current={current ? 'true' : undefined}>
                            <span className="bus-display__overview-rail">
                                <span className="bus-display__overview-badge">{stop.seq}</span>
                            </span>
                            <span lang="zh-Hant" title={stop.nameZh}>{stop.nameZh}</span>
                            <span lang="en" title={stop.nameEn}>{stop.nameEn}</span>
                        </li>
                    )
                })}
            </ol>
        </div>
    )
})

const DisplayClock = memo(function DisplayClock({ serverTime, receivedAt }) {
    const [tick, setTick] = useState(Date.now)
    const anchor = useMemo(() => ({
        server: serverTime ? Date.parse(serverTime) : null,
        client: receivedAt ?? Date.now(),
    }), [serverTime, receivedAt])

    useEffect(() => {
        const interval = setInterval(() => setTick(Date.now()), 1000)
        return () => clearInterval(interval)
    }, [])

    const time = clockFormat.format(anchor.server === null ? tick : anchor.server + Math.max(0, tick - anchor.client))
    return (
        <div className="bus-display__clock">
            <span>現在時間</span><span lang="en">Time Now</span>
            <time>{time}</time>
        </div>
    )
})

/**
 * @param {{data?: DisplayPayload, endpoint?: string, pollMs?: number,
 * showEnglishNames?: boolean, showBezel?: boolean}} props
 */
export default function BusDisplay({ data, endpoint, pollMs = 15000, showEnglishNames = false, showBezel = false }) {
    const [remote, setRemote] = useState(null)
    const headerRef = useRef(null)
    const routeTextRef = useRef(null)
    const initial = useMemo(() => {
        if (data == null) return { payload: null, error: null }
        try {
            return { payload: validatePayload(data), error: null }
        } catch (error) {
            return { payload: null, error: error.message }
        }
    }, [data])
    const invalidPoll = endpoint && (!Number.isFinite(pollMs) || pollMs <= 0)
    const result = endpoint && remote?.endpoint === endpoint ? remote : null
    const payload = result?.payload ?? initial.payload
    const error = invalidPoll ? 'pollMs must be a positive number.' : result?.error || (!result?.payload && initial.error)
    const loading = Boolean(endpoint && !payload && !error)

    useLayoutEffect(() => {
        const header = headerRef.current
        const text = routeTextRef.current
        let active = true
        const fitRoute = () => {
            if (!active || !header.clientWidth || !text.scrollWidth) return
            const padding = header.clientWidth * 0.012
            const width = text.parentElement.clientWidth
            text.style.transform = `scaleX(${Math.min(0.94, (width - padding) / text.scrollWidth)}) scaleY(1.15)`
        }
        fitRoute()
        const observer = new ResizeObserver(fitRoute)
        observer.observe(header)
        document.fonts.ready.then(fitRoute)
        return () => {
            active = false
            observer.disconnect()
        }
    }, [payload?.route])

    useEffect(() => {
        if (!endpoint || invalidPoll) return
        let active = true
        let version = 0
        let latestSettled = 0
        const controllers = new Set()
        const fetchDisplay = async () => {
            const controller = new AbortController()
            controllers.add(controller)
            const requestVersion = ++version
            try {
                const response = await fetch(endpoint, { signal: controller.signal })
                if (!response.ok) throw new Error(`Display request failed: HTTP ${response.status}.`)
                const nextPayload = validatePayload(await response.json())
                if (active && requestVersion > latestSettled) {
                    latestSettled = requestVersion
                    setRemote({ endpoint, payload: nextPayload, receivedAt: Date.now(), error: null })
                }
            } catch (error) {
                if (!active || requestVersion < latestSettled || error.name === 'AbortError') return
                latestSettled = requestVersion
                setRemote(previous => ({
                    endpoint,
                    payload: previous?.endpoint === endpoint ? previous.payload : null,
                    receivedAt: previous?.endpoint === endpoint ? previous.receivedAt : null,
                    error: error.message,
                }))
            } finally {
                controllers.delete(controller)
            }
        }
        fetchDisplay()
        const interval = setInterval(fetchDisplay, pollMs)
        return () => {
            active = false
            controllers.forEach(controller => controller.abort())
            clearInterval(interval)
        }
    }, [endpoint, pollMs, invalidPoll])

    const hasStops = payload?.stops.some(stop => stop.seq >= payload.currentSeq)

    return (
        <section className={`bus-display${showBezel ? ' bus-display--bezel' : ''}`} aria-label="巴士乘客資訊 / Bus passenger information">
            <header className="bus-display__header" role="banner" ref={headerRef}>
                <div className="bus-display__route"><span ref={routeTextRef}>{payload?.route || '—'}</span></div>
                <div className="bus-display__destination">
                    <strong title={payload?.directionLabelZh}>{renderDirectionLabel(payload?.directionLabelZh, /^往\s*/)}</strong>
                    <span title={payload?.directionLabelEn}>{renderDirectionLabel(payload?.directionLabelEn, /^to\b\s*/i)}</span>
                </div>
                <div className="bus-display__captain">
                    <div className="bus-display__captain-name">
                        <span>{payload?.captain.surnameZh} 車長</span>
                        <span>Bus Captain {payload?.captain.nameEn}</span>
                    </div>
                    <div className="bus-display__staff">
                        <span>員工編號 <span lang="en">Staff No.</span></span>
                        <strong>{payload?.captain.staffNo || '—'}</strong>
                    </div>
                </div>
                <div className="bus-display__serving"><span>為您服務</span><span lang="en">is serving you</span></div>
                <DisplayClock serverTime={payload?.now} receivedAt={result?.payload ? result.receivedAt : null} />
            </header>
            {error && <p className="bus-display__error" role="alert">{error}</p>}
            {hasStops ? (
                <StopStages key={JSON.stringify([payload.route, payload.directionLabelZh, payload.directionLabelEn])}
                    stops={payload.stops} currentSeq={payload.currentSeq} showEnglishNames={showEnglishNames} />
            ) : (
                <div className="bus-display__body" aria-busy={loading}>
                    <div className="bus-display__empty" role="status">
                        <span>{loading ? '正在載入站點… / Loading stops…' : '暫無站點資料 / No stop information'}</span>
                    </div>
                </div>
            )}
        </section>
    )
}

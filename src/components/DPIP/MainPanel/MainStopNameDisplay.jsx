import { memo, useCallback, useEffect, useLayoutEffect, useRef } from "react"
import { HoldHandrailNotice, MindDoorNotice } from '@components/DPIP'
import {
    FIRST_STOP_WELCOME_ZH,
    FIRST_STOP_WELCOME_EN,
    STOP_NAME_ZH_SAFE_WIDTH_RATIO,
    STOP_NAME_EN_SAFE_SIZE_RATIO,
    getStopNameZhBaseFontSize,
} from './mainPanelConfig'

// Heading-only stage changes do not need to remeasure stop names.
export const MainStopNameDisplay = memo(function MainStopNameDisplay({
    stop, isFirstStop, language = 'zh', showHandrailNotice, showMindDoorNotice,
}) {
    const containerRef = useRef(null)
    const zhRef = useRef(null)
    const enRef = useRef(null)
    const zh = isFirstStop ? FIRST_STOP_WELCOME_ZH : stop?.zh
    const en = isFirstStop ? FIRST_STOP_WELCOME_EN : stop?.en
    const Notice = isFirstStop ? null
        : showHandrailNotice ? HoldHandrailNotice
            : showMindDoorNotice ? MindDoorNotice : null

    const fitChineseName = useCallback(() => {
        const container = containerRef.current
        const text = zhRef.current
        if (!container || !text || text.style.display === "none" || !text.scrollWidth) return

        const { paddingLeft, paddingRight } = window.getComputedStyle(container)
        const availableWidth = Math.max(
            (container.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight)) * STOP_NAME_ZH_SAFE_WIDTH_RATIO,
            0
        )
        const transform = `scaleX(${Math.min(1, availableWidth / text.scrollWidth)})`
        if (text.style.transform !== transform) text.style.transform = transform
    }, [])

    const fitEnglishName = useCallback(() => {
        const container = containerRef.current
        const text = enRef.current
        if (!container?.clientWidth || !container.clientHeight || !text || text.style.display === "none") return

        // Measure at the CSS size first, preserving wrapping for long names.
        text.style.fontSize = ""
        const { paddingLeft, paddingRight, paddingTop, paddingBottom } = window.getComputedStyle(container)
        const textStyle = window.getComputedStyle(text)
        const availableWidth = (container.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight)) * STOP_NAME_EN_SAFE_SIZE_RATIO
        const availableHeight = (container.clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom)) * STOP_NAME_EN_SAFE_SIZE_RATIO
        const width = text.scrollWidth
        const height = text.getBoundingClientRect().height
        if (!width || !height || height > parseFloat(textStyle.lineHeight) + 1) return

        const scale = Math.min(availableWidth / width, availableHeight / height)
        if (scale > 1) text.style.fontSize = `${parseFloat(textStyle.fontSize) * scale}px`
    }, [])

    const fitNames = useCallback(() => {
        fitChineseName()
        fitEnglishName()
    }, [fitChineseName, fitEnglishName])

    useLayoutEffect(() => {
        fitNames()
    }, [fitNames, zh, en, Notice, language])

    useEffect(() => {
        if (Notice) return

        // One observer handles both resize fitting and language visibility changes.
        const observer = new ResizeObserver(fitNames)
        for (const element of [containerRef.current, zhRef.current, enRef.current]) {
            if (element) observer.observe(element)
        }
        return () => observer.disconnect()
    }, [fitNames, Notice])

    return (
        <div ref={containerRef} className="main-display-panel__stop-name">
            {Notice ? (
                <Notice
                    zhNameOverrideStyle="main-display-panel__notice-zh"
                    enNameOverrideStyle="main-display-panel__notice-en"
                />
            ) : (
                <>
                    <span
                        ref={zhRef}
                        className="main-display-panel__stop-name-zh"
                        lang="zh-Hant"
                        style={{
                            "--stop-name-zh-font-size": `${getStopNameZhBaseFontSize(zh)}cqw`,
                            display: language === 'zh' ? 'block' : 'none',
                        }}
                    >
                        {zh}
                    </span>
                    <span
                        ref={enRef}
                        className="main-display-panel__stop-name-en"
                        lang="en"
                        style={{ display: language === 'en' ? 'block' : 'none' }}
                    >
                        {en}
                    </span>
                </>
            )}
        </div>
    )
})

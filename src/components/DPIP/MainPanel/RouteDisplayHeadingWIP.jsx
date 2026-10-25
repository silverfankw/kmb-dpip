import { useSelector } from "react-redux"
import { TripleArrow } from "@components"


const styles = {
    header: {
        alignItems: "center",
        boxSizing: "border-box",
        containerType: "inline-size",
        display: "flex",
        overflow: "hidden",
        width: "100%",
        gap: "1%",
    },
    headerLeft: {
        alignItems: "flex-start",
        display: "flex",
        flex: "1 1 0",
        gap: "5%",
        minWidth: 0,
        // transform: "translateY(5%)",
    },
    routeLabels: {
        alignItems: "center",
        display: "flex",
        flex: "1 1 0",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        minWidth: 0,
    },
    routeChineseLabel: {
        lineHeight: 1.1,
        whiteSpace: "nowrap",
    },
    routeEnglishLabel: {
        fontSize: "4cqw",
        letterSpacing: "-0.04em",
        lineHeight: 0.9,
        marginTop: "4%",
        whiteSpace: "nowrap",
    },
    routeNumber: {
        alignSelf: "flex-start",
        containerType: "inline-size",
        display: "flex",
        flex: "1 1 0",
        justifyContent: "center",
        lineHeight: 1,
        margin: "0 0.5%",
        minWidth: 0,
        overflow: "hidden",
        // transformOrigin: "center",
        // textAlign: "center",
    },
    routeNumberText: {
        fontWeight: 450,
        lineHeight: 1,
        transform: "scaleY(1.1)",
        transformOrigin: "top center",
        whiteSpace: "nowrap",
    },
    chevrons: {
        display: "block",
        flex: "0 0 33.333333%",
        flexShrink: 0,
        minWidth: "33.333333%",
        // transform: "scaleY(1.2)",
    },
    destinationSection: {
        boxSizing: "border-box",
        display: "flex",
        flex: "0 0 60%",
        flexDirection: "column",
        justifyContent: "center",
        minWidth: 0,
    },
    destinationChinese: {
        fontWeight: 500,
        fontSize: "5.5cqw",
        lineHeight: 1.02,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    destinationEnglish: {
        transform: "scaleY(1.05)",
        lineHeight: 1.2,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
}

const getRouteNumberFontSize = (routeNumber) => {
    const characterCount = Math.max(routeNumber.length, 1)

    return `${Math.min(60, 160 / characterCount)}cqw`
}

export const RouteDisplayHeadingWIP = () => {
        const { routeDetail, lastStopIndex, } = useSelector(state => state.routeSelection)
    const routeNumber = routeDetail?.route ?? ""

    return (
        <div
            style={styles.header}
        >
            <div style={styles.headerLeft}>
                <div style={styles.routeLabels}>
                    <span style={styles.routeChineseLabel}>路線</span>
                    <span style={styles.routeEnglishLabel}>Route</span>
                </div>
                <div style={styles.routeNumber}>
                    <span
                        style={{
                            ...styles.routeNumberText,
                            fontSize: getRouteNumberFontSize(routeNumber),
                        }}
                    >
                        {routeNumber}
                    </span>
                </div>
                <span aria-hidden="true" style={styles.chevrons}><TripleArrow /></span>
            </div>
            <div style={styles.destinationSection}>
                <span style={styles.destinationChinese}>{routeDetail?.stops?.[lastStopIndex]?.zh}</span>
                <span style={styles.destinationEnglish}>{routeDetail?.stops?.[lastStopIndex]?.en}</span>
            </div>
        </div>
    )
}

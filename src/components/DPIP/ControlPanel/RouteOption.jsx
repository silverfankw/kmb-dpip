import { useMemo } from "react"
import { useWindowSize, useRouteTypeStyle } from "@hooks"
import { itemSeparator, toSeparator } from "@utils"

export const RouteNumber = ({ route, isSpecial, componentType }) => {
    const { isMobile } = useWindowSize()
    const getRouteStyle = useRouteTypeStyle()

    const styles = useMemo(() => ({
        routeLabel: {
            display: componentType === "Option" ? "inline-flex" : "flex",
            flexDirection: componentType === "Option" ? "column" : "row",
            gap: componentType === "Option" ? 0 : "4px",
            width: componentType === "Option" ?
                isMobile ? "36px" : "52px" : "fit-content",
            alignItems: "center",
            justifyContent: "center",
            letterSpacing: "-0.25px",
            minWidth: isMobile ? "40px" : "52px",
            position: "relative",
        },
        specialTrip: {
            marginTop: "2px",
            fontSize: isMobile ? "10px" : "12px",
            padding: isMobile ? "1px 4px" : "2px 6px",
            border: "1px solid rgba(8, 28, 81, 1)",
            borderRadius: "4px",
            backgroundColor: "rgba(255, 214, 0, 0.75)",
            color: "#000",
            lineHeight: 1.1,
            maxWidth: "100%",
            textAlign: "center",
        }
    }), [isMobile, componentType])


    return (
        <div style={styles.routeLabel}>
            <span style={getRouteStyle(route)}>{route}</span>
            {isSpecial && (
                <span style={styles.specialTrip}>特別班</span>
            )}
        </div>
    )
}

export const RouteDetails = ({ origin, destination, remark }) => {
    const { isMobile } = useWindowSize()

    const styles = useMemo(() => ({
        wrapper: {
            display: "inline-flex",
            letterSpacing: isMobile ? "0" : "0.25px",
            alignItems: "center",
            gap: isMobile ? "4px" : "8px",
            minWidth: 0,
            flexWrap: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
        },
        special: {
            fontSize: isMobile ? "12px" : "15px",
            textAlign: "center",
            maxWidth: isMobile ? "120px" : "none",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
        },
        to: {
            fontSize: isMobile ? "10px" : "14px",
            marginTop: "1.5px",
            fontWeight: 400,
        }
    }), [isMobile])

    return (
        <>
            <span>{itemSeparator}</span>
            <div style={styles.wrapper}>
                {origin}
                <span style={styles.to}>{toSeparator}</span>
                {destination}
            </div>
            <span>{itemSeparator}</span>

            {remark && (
                <span style={styles.special}>
                    {remark}
                </span>
            )}
        </>
    )
}
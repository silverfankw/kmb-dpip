import { useMemo } from "react"
import { useWindowSize, useRouteTypeStyle } from "@hooks"
import { toSeparator } from "@utils"

const ItemSeparator = () => (
    <div className="
        relative
        h-[70%] w-[2px]
        bg-gradient-to-b from-gray-400/80 via-gray-300 to-gray-400/80
        rounded-full
        mx-1
        self-center
    "/>
)

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
            transform: "scale(1, 1.1)",
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
            flexDirection: "column",
            letterSpacing: isMobile ? "0" : "0.25px",
            gap: "2px",
            minWidth: 0,
        },
        detail: {
            display: "flex",
            alignItems: "center",
            gap: "6px",
        },
        special: {
            fontSize: isMobile ? "10px" : "12px",
        },
        to: {
            fontSize: isMobile ? "10px" : "14px",
            marginTop: "1.5px",
            fontWeight: 400,
        }
    }), [isMobile])

    return (
        <>
            <ItemSeparator />
            <div style={styles.wrapper}>
                <div style={styles.detail}>
                    {origin}
                    <span style={styles.to}>{toSeparator}</span>
                    {destination}
                </div>
                {remark && (
                    <div style={styles.special}>
                        <span>{remark}</span>
                    </div>
                )}
            </div>
        </>
    )
}
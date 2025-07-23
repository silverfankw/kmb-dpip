import { useMemo } from 'react'
import { useWindowSize } from "@hooks"

const routeTypeColors = {
    regular: {},
    xhtEhc: { backgroundColor: "#CF0001" },
    marathon: { backgroundColor: "#CF0001" },
    whc: { backgroundColor: "#027233" },
    airport: { backgroundColor: "#0A2163", color: "#E3D026" },
    external: { backgroundColor: "#ff5000" },
    overnight: { backgroundColor: "#000000" },
    airportOvernight: { backgroundColor: "#000000", color: "#DED702" },
    premier: { backgroundColor: "#E5B034" },
    shuttle: { backgroundColor: "#EB5136", color: "#0E2775" },
    disneyRecreational: { backgroundColor: "#146FD1" },
    r8: { backgroundColor: "#72C8E5", color: "#1C2EB5" },
    awe: { backgroundColor: "#6F2F9F" },
}

const routeTypeRules = [
    // Routes that is matched with following rule, but to filter out as regular route
    { type: "regular", regex: /^(331)[S]?/ },

    // Route that passed by Cross Harbour Tunnel or Eastern Harbour Crossing:
    // With route prefix '1', '3' or '6', followed by 2 subsequent digits, 
    // and an optional english letter at the end
    { type: "xhtEhc", regex: /^[136]\d{2}[A-Z]?$/ },

    // Route that passed by Western Harbour Crossing:
    // With route prefix '9', followed by 2 subsequent digits, 
    // and an optional english letter at the end
    // Excluding Sun Bus routes 917, 918 & 945
    { type: "whc", regex: /^9(?!17|18|45$)\d{2}[A-Z]?$/ },

    // Overnight routes: with route prefix 'N' 
    // including late night 270S, 271S & 293S, rule excluding 'NA' routes
    { type: "overnight", regex: /^(N(?!A)[A-Z0-9]+|270S|271S|293S)$/i },

    // Airport routes: with route prefix 'A'
    { type: "airport", regex: /^A/ },

    // Overnight airport routes: with route prefix 'NA'
    { type: "airportOvernight", regex: /^NA/ },

    // North Lantau external routes: with route prefix 'E'
    { type: "external", regex: /^E/ },

    // Shuttle routes for Airport area: with route prefix 'S'
    // Rule excluding potential matches for potential 'SP' KaiTakSportPark Route
    { type: "shuttle", regex: /^S(?!P)/ },

    // Premier routes: only P960 & P968
    { type: "premier", regex: /^P96[08]$/ },

    // Disneyland recreational route: only R33 & R42
    { type: "disneyRecreational", regex: /^R(33|42)$/i },

    // Disneyland - Lantau Link BBI shuttle route: only R8
    { type: "r8", regex: /^R8$/i },

    // Special service route only for Marathon participants,
    // With route prefix R, and followed by its original route number
    { type: "marathon", regex: /^R(108|307|603|673|678|680|934|936|948|960|961|968)$/i },

    // AsiaWorld-Expo event route with route prefix 'X'
    // Only X33, X36, X40, X43, X47
    { type: "awe", regex: /^X(33|36|40|43|47)$/i },
]

export const useRouteTypeStyle = () => {
    const { isMobile } = useWindowSize()

    const getSizeCategory = useMemo(() => {
        if (isMobile) return 'mobile'
        return 'desktop'
    }, [isMobile])

    const sharedStyle = useMemo(() => ({
        display: "inline-block",
        textAlign: "center",
        color: "#FFFFFF",
        width: isMobile ? "42px" : "52px",
        borderRadius: "2px",
        fontWeight: 700
    }), [isMobile])

    const routeTypeStyle = useMemo(() => ({
        ...routeTypeColors,
        shared: sharedStyle
    }), [sharedStyle])

    // Memoize the style cache
    const styleCache = useMemo(() => new Map(), [])

    // Memoize the getStyle function
    const getStyle = useMemo(() => {
        return (route) => {

            const cacheKey = `${route}-${getSizeCategory}`

            if (styleCache.has(cacheKey)) {
                return styleCache.get(cacheKey)
            }

            const styleResult = routeTypeRules.find(rule => rule.regex.test(route))
            const style = {
                ...routeTypeStyle.shared,
                ...routeTypeStyle[styleResult?.type ?? "regular"]
            }

            styleCache.set(route, style)
            return style
        }
    }, [routeTypeStyle, styleCache, getSizeCategory])

    return getStyle
}
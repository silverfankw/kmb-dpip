import { useMemo } from 'react'
import { useWindowSize } from "@hooks"
import { useSelector } from 'react-redux'

const routeTypeConfig = {
    kmb: {
        // Routes that is matched with following rule, but to filter out as regular route
        regular: { regex: /^(331)[S]?/, style: {} },

        // Route that passed by Cross Harbour Tunnel or Eastern Harbour Crossing:
        // With route prefix '1', '3' or '6', followed by 2 subsequent digits, and an optional english letter at the end
        xhtEhc: { regex: /^[136]\d{2}[A-Z]?$/, style: { backgroundColor: "#CF0001" } },

        // Route that passed by Western Harbour Crossing:
        // With route prefix '9', followed by 2 subsequent digits, and an optional english letter at the end
        // Excluding Sun Bus routes 917, 918 & 945
        whc: { regex: /^9(?!17|18|45$)\d{2}[A-Z]?$/, style: { backgroundColor: "#027233" } },

        // Overnight routes: with route prefix 'N' 
        // including late night 270S, 271S & 293S, rule excluding 'NA' routes
        overnight: { regex: /^(N(?!A)[A-Z0-9]+|270S|271S|293S)$/i, style: { backgroundColor: "#000000" } },

        // Airport routes: with route prefix 'A'
        airport: { regex: /^A/, style: { backgroundColor: "#0A2163", color: "#FFFF00" }, preserveLightText: true },

        // Overnight airport routes: with route prefix 'NA'
        airportOvernight: { regex: /^NA/, style: { backgroundColor: "#000000", color: "#DED702" }, preserveLightText: true },

        // North Lantau external routes: with route prefix 'E'
        external: { regex: /^E/, style: { backgroundColor: "#ff5000" } },

        // Shuttle routes for Airport area: with route prefix 'S'
        // Rule excluding potential matches for 'SP' KaiTakSportPark Route
        shuttle: { regex: /^S(?!P)/, style: { backgroundColor: "#EB5136", color: "#0E2775" }, preserveLightText: true },

        // Premier routes: only P960 & P968
        premier: { regex: /^P96[08]$/, style: { backgroundColor: "#E5B034" } },

        // Disneyland recreational route: only R33 & R42
        disneyRecreational: { regex: /^R(33|42)$/i, style: { backgroundColor: "#146FD1" } },

        // Disneyland - Lantau Link BBI shuttle route: only R8
        r8: { regex: /^R8$/i, style: { backgroundColor: "#72C8E5", color: "#1C2EB5" }, preserveLightText: true },

        // Special service route only for Marathon participants,
        // With route prefix R, and followed by its original route number
        marathon: { regex: /^R(108|307|603|673|678|680|934|936|948|960|961|968)$/i, style: { backgroundColor: "#CF0001" } },

        // AsiaWorld-Expo event route with route prefix 'X'
        // Only X33, X36, X40, X43, X47
        awe: { regex: /^X(33|36|40|43|47)$/i, style: { backgroundColor: "#6F2F9F" } },
    },
    ctb: {
        // Routes that is matched with following rule, but to filter out as regular route
        regular: { style: { backgroundColor: "#0059BD", color: "#FFFFFF" } },

        // Route that passed by Cross Harbour Tunnel or Eastern Harbour Crossing:
        // With route prefix '1', '3' or '6', followed by 2 subsequent digits, and an optional english letter at the end
        // Exclude 629, 629M, 347, 388 and 389
        xhtEhc: { regex: /^(?!629M?$|347$|38[89]$)[136]\d{2}[A-Z]?$/, style: { backgroundColor: "#CF0001" } },

        // Route that passed by Western Harbour Crossing:
        // With route prefix '9', followed by 2 subsequent digits, and an optional english letter at the end
        // Include B13 and B13S
        whc: { regex: /^(X?9\d{2}[A-Z]?|B13S?)$/, style: { backgroundColor: "#009140" } },

        // Overnight routes with prefix 'N', excluding 'NA'
        overnight: { regex: /^N(?!A)/, style: { backgroundColor: "#000000", color: "#FFFF00" } },

        // Airport routes with prefix 'A', optionally preceded by 'N'
        airport: {regex: /^N?A/i, style: { backgroundColor: "#BB2B44" } },

        // Route 88R
        r88r: {regex: /^88R$/, style: { backgroundColor: "#CF0001" } },

        // Route R8
        r8: { regex: /^R8$/, style: { backgroundColor: "#72C8E5", color: "#1C2EB5" }, preserveLightText: true },

        // Route H0
        h0: {regex: /\bH0\b/, style: { backgroundColor: "#F78325" } },

        // Route H1
        h1: {regex: /\bH1\b/, style: { backgroundColor: "#00BC0F" } },

        // Route H2
        h2: {regex: /\bH2\b/, style: { backgroundColor: "#DB1C58" } },

        // Route H2K
        h2k: { regex: /\bH2K\b/, style: { backgroundColor: "#471C36" } },

        // Route H3 and H4
        h3h4: {regex: /\bH[34]\b/, style: { backgroundColor: "#679AD1" } },

        // Route H20
        h20: {regex: /\bH20\b/, style: { backgroundColor: "#25435F" } },

        // Peak routes with prefix '15' or 'X15'
        peak: { regex: /\b(15[BC]?|X15)\b/, style: { backgroundColor: "#3CC3D9" } },

        // External Kowloon routes with prefix 'E21', 'E22', 'E23', or 'E28'
        externalKowloon: {regex: /\b(E21[ABCDX]?|E22[ACPSX]?|E23A?|E28)\b/, style: { backgroundColor: "#BF231E" }},

        // External Island routes with prefix 'E', excluding External Kowloon routes
        externalIsland: { regex: /^E/, style: { backgroundColor: "#009140" } },

        // Port routes with prefix B, exclude B13 & B13S
        border: { regex: /^(B3[AMX]?|B5|B7X?|B8|B14|B15)$/, style: { backgroundColor: "#CF0001" } }
    },
}

export const useRouteTypeStyle = (operator = 'kmb') => {
    const { isMobile } = useWindowSize()
    const uiMode = useSelector(state => state.userPreference.uiMode)
    if (!Object.hasOwn(routeTypeConfig, operator)) {
        throw new Error(`Unsupported route style operator: ${operator}`)
    }

    return useMemo(() => {
        const isLightMode = uiMode === "light"
        const baseStyle = {
            display: 'inline-block',
            textAlign: 'center',
            width: isMobile ? '42px' : '52px',
            borderRadius: '2px',
            fontWeight: 700,
        }
        const rules = Object.entries(routeTypeConfig[operator]).map(([type, rule]) => {
            const style = { ...baseStyle, ...rule.style }
            if (type === 'regular' && style.color == null) {
                style.color = isLightMode ? '#000000' : '#FFFFFF'
            } else if (type !== 'regular' && isLightMode && !rule.preserveLightText) {
                style.color = '#FFFFFF'
            }
            return { type, regex: rule.regex, style }
        })
        const regularStyle = rules.find(rule => rule.type === 'regular').style

        return (route = '') => rules.find(rule => rule.regex?.test(route))?.style ?? regularStyle
    }, [operator, isMobile, uiMode])
}

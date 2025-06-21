const styleCache = new Map()

const routeTypeStyle = {
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
    disneyRecreational: { backgroundColor: "#247DE2" },
    r8: { backgroundColor: "#72C8E5", color: "#1C2EB5" },
    shared: {
        fontSize: "18px",
        display: "inline-block",
        textAlign: "center",
        color: "#FFFFFF",   // default text color, will be replaced in setStyle func if required
        padding: "1px",
        width: "54px",
        borderRadius: "2px",
        fontWeight: 700
    }
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
    { type: "whc", regex: /^9\d{2}[A-Z]?$/ },

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
    { type: "marathon", regex: /^R(108|603|673|678|680|934|936|948|960|961|968)$/i },
]

export const getRouteTypeStyle = route => {

    if (styleCache.has(route)) {
        return styleCache.get(route)
    }

    const styleResult = routeTypeRules.find(rule => rule.regex.test(route))
    const style = { ...routeTypeStyle.shared, ...routeTypeStyle[styleResult?.type ?? "regular"] }
    styleCache.set(route, style)
    return style
}
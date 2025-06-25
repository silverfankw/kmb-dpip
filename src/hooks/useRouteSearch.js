import { useCallback } from "react"
import { createRouteOption } from "@utils"

export const useRouteSearch = (routes, onResultsFound) => {
    return useCallback((inputValue, callback) => {
        const filtered = !inputValue
            ? routes.slice(0, 50)
            : routes.filter(route =>
                route.route.toUpperCase().startsWith(inputValue.toUpperCase())
            )

        const results = filtered.map(createRouteOption)
        onResultsFound?.(results)
        callback(results)
    }, [routes, onResultsFound])
}
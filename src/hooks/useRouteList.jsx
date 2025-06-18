import { useEffect, useState } from "react"

export const useRouteList = () => {

    const [routeList, setRouteList] = useState(() => JSON.parse(localStorage.getItem("routeList")) || [])

    useEffect(() => {
        if (!routeList.length) {
            fetch("https://data.etabus.gov.hk/v1/transport/kmb/route/")
                .then(resp => resp.json())
                .then(json => {
                    localStorage.setItem("routeList", JSON.stringify(json.data))
                    setRouteList(json.data)
                })
        }
    }, [routeList.length])

    return routeList
}
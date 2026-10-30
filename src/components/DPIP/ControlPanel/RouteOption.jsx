import "@styles/routeSearch/routeOption.css"
import { useSelector } from 'react-redux'
import { useWindowSize, useRouteTypeStyle } from "@hooks"
import { getAppTextConfig } from '@components/sharedComponentConfig'
import { toSeparator } from "@utils"

const ItemSeparator = () => (
    <div className="route-option__separator" aria-hidden="true" />
)

const selectedBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '26px',
    width: '48px',
    borderRadius: '4px',
}

export const RouteNumber = ({ route, isSpecial, componentType, isMobile: isMobileProp, getRouteStyle: getRouteStyleProp }) => {
    const { language } = useSelector(state => state.userPreference)
    const { isMobile: responsiveIsMobile } = useWindowSize()
    const responsiveRouteStyle = useRouteTypeStyle()
    const isMobile = isMobileProp ?? responsiveIsMobile
    const getRouteStyle = getRouteStyleProp ?? responsiveRouteStyle
    const appText = getAppTextConfig(language)

    const routeBadgeStyle = {
        ...getRouteStyle(route),
        ...(componentType === 'SingleValue' && selectedBadgeStyle),
        fontSize: isMobile ? '15px' : '17px',
    }

    return (
        <div
            className="route-option__label"
            data-option={componentType === 'Option'}
            data-mobile={isMobile}
        >
            <span style={routeBadgeStyle}>{route}</span>
            {isSpecial && (
                <span className="route-option__special-trip">{appText.specialTrip}</span>
            )}
        </div>
    )
}

export const RouteDetails = ({ origin, destination, remark }) => {
    return (
        <>
            <ItemSeparator />
            <div className="route-option__details">
                <div className="route-option__journey">
                    <span className="route-option__origin">{origin}</span>
                    <span className="route-option__to">{toSeparator}</span>
                    <span className="route-option__destination">{destination}</span>
                </div>
                {remark && (
                    <div className="route-option__remark">{remark}</div>
                )}
            </div>
        </>
    )
}
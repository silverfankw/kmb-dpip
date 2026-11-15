import { useDispatch, useSelector } from 'react-redux'
import { getRoutesThunk } from '@store/routeSlice'
import { getAppTextConfig } from './sharedComponentConfig'
import '@styles/routeSearch/routeDataStatus.css'

export const RouteDataStatus = () => {
    const dispatch = useDispatch()
    const { dataStatus, error, isLoading } = useSelector(state => state.route)
    const language = useSelector(state => state.userPreference.language)
    const text = getAppTextConfig(language)
    if (!dataStatus && !error) return null

    const isFallback = dataStatus?.source === 'cache' || dataStatus?.source === 'snapshot'
    if (!isFallback && !dataStatus?.cacheWarning && !error) return null
    const retry = () => {
        dispatch(getRoutesThunk({ force: true })).catch(error => {
            console.error('Error retrying route data:', error)
        })
    }
    const savedAt = dataStatus?.savedAt

    return (
        <div className="route-data-status">
            <div role="status">
                <span>{error ? text.routeDataUnavailable
                    : dataStatus.source === 'snapshot' ? text.routeDataSnapshot
                        : dataStatus.source === 'cache' ? text.routeDataCached : text.routeDataOnline}</span>
                {savedAt && <span> · {text.routeDataSavedAt} <time dateTime={new Date(savedAt).toISOString()}>
                    {new Date(savedAt).toLocaleString(language === 'en' ? 'en-HK' : 'zh-HK')}
                </time></span>}
                {dataStatus?.refreshing && <span> · {text.routeDataRefreshing}</span>}
                {dataStatus?.refreshError && <span> · {text.routeDataRefreshFailed}</span>}
                {dataStatus?.cacheWarning && <span> · {text.routeDataCacheFailed}</span>}
            </div>
            <button type="button" disabled={isLoading || dataStatus?.refreshing} onClick={retry}>
                {text.routeDataRetry}
            </button>
        </div>
    )
}

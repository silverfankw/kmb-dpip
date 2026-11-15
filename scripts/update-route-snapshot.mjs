/* eslint-env node */
import { mkdir, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'

const server = await createServer({
    server: { middlewareMode: true, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
})
try {
    const { normalizeRouteData } = await server.ssrLoadModule('/src/utils/routeDataAdapters.js')
    const { routeStoreConfig } = await server.ssrLoadModule('/src/store/storeConfig.js')
    const response = await fetch(routeStoreConfig.routeDataUrl, { signal: AbortSignal.timeout(30000) })
    if (!response.ok) throw new Error(`Snapshot download failed: HTTP ${response.status}.`)
    const data = JSON.parse((await response.text()).replace(/:\s*NaN\b/g, ': null'))
    normalizeRouteData(data, 'kmb')
    normalizeRouteData(data, 'ctb')
    const directory = new URL('../public/data/', import.meta.url)
    await mkdir(directory, { recursive: true })
    await writeFile(new URL('route-stop-snapshot.json', directory), JSON.stringify({
        generatedAt: new Date().toISOString(),
        source: routeStoreConfig.routeDataUrl,
        data,
    }))
    console.log('Validated KMB/CTB snapshot saved to public/data/route-stop-snapshot.json.')
} finally {
    await server.close()
}

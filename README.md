
<a href="https://silverfankw.github.io/kmb-dpip/"><img src="https://img.shields.io/badge/Click_for_Project_Demo-blue?logo=googlechrome&logoColor=white&style=for-the-badge" alt="Button" /></a>


## Introduction
🚏 This project aims to simulate KMB Dynamic Passenger Information Panel (DPIP), displaying route destination and bus stops name.

👀 You can refer to the HK Bus Fandom article here for more detail: https://hkbus.fandom.com/wiki/%E5%8B%95%E6%85%8B%E5%B7%B4%E5%A3%AB%E7%AB%99%E9%A1%AF%E7%A4%BA%E5%B1%8F

This project is developed by React + Vite, Redux, tailwindCSS v4 & Material UI.

## Route data

Routes are loaded from [route_stop.json](https://raw.githubusercontent.com/silverfankw/hk-bus-route-stop/refs/heads/main/route_stop.json). The source groups route arrays and stop dictionaries by operator:

```text
routes.kmb / stops.kmb
routes.ctb / stops.ctb
```

The app currently loads and displays **KMB only**. The reusable [route data adapter](./src/utils/routeDataAdapters.js) also supports CTB for future development:

```js
import { normalizeRouteData } from './src/utils/routeDataAdapters.js'

const kmbRoutes = normalizeRouteData(payload) // Default operator: kmb
const ctbRoutes = normalizeRouteData(payload, 'ctb')
```

Both return routes with `operator`, `route`, `bound`, `service_type`, `orig_tc`, `orig_en`, `dest_tc`, `dest_en`, `specialRemark`, and ordered `stops: [{ id, zh, en }]`. CTB's `orig_zh`/`dest_zh` map to the canonical Chinese endpoint fields. Stop IDs stay strings, including leading zeroes. Route keys include the operator; existing saved selections without an operator are treated as KMB.

CTB has no source `service_type`, so its canonical value is `''` and it is not labeled as a KMB special trip. CTB routes with empty stop arrays are retained; future displays must handle a no-stops state. **CTB displays and an operator selector are not implemented yet.**

Malformed requested data and missing referenced stop names produce an explicit loading error. Only the requested operator and referenced stops are validated. All routes must provide a `stops` array. The KMB source uses `ORIG_EN` for R960's English origin; this alias is accepted only when `orig_en` is absent and does not hide an invalid standard field. The previous flat JSON format is no longer supported.

Build with `npm run build`.

## Versions
<ins>**Version 2</ins>🆕✨**
- Added features:
  1. A comprehensive, detailed bus stop progress bar, displaying more stop information in main panel
  2. Traditional compact bus stop progress bar & the new detailed bus stop progress bar will take turn switching display in preset interval
  3. Fullscreen mode (while keyboard shortcut navigation is available at the same time)
  4. Reorganize UI component Layout
- Code refactor to improve performance, readability and project structure
  
![image](https://github.com/user-attachments/assets/418d7a1b-e12f-4aa9-849d-cdd6aefee50c)


<ins>**Version 1.1**</ins>
- Added features:
  1. Enable hold handrail or door closing notification messages
  2. Customizable driver information
- Code revamp, Refactor all CSS to tailwind classes, Compatible responsive design in each element
  
![{A0508B16-F659-4249-A131-045E6F6AFF96}](https://github.com/user-attachments/assets/f93b9e7e-48d1-42f6-8ac7-a6a46e19a385)


<ins>**Version 1**</ins> 
- Basic function (Searchable route, navigate between next stop and previous stop, restart from first bus stop, switch route bound)
  
![kmb-dpip-preview](https://github.com/silverfankw/kmb-dpip/assets/36290205/5ebe8197-7bc4-4733-90ae-05605996ab06)

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { Provider } from 'react-redux'
import { store } from './store'

import App from './App.jsx'
import '@css/index.css'

// // Redux state log to validate redux state for each change
// store.subscribe(() => {
//   console.log(store.getState())
// })

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter
      future={
        {
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }
      }>
      <App />
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>
  ,
)

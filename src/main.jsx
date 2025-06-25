import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'

import { Provider } from 'react-redux'
import { store } from '@store'
import { theme } from '@theme'

import App from './App.jsx'
import '@styles/index.css'

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
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider >
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>
  ,
)

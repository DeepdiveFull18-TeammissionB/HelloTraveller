import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import OrderContext, { OrderContextProvider } from './context/OrderContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OrderContextProvider>
       <App />
    </OrderContextProvider>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {RouterProvider} from "react-router-dom"
import router from "./router.jsx"
import './index.css'
import {ContextProvider} from './contexts/ContextProvider.jsx'
import {AlertProvider} from "./contexts/AlertProvider.jsx";
import GlobalAlert from "./components/GlobalAlert.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
        <AlertProvider>
            <GlobalAlert />
            <RouterProvider router={router} />
        </AlertProvider>
    </ContextProvider>
  </StrictMode>
)

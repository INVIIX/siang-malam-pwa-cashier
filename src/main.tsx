import './assets/css/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './modules/auth/components/context/auth-context.tsx';
import { JSPMProvider } from './modules/printer/components/context/jspm-context.tsx';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
        <JSPMProvider>
          <App />
        </JSPMProvider>
    </AuthProvider>
  </StrictMode>,
)
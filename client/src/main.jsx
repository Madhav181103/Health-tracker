import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 🔥 Render Free Tier Wake-Up Ping
// Render spins down the backend after 15 min of inactivity (cold start = 30-60s delay).
// This fire-and-forget ping hits the server the moment the app loads, so by the time
// the user actually tries to use any feature, the server is already warm.
const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
if (BACKEND_URL) {
  fetch(`${BACKEND_URL}/`).catch(() => {}); // silent — never blocks the UI
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

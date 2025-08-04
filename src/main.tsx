import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App'

// Suppress browser extension errors
window.addEventListener('error', (event) => {
  if (event.message.includes('message channel closed') || 
      event.message.includes('listener indicated an asynchronous response')) {
    event.preventDefault();
    return;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('message channel closed') || 
      event.reason?.message?.includes('listener indicated an asynchronous response')) {
    event.preventDefault();
    return;
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

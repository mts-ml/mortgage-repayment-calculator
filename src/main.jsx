import { createRoot } from 'react-dom/client'
import App from './App'


// The '!' tells TypeScript that 'document.getElementById('root')' will never be null.
createRoot(document.getElementById('root')).render(
  <App />
)

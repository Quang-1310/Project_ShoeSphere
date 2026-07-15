import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { AuthInitializer } from './components/AuthInitializer.tsx'
import { store } from './redux/store/store.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthInitializer />
    </Provider>
  </StrictMode>,
)

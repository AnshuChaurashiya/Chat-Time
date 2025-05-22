import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ChatProvider from './context/ChatContext'; // ✅


createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <AuthProvider>
      <ChatProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </ChatProvider>
    </AuthProvider>
  </BrowserRouter>
)

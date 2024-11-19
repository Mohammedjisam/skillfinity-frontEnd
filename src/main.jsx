import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'; 
import store from './redux/store';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId='process.env.GOOGLE_CLIENT_ID'>
  <App />
  </GoogleOAuthProvider>
</Provider>,
)

import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';  
import AuthPage from './pages/AuthPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage/>}/>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App;

import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';  
import AuthPage from './pages/AuthPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import EditProfilePage from './pages/EditProfilePage';
import PublicLayout from './layouts/PublicLayout';
import RegisterForm from '../src/authForm/RegisterForm';
import LoginForm from '../src/authForm/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />

            <Route path="/auth" element={
              <PublicRoute>
                <AuthPage/>
              </PublicRoute>
            }>
              <Route index element={<Navigate to="/auth/login" replace/>} />
              <Route path="login" element={<LoginForm/>}/>
              <Route path="register" element={<RegisterForm/>}/>
            </Route>

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage/>
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <EditProfilePage/>
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App;

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthPage } from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import { Navbar } from './components/Navbar';
import Home from './pages/Home';
import DestinationPage from './pages/DestinationPage';
import ProfilePage from './pages/ProfilePage';
import { useAuth } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage isRegister />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
            <Route path="/destination/:id" element={<ConditionalDestinationPage />} />          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function ConditionalDestinationPage() {
  const { user } = useAuth();
  const location = useLocation();
  
  return user ? <DestinationPage /> : <Navigate to="/login" state={{ from: location }} replace />;
}

export default App;
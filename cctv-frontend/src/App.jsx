import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/homepage/HomePage';
import LoginPage from './pages/loginpage/LoginPage';
import SignupPage from './pages/signuppage/SignupPage';
import Dashboard from './pages/dashboard/Dashboard';
import LogoutPage from './pages/logoutpage/LogOutpage';
import ProtectedRoute from './components/protectedroute/ProtectedRoute';
import FootageArchive from './pages/footagearchive/FootageArchive';
import CamerasBySite from './pages/camerasbysite/CamerasBySite';  
import AddCamera from './pages/addcamera/AddCamera';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/logout" element={<LogoutPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* New routes for location-based cameras */}
      <Route
        path="/cameras"
        element={
          <ProtectedRoute>
            <CamerasBySite />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-camera"
        element={
          <ProtectedRoute>
            <AddCamera />
          </ProtectedRoute>
        }
      />

      {/* Footage archive route */}
      <Route
        path="/footage-archive"
        element={
          <ProtectedRoute>
            <FootageArchive />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

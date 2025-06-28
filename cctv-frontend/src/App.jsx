import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/homepage/HomePage';
import LoginPage from './pages/loginpage/LoginPage';
import SignupPage from './pages/signuppage/SignupPage';
import Dashboard from './pages/dashboard/Dashboard';
import LogoutPage from './pages/logoutpage/LogOutpage';
import ProtectedRoute from './components/protectedroute/ProtectedRoute';
import FootageArchive from './pages/footagearchive/FootageArchive';
import CamerasBySite from './pages/camerasbysite/CamerasBySite';
import AddCamera from './pages/addcamera/AddCamera';
import Sidebar from './components/sidebar/Sidebar';

function App() {
  const location = useLocation();
  const hideSidebarOn = ['/', '/login', '/signup'];
  const isSidebarVisible = !hideSidebarOn.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {isSidebarVisible && <Sidebar />}
      <main className={`${isSidebarVisible ? 'ml-64' : ''} transition-all p-6`}>
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
          <Route
            path="/footage-archive"
            element={
              <ProtectedRoute>
                <FootageArchive />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

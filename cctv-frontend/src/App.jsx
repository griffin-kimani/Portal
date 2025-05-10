import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/homepage/HomePage';
import LoginPage from './pages/loginpage/LoginPage';
import SignupPage from './pages/signuppage/SignupPage';
import Dashboard from './pages/dashboard/Dashboard';
import LogoutPage from './pages/logoutpage/LogOutpage';
import ProtectedRoute from './components/protectedroute/ProtectedRoute';

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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

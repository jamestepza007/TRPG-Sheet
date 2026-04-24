import { useEffect } from 'react';
import AudioSettings from './components/AudioSettings.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './hooks/useAuth.js';
import Navbar from './components/Navbar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CharacterPage from './pages/CharacterPage.jsx';
import CampaignPage from './pages/CampaignPage.jsx';
import PartyPage from './pages/PartyPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import CainCharacterPage from './pages/CainCharacterPage.jsx';
import CainGMSheet from './pages/CainGMSheet.jsx';

function ProtectedRoute({ children, roles }) {
  const { user, token, loading } = useAuthStore();

  // Still fetching user info — don't redirect yet
  if (loading) return null;

  if (!token || !user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { fetchMe, setLoading, token } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <Navbar />
      <AudioSettings />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/characters/cain/:id" element={<ProtectedRoute><CainCharacterPage /></ProtectedRoute>} />
        <Route path="/campaigns/cain/:id" element={<ProtectedRoute roles={['GM','ADMIN']}><CainGMSheet /></ProtectedRoute>} />
        <Route path="/characters/:id" element={<ProtectedRoute><CharacterPage /></ProtectedRoute>} />
        <Route path="/campaigns/:id" element={<ProtectedRoute roles={['GM','ADMIN']}><CampaignPage /></ProtectedRoute>} />
        <Route path="/party/:id" element={<ProtectedRoute><PartyPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

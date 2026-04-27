import { useEffect, useRef } from 'react';
import AudioSettings from './components/AudioSettings.jsx';
import { handleBgmSync } from './components/AudioSettings.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './hooks/useAuth.js';
import Navbar from './components/Navbar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CharacterPage from './pages/CharacterPage.jsx';
import CampaignPage from './pages/CampaignPage.jsx';
import PartyPage from './pages/PartyPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import CainCharacterPage from './pages/CainCharacterPage.jsx';
import CainGMSheet from './pages/CainGMSheet.jsx';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuthStore();
  const isAuthenticated = !!user;
  const isLoading = loading;
  if (isLoading) return <div style={{ textAlign: 'center', paddingTop: 80, color: '#555' }}>Loading…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { fetchMe, setLoading, token } = useAuthStore();
  const bgmSseRef = useRef(null);

  useEffect(() => {
    if (token) { fetchMe(); } else { setLoading(false); }
  }, []);

  // ── Global BGM Sync SSE — listens on every page ──────────────
  useEffect(() => {
    if (!token) { bgmSseRef.current?.close(); return; }

    const sseConnections = [];

    const connect = async () => {
      try {
        const { default: api } = await import('./utils/api.js');
        const res = await api.get('/parties/mine');
        const parties = Array.isArray(res.data) ? res.data : [];
        if (!parties.length) return;
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        // Connect to ALL parties
        parties.forEach(m => {
          const partyId = m?.party?.id;
          if (!partyId) return;
          const es = new EventSource(`${baseUrl}/sse/party/${partyId}?token=${token}`);
          sseConnections.push(es);
          es.onmessage = (e) => {
            try {
              const data = JSON.parse(e.data);
              if (data.type === 'bgm_sync') handleBgmSync(data);
            } catch {}
          };
          es.onerror = () => es.close();
        });
      } catch {}
    };

    connect();
    return () => sseConnections.forEach(es => es.close());
  }, [token]);

  return (
    <>
      <Navbar />
      <AudioSettings />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
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

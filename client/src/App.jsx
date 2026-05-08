import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyDecks from './pages/MyDecks';
import DeckDetail from './pages/DeckDetail';
import StudyMode from './pages/StudyMode';
import Explore from './pages/Explore';

const App = () => {
  const { token } = useAuth();
  const { pathname } = useLocation();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <div className={isAuthPage ? 'auth-layout' : 'app-layout'}>
      {!isAuthPage && token && <Sidebar />}
      <main className={isAuthPage ? '' : 'main-content'}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/decks" element={<ProtectedRoute><MyDecks /></ProtectedRoute>} />
          <Route path="/decks/:id" element={<ProtectedRoute><DeckDetail /></ProtectedRoute>} />
          <Route path="/study/:id" element={<ProtectedRoute><StudyMode /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
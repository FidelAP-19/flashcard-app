import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import MyDecks from './pages/MyDecks';
import DeckDetail from './pages/DeckDetail';
import StudyMode from './pages/StudyMode';
import Explore from './pages/Explore';

const App = () => {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/decks" 
      element={
        <ProtectedRoute>
          <MyDecks />
        </ProtectedRoute>
      } 
      />
      <Route path="/decks/:id" 
      element={
        <ProtectedRoute>
          <DeckDetail />
        </ProtectedRoute>
      }
      />
      <Route path="/study/:id"
      element={
        <ProtectedRoute>
          <StudyMode />
        </ProtectedRoute>
      } 
      />
            <Route path="/explore"
      element={
        <ProtectedRoute>
          <Explore />
        </ProtectedRoute>
      } 
      />
    </Routes>
    </>
  );
};

export default App;
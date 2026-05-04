import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav>
            <Link to="/">Flashcard App</Link>
            {user ? (
                <>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/decks">My Decks</Link>
                    <Link to="/explore">Explore</Link>
                    <span>Hello, {user.name}</span>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;
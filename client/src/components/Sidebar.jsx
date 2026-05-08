import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { to: '/decks',     icon: '▤',  label: 'My Decks' },
  { to: '/explore',   icon: '⊙',  label: 'Explore' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logoArea}>
        <div style={styles.logoMark}>⚡</div>
        <span style={styles.logoName}>Flashcard</span>
      </div>

      {/* Nav label */}
      <p style={styles.navLabel}>MENU</p>

      {/* Navigation */}
      <nav style={styles.nav}>
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            })}
          >
            <span style={styles.navIcon}>{icon}</span>
            <span>{label}</span>
            {/* active indicator dot */}
          </NavLink>
        ))}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* User section */}
      <div style={styles.userSection}>
        <div style={styles.userCard}>
          <div style={styles.avatar}>{initials}</div>
          <div style={styles.userInfo}>
            <p style={styles.userName}>{user?.name}</p>
            <p style={styles.userEmail}>{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <span>↪</span>
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: 'var(--sidebar-width)',
    background: 'var(--sidebar-bg)',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem 1rem',
    zIndex: 100,
    borderRight: '1px solid var(--sidebar-border)',
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    padding: '0 0.5rem',
    marginBottom: '2rem',
  },
  logoMark: {
    width: 36,
    height: 36,
    background: 'var(--accent)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
  },
  logoName: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.01em',
  },
  navLabel: {
    fontSize: '0.6875rem',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.25)',
    letterSpacing: '0.1em',
    padding: '0 0.75rem',
    marginBottom: '0.5rem',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.7rem 0.875rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--sidebar-text)',
    textDecoration: 'none',
    transition: 'background 0.15s ease, color 0.15s ease',
  },
  navItemActive: {
    background: 'var(--sidebar-active-bg)',
    color: 'var(--sidebar-active-text)',
    fontWeight: 600,
  },
  navIcon: {
    fontSize: '1rem',
    width: 20,
    textAlign: 'center',
  },
  userSection: {
    borderTop: '1px solid var(--sidebar-border)',
    paddingTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    padding: '0.5rem 0.625rem',
    borderRadius: 'var(--radius-sm)',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 999,
    background: 'var(--accent)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  userInfo: {
    overflow: 'hidden',
  },
  userName: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: '#e4e3f7',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userEmail: {
    fontSize: '0.7rem',
    color: 'var(--sidebar-text)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 0.875rem',
    background: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--sidebar-text)',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    width: '100%',
    transition: 'background 0.15s, color 0.15s',
    fontFamily: 'var(--font-body)',
  },
};

export default Sidebar;
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
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ fontWeight: 'bold', textDecoration: 'none' }}>Smart Lost & Found</Link>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {user ? (
          <>
            <Link to="/report-item">Report Item</Link>
            <Link to="/my-reports">My Reports</Link>
            <Link to="/dashboard">Dashboard</Link>
            <span>Hi, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
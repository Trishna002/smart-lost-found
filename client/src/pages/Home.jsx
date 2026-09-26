import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <h1>Smart Lost & Found System</h1>
      <p>Report and find lost items in your community.</p>
      {!user && (
        <div>
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </div>
      )}
      {user && <Link to="/report-item">Report an Item</Link>}
    </div>
  );
};

export default Home;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get('/dashboard');
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  const statCards = [
    { label: 'Total Lost Items', value: stats.totalLost },
    { label: 'Total Found Items', value: stats.totalFound },
    { label: 'Resolved/Claimed Items', value: stats.resolvedItems },
    { label: 'Active Reports', value: stats.activeReports },
    { label: 'Pending Claims Received', value: stats.pendingClaimsReceived },
  ];

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <h2>Welcome, {user?.name}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', margin: '1.5rem 0' }}>
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}
          >
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>{card.value}</p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#555' }}>{card.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/report-item">Report an Item</Link>
        <Link to="/my-reports">View My Reports</Link>
        <Link to="/">Browse All Items</Link>
      </div>
    </div>
  );
};

export default Dashboard;
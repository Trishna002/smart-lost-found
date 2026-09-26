import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import ItemCard from '../components/ItemCard';

const CATEGORIES = ['', 'Electronics', 'Documents', 'Accessories', 'Bags', 'Keys', 'Clothing', 'Other'];

const Home = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // filter state
  const [filters, setFilters] = useState({ search: '', type: '', category: '', location: '', status: '' });

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      // build query params, skipping empty values so we don't send ?type=&category=
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '')
      );
      const { data } = await axiosInstance.get('/items', { params });
      setItems(data);
    } catch (err) {
      setError('Failed to load items.');
    } finally {
      setLoading(false);
    }
  };

  // fetch on initial mount
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <h1>Smart Lost & Found System</h1>
      {!user && <p><Link to="/login">Login</Link> or <Link to="/register">Register</Link> to report an item.</p>}
      {user && <Link to="/report-item">+ Report an Item</Link>}

      <form onSubmit={handleSearch} style={{ margin: '1.5rem 0', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <input
          type="text"
          name="search"
          placeholder="Search by keyword..."
          value={filters.search}
          onChange={handleFilterChange}
        />
        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">All Types</option>
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
        </select>
        <select name="category" value={filters.category} onChange={handleFilterChange}>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat || 'All Categories'}</option>
          ))}
        </select>
        <input
          type="text"
          name="location"
          placeholder="Location..."
          value={filters.location}
          onChange={handleFilterChange}
        />
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Claimed">Claimed</option>
          <option value="Resolved">Resolved</option>
        </select>
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading items...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && items.length === 0 && <p>No items found.</p>}
      {items.map((item) => (
        <ItemCard key={item._id} item={item} />
      ))}
    </div>
  );
};

export default Home;
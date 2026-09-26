import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const MyReports = () => {
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // fetch items and received claims in parallel — independent requests, no need to wait sequentially
      const [itemsRes, claimsRes] = await Promise.all([
        axiosInstance.get('/items/my-reports'),
        axiosInstance.get('/claims/received'),
      ]);
      setItems(itemsRes.data);
      setClaims(claimsRes.data);
    } catch (err) {
      setError('Failed to load your reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item report?')) return;
    try {
      await axiosInstance.delete(`/items/${itemId}`);
      setActionMessage('Item deleted successfully.');
      fetchData(); // refresh the list
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Failed to delete item.');
    }
  };

  const handleClaimAction = async (claimId, status) => {
    try {
      await axiosInstance.put(`/claims/${claimId}`, { status });
      setActionMessage(`Claim ${status.toLowerCase()} successfully.`);
      fetchData(); // refresh both items (status may change) and claims
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Failed to update claim.');
    }
  };

  // group claims by item ID so we can show them under the right item
  const claimsByItem = claims.reduce((acc, claim) => {
    const itemId = claim.item?._id;
    if (!acc[itemId]) acc[itemId] = [];
    acc[itemId].push(claim);
    return acc;
  }, {});

  if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <h2>My Reports</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {actionMessage && <p style={{ color: 'green' }}>{actionMessage}</p>}

      {items.length === 0 && <p>You haven't reported any items yet. <Link to="/report-item">Report one now</Link>.</p>}

      {items.map((item) => {
        const itemClaims = claimsByItem[item._id] || [];
        return (
          <div key={item._id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
            <h3>{item.title} <span style={{ fontSize: '0.85rem', fontWeight: 'normal' }}>({item.type})</span></h3>
            <p>{item.description}</p>
            <p><strong>Status:</strong> {item.status} | <strong>Location:</strong> {item.location}</p>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Link to={`/items/${item._id}`}>View</Link>
              <Link to={`/edit-item/${item._id}`}>Edit</Link>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </div>

            {/* Claims received on this item */}
            {itemClaims.length > 0 && (
              <div style={{ marginTop: '1rem', borderTop: '1px dashed #ccc', paddingTop: '0.5rem' }}>
                <strong>Claims received ({itemClaims.length}):</strong>
                {itemClaims.map((claim) => (
                  <div key={claim._id} style={{ marginTop: '0.5rem', paddingLeft: '0.5rem' }}>
                    <p style={{ margin: 0 }}>
                      <strong>{claim.claimant?.name}</strong> ({claim.claimant?.email}) — <em>{claim.status}</em>
                    </p>
                    <p style={{ margin: '0.25rem 0' }}>"{claim.message}"</p>
                    {claim.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleClaimAction(claim._id, 'Approved')}>Approve</button>
                        <button onClick={() => handleClaimAction(claim._id, 'Rejected')}>Reject</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MyReports;
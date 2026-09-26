import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const ItemDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // claim form state
  const [claimMessage, setClaimMessage] = useState('');
  const [claimError, setClaimError] = useState('');
  const [claimSuccess, setClaimSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchItem = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/items/${id}`);
      setItem(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load item.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setClaimError('');
    setClaimSuccess('');
    setSubmitting(true);
    try {
      await axiosInstance.post('/claims', { itemId: id, message: claimMessage });
      setClaimSuccess('Claim submitted successfully! The reporter will review it.');
      setClaimMessage('');
    } catch (err) {
      setClaimError(err.response?.data?.message || 'Failed to submit claim.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  if (!item) return null;

  const imageUrl = item.image ? `http://localhost:5000${item.image}` : null;
  const isOwner = user && item.reportedBy?._id === user._id;

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h2>{item.title} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>({item.type})</span></h2>
      {imageUrl && (
        <img src={imageUrl} alt={item.title} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }} />
      )}
      <p>{item.description}</p>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Location:</strong> {item.location}</p>
      <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {item.status}</p>
      <p><strong>Reported by:</strong> {item.reportedBy?.name} ({item.reportedBy?.email})</p>

      {/* Claim section */}
      {!user && (
        <p>Please <a href="/login">login</a> to submit a claim for this item.</p>
      )}

      {user && isOwner && (
        <p style={{ fontStyle: 'italic' }}>This is your own reported item — you can manage claims on it from My Reports.</p>
      )}

      {user && !isOwner && item.status === 'Active' && (
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
          <h3>Claim this item</h3>
          {claimError && <p style={{ color: 'red' }}>{claimError}</p>}
          {claimSuccess && <p style={{ color: 'green' }}>{claimSuccess}</p>}
          {!claimSuccess && (
            <form onSubmit={handleClaimSubmit}>
              <textarea
                placeholder="Describe why this item belongs to you (e.g. identifying details)..."
                value={claimMessage}
                onChange={(e) => setClaimMessage(e.target.value)}
                required
                rows={3}
                style={{ width: '100%' }}
              />
              <button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Claim'}
              </button>
            </form>
          )}
        </div>
      )}

      {user && !isOwner && item.status !== 'Active' && (
        <p style={{ fontStyle: 'italic' }}>This item is already {item.status.toLowerCase()} and no longer accepting claims.</p>
      )}
    </div>
  );
};

export default ItemDetails;
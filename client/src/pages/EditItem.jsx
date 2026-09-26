import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const CATEGORIES = ['Electronics', 'Documents', 'Accessories', 'Bags', 'Keys', 'Clothing', 'Other'];

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null); // null until loaded
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await axiosInstance.get(`/items/${id}`);
        setFormData({
          title: data.title,
          description: data.description,
          category: data.category,
          type: data.type,
          location: data.location,
          date: data.date.split('T')[0], // convert ISO date to yyyy-mm-dd for the date input
          status: data.status,
        });
      } catch (err) {
        setError('Failed to load item.');
      } finally {
        setFetching(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (image) data.append('image', image);

      await axiosInstance.put(`/items/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/my-reports');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p style={{ textAlign: 'center' }}>Loading...</p>;
  if (error && !formData) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h2>Edit Item</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Type</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>
        </div>
        <div>
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} />
        </div>
        <div>
          <label>Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <div>
          <label>Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div>
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Claimed">Claimed</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        <div>
          <label>Replace Image (optional)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditItem;
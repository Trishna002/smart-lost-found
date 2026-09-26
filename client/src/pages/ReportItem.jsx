import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const CATEGORIES = ['Electronics', 'Documents', 'Accessories', 'Bags', 'Keys', 'Clothing', 'Other'];

const ReportItem = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    type: 'Lost',
    location: '',
    date: '',
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // single file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // FormData is required here because we're sending a file alongside text fields —
      // JSON cannot carry binary file data, only multipart/form-data can.
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (image) data.append('image', image);

      const response = await axiosInstance.post('/items', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate(`/items/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h2>Report a Lost or Found Item</h2>
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
          <label>Image (optional)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportItem;
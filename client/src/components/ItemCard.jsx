import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  const imageUrl = item.image ? `http://localhost:5000${item.image}` : null;

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {imageUrl && (
          <img src={imageUrl} alt={item.title} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
        )}
        <div style={{ flex: 1 }}>
          <h3>{item.title} <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>({item.type})</span></h3>
          <p>{item.description}</p>
          <p><strong>Category:</strong> {item.category} | <strong>Location:</strong> {item.location}</p>
          <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()} | <strong>Status:</strong> {item.status}</p>
          <Link to={`/items/${item._id}`}>View Details</Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('firebaseToken');
      const response = await axios.get('http://localhost:8000/api/favorites/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites(response.data);
    };
    fetchFavorites();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Favorilerim</h2>
      <div className="product-list">
        {favorites.map(product => (
          <Link key={product.id} to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="product-card">
              <img
                src={`http://localhost:8000${product.image}`}
                alt={product.title}
                className="product-image"
              />
              <h3>{product.title}</h3>
              <p>{product.price_per_day} ₺ / gün</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Favorites;

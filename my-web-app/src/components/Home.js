// src/components/Home.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import axios from 'axios';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8000/api';

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/`);
      setProducts(response.data);
    } catch (error) {
      console.error('Ürünleri çekerken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Yükleniyor...</p>;

  return (
    <div className="home-container">
      <div className="header">
        <Link to="/profile">
          <img src="/default_profile.png" alt="Profil" className="profile-icon" />
        </Link>
        <button onClick={() => navigate('/add-product')} className="add-product-button">
          Ürün Ekle
        </button>
      </div>

      <div className="product-list">
        {products.length === 0 ? (
          <p>Henüz ürün yok.</p>
        ) : (
          products.map(product => (
            <Link
              to={`/products/${product.id}`} // veya product.pk
              key={product.id}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="product-card">
                <img
                  src={product.image ? `http://localhost:8000${product.image}` : '/placeholder.png'}
                  alt={product.title}
                  className="product-image"
                />
                <h3>{product.title}</h3>
                <p>{product.price_per_day} ₺ / gün</p>
                <p style={{ fontSize: '14px', color: '#777' }}>{product.category}</p>
                <p style={{ fontSize: '13px', color: '#999' }}>
                  {new Date(product.created_at).toLocaleDateString()}
                </p>
              </div>

            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;

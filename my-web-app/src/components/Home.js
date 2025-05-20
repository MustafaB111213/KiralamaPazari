// src/components/Home.js
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Home.css';
import axios from 'axios';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { categoryName } = useParams();

  const API_URL = 'http://localhost:8000/api';

  const fetchProducts = async (search = '', category = '') => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products/`, {
        params: { search, category }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Ürünleri çekerken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(searchQuery, categoryName || '');
  }, [searchQuery, categoryName]);

  useEffect(() => {
    const onSearch = e => setSearchQuery(e.detail);
    window.addEventListener('globalSearch', onSearch);
    return () => window.removeEventListener('globalSearch', onSearch);
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Yükleniyor...</p>;

  return (
    <div className="home-container">
      <div className="product-list">
        {products.length === 0
          ? <p>Henüz ürün yok.</p>
          : products.map(product => (
              <Link
                to={`/products/${product.id}`}
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
                  <p style={{ fontSize: '14px', color: '#555' }}>{product.owner_name}</p>
                  <p style={{ fontSize: '14px', color: '#777' }}>{product.category}</p>
                  <p style={{ fontSize: '13px', color: '#999' }}>
                    {new Date(product.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}

export default Home;

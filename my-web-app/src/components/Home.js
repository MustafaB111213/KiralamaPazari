// src/components/Home.js
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Home.css';
import axios from 'axios';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const { categoryName } = useParams();

  const API_URL = 'http://localhost:8000/api';

  const fetchProducts = async (search = '', category = '') => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products/`, {
        params: { search, category },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Ürünleri çekerken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    const token = localStorage.getItem('firebaseToken');
    if (!token) return;

    try {
      const response = await axios.get(`${API_URL}/favorites/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const favoriteIds = response.data.map((item) => item.id);
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Favoriler alınamadı:', error);
    }
  };

  const toggleFavorite = async (itemId) => {
    const token = localStorage.getItem('firebaseToken');
    if (!token) return;

    try {
      await axios.post(
        `${API_URL}/favorites/toggle/`,
        { item_id: itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFavorites((prev) =>
        prev.includes(itemId)
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId]
      );
    } catch (error) {
      console.error('Favori işlemi hatası:', error);
    }
  };

  useEffect(() => {
    fetchProducts(searchQuery, categoryName || '');
    fetchFavorites(); // ✅ favorileri de getir
  }, [searchQuery, categoryName]);

  useEffect(() => {
    const onSearch = (e) => setSearchQuery(e.detail);
    window.addEventListener('globalSearch', onSearch);
    return () => window.removeEventListener('globalSearch', onSearch);
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Yükleniyor...</p>;

  return (
    <div className="home-container">
      <div className="product-list">
        {products.length === 0 ? (
          <p>Henüz ürün yok.</p>
        ) : (
          products.map((product) => {
            const isFavorited = favorites?.includes(product.id);
            return (
              <div key={product.id} className="product-card">
                <div style={{ position: 'absolute', top: 10, right: 10 }}>
                  <i
                    className={`fas fa-heart ${isFavorited ? 'favorited' : ''}`}
                    style={{
                      color: isFavorited ? 'red' : '#ccc',
                      cursor: 'pointer',
                      fontSize: '20px',
                    }}
                    onClick={() => toggleFavorite(product.id)}
                  ></i>
                </div>
                <Link
                  to={`/products/${product.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <img
                    src={
                      product.image
                        ? `http://localhost:8000${product.image}`
                        : '/placeholder.png'
                    }
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
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Home;

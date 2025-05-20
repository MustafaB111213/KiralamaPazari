// src/components/Profile.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import defaultProfile from '../assets/default_profile.png';
import axios from 'axios';

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://192.168.1.35:8000/api'; // Sunucu IP/port burada kalmalı

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('firebaseToken');
        if (!token) throw new Error('Token bulunamadı.');

        const response = await axios.get(`${API_URL}/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setProfile(response.data);
      } catch (error) {
        console.error('Profil çekme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('firebaseToken');
    navigate('/');
  };

  if (loading) {
    return <div style={styles.loading}>Yükleniyor...</div>;
  }

  if (!profile) {
    return <div style={styles.loading}>Profil bilgisi alınamadı.</div>;
  }

  return (
    <div style={styles.container}>
      <img src={defaultProfile} alt="Profil" style={styles.profileImage} />
      <h1>{profile.firstName} {profile.lastName}</h1>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Ortalama Puan:</strong> {profile.averageRating ? profile.averageRating.toFixed(1) : "Henüz puan yok"}</p>

      <h2 style={styles.sectionTitle}>Kiralık Ürünler</h2>
      <div style={styles.productList}>
        {profile.items && profile.items.length > 0 ? (
          profile.items.map((item) => (
            <Link key={item.id} to={`/products/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={styles.productCard}>
                <img
                  src={`http://localhost:8000${item.image}`}
                  alt={item.title}
                  style={{ width: '100%', borderRadius: '6px', marginBottom: '10px' }}
                />
                <h3>{item.title}</h3>
                <p>{item.price_per_day} ₺ / gün</p>
              </div>
            </Link>
          ))
        ) : (
          <p>Henüz ürün eklenmemiş.</p>
        )}
      </div>

      <button onClick={() => navigate('/add-product')} style={styles.addButton}>
        + Ürün Ekle
      </button>

      <button style={styles.button} onClick={handleLogout}>Çıkış Yap</button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '700px',
    margin: '50px auto',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  },
  profileImage: {
    width: '120px',
    height: '120px',
    borderRadius: '60px',
    objectFit: 'cover',
    marginBottom: '20px',
  },
  loading: {
    textAlign: 'center',
    marginTop: '50px',
    fontSize: '18px',
  },
  sectionTitle: {
    fontSize: '22px',
    marginTop: '30px',
    marginBottom: '20px',
  },
  productList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
  },
  productCard: {
    width: '150px',
    padding: '10px',
    border: '1px solid #eee',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Profile;

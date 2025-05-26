import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import defaultProfile from '../assets/default_profile.png';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:8000/api';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('firebaseToken');
        const res = await axios.get(`${API_URL}/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Profil çekme hatası:', err);
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

  const handleDelete = async (itemId) => {
    const confirmDelete = window.confirm("Ürünü silmek istediğinizden emin misiniz?");
    if (!confirmDelete) return;

    const token = localStorage.getItem('firebaseToken');
    try {
      await axios.delete(`${API_URL}/products/${itemId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(prev => ({
        ...prev,
        items: prev.items.filter(i => i.id !== itemId)
      }));
    } catch (err) {
      alert("Ürün silinemedi.");
    }
  };

  if (loading) return <div className="profile-loading">Yükleniyor...</div>;
  if (!profile) return <div className="profile-loading">Profil bilgisi alınamadı.</div>;

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <img src={defaultProfile} alt="Profil" className="profile-avatar" />
        <h2>{profile.firstName} {profile.lastName}</h2>
        <p className="email">{profile.email}</p>
        <p className="rating">Ortalama Puan: <strong>{profile.averageRating?.toFixed(1) || "Henüz puan yok"}</strong></p>
      </div>

      <div className="profile-section">
        <div className="section-header">
          <h3>Kiralık Ürünlerim</h3>
          <button className="btn add" onClick={() => navigate('/add-product')}>+ Ürün Ekle</button>
        </div>

        <div className="profile-product-list">
          {profile.items?.length > 0 ? profile.items.map((item) => (
            <div className="profile-product-card" key={item.id}>
              <img src={`http://localhost:8000${item.image}`} alt={item.title} />
              <h4>{item.title}</h4>
              <p>{item.price_per_day} ₺ / gün</p>
              <div className="product-actions">
                <Link to={`/products/${item.id}`} className="btn view">Görüntüle</Link>
                <Link to={`/edit-product/${item.id}`} className="btn edit">Düzenle</Link>
                <button onClick={() => handleDelete(item.id)} className="btn delete">Sil</button>
              </div>
            </div>
          )) : <p>Henüz ürün eklenmemiş.</p>}
        </div>

        <button className="btn logout" onClick={handleLogout}>Çıkış Yap</button>
      </div>
    </div>
  );
}

export default Profile;

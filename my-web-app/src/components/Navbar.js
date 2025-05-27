import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const ALL_CATEGORIES = [
  'Genel', 'Elektronik', 'Ev & Bahçe', 'Moda', 'Spor', 'Oyun',
  'Araçlar', 'Kamera', 'Kamp', 'Bisiklet', 'Müzik', 'Ofis', 'Diğer',
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hasUnread, setHasUnread] = useState(false);
  const API_URL = 'http://localhost:8000/api';

  useEffect(() => {
    const fetchChats = async () => {
      const token = localStorage.getItem('firebaseToken');
      if (!token) return;

      try {
        const res = await axios.get(`${API_URL}/chats/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const unread = res.data.some(chat => chat.unread);
        setHasUnread(unread);
      } catch (err) {
        console.error("Sohbetler alınamadı:", err);
      }
    };

    fetchChats();
    const interval = setInterval(fetchChats, 30000); // 30 saniyede bir kontrol
    return () => clearInterval(interval);
  }, []);

  if (location.pathname === '/') return null;

  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <Link to="/home" className="navbar-logo">
            <i className="fas fa-store logo-icon"></i>
            <span className="logo-text">Kiralama Pazarı</span>
          </Link>

          <input
            type="text"
            placeholder="Ürün ara..."
            className="navbar-search"
            onChange={(e) =>
              window.dispatchEvent(new CustomEvent('globalSearch', { detail: e.target.value }))
            }
          />
        </div>

        <div className="navbar-right">
          <Link to="/sepetim" title="Sepetim">
            <i className="fas fa-shopping-cart nav-icon"></i>
          </Link>
          <Link to="/favorilerim" title="Favorilerim">
            <i className="fas fa-heart nav-icon"></i>
          </Link>
          <Link to="/sohbetler" title="Mesajlar" className="nav-icon-wrapper">
            <i className="fas fa-envelope nav-icon"></i>
            {hasUnread && <span className="unread-dot"></span>}
          </Link>
          <i className="fas fa-bell nav-icon" title="Bildirimler"></i>
          <Link to="/profile" title="Profil">
            <i className="fas fa-user-circle nav-icon"></i>
          </Link>
          <Link to="/add-product" title="Ürün Ekle">
            <i className="fas fa-plus-circle nav-icon"></i>
          </Link>
        </div>
      </div>

      <div className="navbar-categories">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className="category-button"
            onClick={() => navigate(`/kategori/${encodeURIComponent(cat)}`)}
          >
            {cat}
          </button>
        ))}
      </div>
    </>
  );
}

export default Navbar;

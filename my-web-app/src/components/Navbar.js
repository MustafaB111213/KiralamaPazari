// src/components/Navbar.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const ALL_CATEGORIES = [
  'Genel', 'Elektronik', 'Ev & Bahçe', 'Moda', 'Spor', 'Oyun',
  'Araçlar', 'Kamera', 'Kamp', 'Bisiklet', 'Müzik', 'Ofis', 'Diğer',
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

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
          <i className="fas fa-shopping-cart nav-icon" title="Sepet"></i>
          <i className="fas fa-envelope nav-icon" title="Mesajlar"></i>
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
            onClick={() => navigate(`/home/kategori/${encodeURIComponent(cat)}`)}
          >
            {cat}
          </button>
        ))}
      </div>
    </>
  );
}

export default Navbar;

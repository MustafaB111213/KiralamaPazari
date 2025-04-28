import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // İstersen stilleri ayrı dosyada yapalım

const mockProducts = [
  {
    id: '1',
    title: 'Dağ Bisikleti',
    pricePerDay: 150,
    image: 'https://images.unsplash.com/photo-1595433707802-1639266e4e27?auto=format&fit=crop&w=800&q=60',
  },
  {
    id: '2',
    title: 'Profesyonel Kamera',
    pricePerDay: 250,
    image: 'https://images.unsplash.com/photo-1519183071298-a2962be96c71?auto=format&fit=crop&w=800&q=60',
  },
  {
    id: '3',
    title: 'Kamp Çadırı',
    pricePerDay: 100,
    image: 'https://images.unsplash.com/photo-1519455953755-af066f52f1d7?auto=format&fit=crop&w=800&q=60',
  },
];

function Home() {
  return (
    <div className="home-container">
      <div className="header">
        <Link to="/profile">
          <img src="/default_profile.png" alt="Profil" className="profile-icon" />
        </Link>
      </div>

      <div className="product-list">
        {mockProducts.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.title} className="product-image" />
            <h3>{product.title}</h3>
            <p>{product.pricePerDay} ₺ / gün</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;

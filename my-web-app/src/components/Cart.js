import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cart.css';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [items, setItems] = useState([]);
  const API_URL = 'http://localhost:8000/api';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('firebaseToken');
      if (!token) return;

      try {
        const res = await axios.get(`${API_URL}/cart/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(res.data);
      } catch (err) {
        console.error("Sepet verisi alınamadı:", err);
      }
    };

    fetchCart();
  }, []);

  const handleRemove = async (id) => {
    const token = localStorage.getItem('firebaseToken');
    try {
      await axios.post(`${API_URL}/cart/toggle/`, { item_id: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error("Kaldırma hatası:", err);
    }
  };

  const handleCheckout = async (itemId) => {
  const token = localStorage.getItem('firebaseToken');
  try {
    const res = await axios.post(`${API_URL}/start-chat/`, 
  { item_id: itemId },
  {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
);

    const chatId = res.data.chat_id;
    navigate(`/sohbet/${chatId}`);
  } catch (err) {
    alert("Sohbet başlatılamadı.");
  }
};


  return (
    <div className="cart-container">
      <h2>🛒 Sepetim</h2>
      {items.length === 0 ? (
        <p className="empty-text">Sepetinizde ürün bulunmamaktadır.</p>
      ) : (
        <div className="cart-grid">
          {items.map(item => (
            <div className="cart-item" key={item.id}>
              <button className="remove-icon" onClick={() => handleRemove(item.id)}>✖</button>
              <img src={`http://localhost:8000${item.image}`} alt={item.title} />
              <div className="info">
                <h4>{item.title}</h4>
                <p>{item.price_per_day} ₺ / gün</p>
                <button className="checkout-btn" onClick={() => handleCheckout(item.id)}>
                  Ürünü Kirala
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cart;

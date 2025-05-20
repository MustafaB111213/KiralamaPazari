// src/components/AddProduct.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Sabit liste: tüm kategoriler buraya eklenir
const ALL_CATEGORIES = [
  'Genel',
  'Elektronik',
  'Ev & Bahçe',
  'Moda',
  'Spor',
  'Oyun',
  'Araçlar',
  'Kamera',
  'Kamp',
  'Bisiklet',
  'Müzik',
  'Ofis',
  'Diğer',
];

function AddProduct() {
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [image, setImage]             = useState(null);
  const [category, setCategory]       = useState(ALL_CATEGORIES[0]);
  const navigate = useNavigate();
  const token    = localStorage.getItem('firebaseToken');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !pricePerDay || !image) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price_per_day', pricePerDay);
    formData.append('category', category);
    formData.append('image', image);

    try {
      await axios.post(
        `${API_URL}/products/create/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Ürün başarıyla eklendi.');
      navigate('/home');
    } catch (error) {
      console.error('Ürün ekleme hatası:', error);
      alert('Bir hata oluştu.');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Yeni Ürün Ekle</h1>
      <form onSubmit={handleSubmit} style={styles.form} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Ürün Başlığı"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={styles.input}
          required
        />
        <textarea
          placeholder="Açıklama"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={styles.textarea}
          required
        />
        <input
          type="number"
          placeholder="Günlük Fiyat (₺)"
          value={pricePerDay}
          onChange={e => setPricePerDay(e.target.value)}
          style={styles.input}
          required
        />

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={styles.select}
          required
        >
          {ALL_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Ekle</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#fff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    resize: 'vertical',
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
  },
  button: {
    padding: '12px',
    fontSize: '18px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default AddProduct;

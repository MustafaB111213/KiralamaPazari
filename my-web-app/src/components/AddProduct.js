// src/components/AddProduct.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddProduct() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:8000/api';

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
    formData.append('image', image);

    try {
      await axios.post(`${API_URL}/products/create/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
          required
        />
        <textarea
          placeholder="Açıklama"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
          required
        />
        <input
          type="number"
          placeholder="Günlük Fiyat (₺)"
          value={pricePerDay}
          onChange={(e) => setPricePerDay(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
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

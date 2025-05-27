import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddEditProduct.css';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    price_per_day: '',
    return_policy: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);

  const API_URL = 'http://localhost:8000/api';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/${id}/`);
        const product = res.data.product;
        setForm({
          title: product.title,
          description: product.description,
          category: product.category,
          price_per_day: product.price_per_day,
          return_policy: product.return_policy || '',
          image: null, // Yeni dosya seçilmedikçe null kalır
        });
        setPreview(`http://localhost:8000${product.image}`);
      } catch (err) {
        alert('Ürün alınamadı');
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setForm(prev => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('firebaseToken');
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });

    try {
      await axios.put(`${API_URL}/products/${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Ürün güncellendi!');
      navigate('/profile');
    } catch (err) {
      alert('Güncelleme başarısız');
      console.error(err);
    }
  };

  return (
    <div className="product-form-container">
      <h2>Ürünü Düzenle</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Başlık" value={form.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Açıklama" value={form.description} onChange={handleChange} required />
        <input name="category" placeholder="Kategori" value={form.category} onChange={handleChange} required />
        <input name="price_per_day" type="number" placeholder="Fiyat (₺ / gün)" value={form.price_per_day} onChange={handleChange} required />
        <input name="return_policy" placeholder="Kargo & İade Bilgisi" value={form.return_policy} onChange={handleChange} />

        <input type="file" accept="image/*" onChange={handleImage} />
        {preview && <img src={preview} alt="Önizleme" className="preview-image" />}

        <button type="submit" className="btn submit">Güncelle</button>
      </form>
    </div>
  );
}

export default EditProduct;

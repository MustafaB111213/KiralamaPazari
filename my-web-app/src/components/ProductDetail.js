import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:8000/api';
  const MEDIA_BASE_URL = 'http://localhost:8000'; // Medya dosyaları için

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/${id}/`);
        setProduct(response.data);
      } catch (error) {
        console.error('Ürün detayını çekerken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Yükleniyor...</p>;
  }

  if (!product) {
    return <p style={{ textAlign: 'center' }}>Ürün bulunamadı.</p>;
  }

  return (
  <div style={styles.container}>
    <img
      src={`${MEDIA_BASE_URL}${product.image}`}
      alt={product.title}
      style={styles.image}
    />
    <h1 style={styles.title}>{product.title}</h1>
    <p style={styles.description}>{product.description}</p>
    <p style={styles.price}>Günlük: {product.price_per_day} ₺</p>
    <p style={styles.description}>
      <strong>Kategori:</strong> {product.category}
    </p>
    <p style={styles.description}>
      <strong>Ekleyen:</strong> {product.owner_name || 'Bilinmiyor'}
    </p>

  </div>
);

}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '50px auto',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 6px 24px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    maxHeight: '500px',
    objectFit: 'cover',
    borderRadius: '10px',
    marginBottom: '25px',
  },
  title: {
    fontSize: '28px',
    marginBottom: '15px',
    fontWeight: 'bold',
  },
  description: {
    fontSize: '17px',
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  price: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#e65100',
  },
};


export default ProductDetail;

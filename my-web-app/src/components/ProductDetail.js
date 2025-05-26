import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';
import moment from 'moment';
import 'moment/locale/tr';

moment.locale('tr');

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showComments, setShowComments] = useState(true);

  const API_URL = 'http://localhost:8000/api';
  const MEDIA_BASE_URL = 'http://localhost:8000';

  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/products/${id}/comments/`);
      setComments(res.data);
    } catch (err) {
      console.error('Yorumları çekerken hata:', err);
    }
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/${id}/`);
        setProduct(res.data.product);
        setSimilar(res.data.similar_products);
      } catch (err) {
        console.error('Ürün detayını çekerken hata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchComments();
  }, [id, fetchComments]);

  const submitComment = async () => {
    const token = localStorage.getItem('firebaseToken');
    if (!token || !newComment) return alert("Yorum yazmalısınız");

    try {
      await axios.post(
        `${API_URL}/products/${id}/comments/`,
        { text: newComment, rating: newRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      setNewRating(5);
      fetchComments();
      setShowCommentForm(false);
    } catch (err) {
      console.error("Yorum ekleme hatası:", err);
      alert("Yorum eklenemedi");
    }
  };

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem('firebaseToken');
    if (!token || !product?.id) return;

    try {
      const res = await axios.post(`${API_URL}/favorites/toggle/`, {
        item_id: product.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const status = res.data.status;
      setIsFavorited(status === 'added');
      alert(status === 'added' ? "Ürün favorilere eklendi" : "Favorilerden çıkarıldı");
    } catch (err) {
      console.error("Favori işlemi hatası:", err);
    }
  };

  const handleToggleCart = async () => {
    const token = localStorage.getItem('firebaseToken');
    if (!token || !product?.id) return;

    try {
      const res = await axios.post(`${API_URL}/cart/toggle/`, {
        item_id: product.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const status = res.data.status;
      setInCart(status === 'added');
      alert(status === 'added' ? "Ürün sepete eklendi" : "Sepetten çıkarıldı");
    } catch (err) {
      console.error("Sepet işlemi hatası:", err);
    }
  };

  useEffect(() => {
    const fetchIsFavorited = async () => {
      const token = localStorage.getItem('firebaseToken');
      if (!token || !product?.id) return;

      try {
        const res = await axios.get(`${API_URL}/favorites/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const ids = res.data.map(item => item.id);
        setIsFavorited(ids.includes(product.id));
      } catch (err) {
        console.error("Favoriler alınamadı:", err);
      }
    };

    fetchIsFavorited();
  }, [product]);

  if (loading) return <p style={{ textAlign: 'center' }}>Yükleniyor...</p>;
  if (!product) return <p style={{ textAlign: 'center' }}>Ürün bulunamadı.</p>;

  return (
  <div className="product-detail-container">
    <div className="left-column">
      <div className="image-gallery">
        <img src={`${MEDIA_BASE_URL}${product.image}`} alt={product.title} className="main-image" />
      </div>

      {/* BENZER ÜRÜNLER ARTIK SOL BLOKTA */}
      {similar.length > 0 && (
        <div className="similar-products">
          <h3>Benzer Ürünler</h3>
          <div className="similar-list">
            {similar.map(item => (
              <Link to={`/products/${item.id}`} key={item.id} className="similar-card">
                <img src={`${MEDIA_BASE_URL}${item.image}`} alt={item.title} />
                <h4>{item.title}</h4>
                <p>{item.price_per_day} ₺ / gün</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>

    <div className="product-info">
      <h1>{product.title}</h1>
      <p className="product-price">{product.price_per_day} ₺ / Gün</p>
      <p><strong>Kategori:</strong> {product.category}</p>
      <p><strong>Ekleyen:</strong> {product.owner_name || 'Bilinmiyor'}</p>
      <p className="product-description-line"><strong>Kargo & İade:</strong> {product.return_policy || "Belirtilmemiş"}</p>

      <div className="product-description">
        <h3>Ürün Açıklaması</h3>
        <p>{product.description}</p>
      </div>

      <div className="product-actions">
        <button className="favorite-btn" onClick={handleToggleFavorite}
          style={{ backgroundColor: isFavorited ? '#fff' : '#c62828', color: isFavorited ? '#e53935' : '#ffcdd2' }}>
          <i className="fas fa-heart" style={{ marginRight: '8px' }}></i>
          {isFavorited ? "Favoriden Çıkar" : "Favorilere Ekle"}
        </button>

        <button className="cart-btn" onClick={handleToggleCart}>
          <i className="fas fa-shopping-cart" style={{ marginRight: '8px' }}></i>
          {inCart ? "Sepetten Çıkar" : "Sepete Ekle"}
        </button>
      </div>

      <div className="comments-section">
  <h3 onClick={() => setShowComments(!showComments)} className="comments-toggle">
    Yorumlar {showComments ? '▲' : '▼'}
  </h3>

  {showComments && (
    <>
      {comments.length === 0 ? (
        <p>Henüz yorum yapılmamış.</p>
      ) : (
        comments.map(comment => (
          <div className="comment-card" key={comment.id}>
            <div className="comment-header">
              <strong>{comment.user_name || 'Anonim'}</strong>
              <span>{moment(comment.created_at).fromNow()}</span>
            </div>
            <div className="comment-stars">
              {'★'.repeat(comment.rating)}{'☆'.repeat(5 - comment.rating)}
            </div>
            <p className="comment-text">{comment.text}</p>
          </div>
        ))
      )}

      <button onClick={() => setShowCommentForm(!showCommentForm)} className="toggle-comment-form">
        {showCommentForm ? 'Yorum Alanını Gizle' : 'Yorum Yap'}
      </button>

      {showCommentForm && (
        <div className="comment-form">
          <textarea
            placeholder="Yorumunuzu yazın..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
          <div className="star-selector">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star-icon ${newRating >= star ? 'selected' : ''}`}
                onClick={() => setNewRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <button onClick={submitComment} className="submit-comment-btn">Yorumu Gönder</button>
        </div>
      )}
    </>
  )}
</div>
    </div>
  </div>
);

}

export default ProductDetail;

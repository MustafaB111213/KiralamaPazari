// app/product/[id].tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import Icon from '@expo/vector-icons/Ionicons';
import { auth } from '../../firebase';
import HeaderOnly from '../../components/HeaderOnly';

const API_URL = 'http://192.168.1.36:8000/api';
const BASE_URL = 'http://192.168.1.36:8000';
const ALL_CATEGORIES = [
  'Genel','Elektronik','Ev & Bahçe','Moda','Spor',
  'Oyun','Araçlar','Kamera','Kamp','Bisiklet',
  'Müzik','Ofis','Diğer'
];

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const [prodRes, commRes, cartRes] = await Promise.all([
          axios.get(`${API_URL}/products/${id}/`, { headers }),
          axios.get(`${API_URL}/products/${id}/comments/`, { headers }),
          axios.get(`${API_URL}/cart/`, { headers }),
        ]);
        setProduct(prodRes.data.product);
        setSimilarProducts(prodRes.data.similar_products || []);
        setComments(commRes.data);
        setIsFavorite(prodRes.data.product.is_favorite || false);
        setInCart(cartRes.data.some((it: any) => it.id === prodRes.data.product.id));
      } catch (err) {
        console.error('Detaylar alınamadı:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const toggleFavorite = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      await axios.post(
        `${API_URL}/favorites/toggle/`,
        { item_id: product.id },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setIsFavorite(f => !f);
    } catch (err) {
      console.error('Favori işlemi başarısız:', err);
    }
  };

  const toggleCart = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await axios.post(
        `${API_URL}/cart/toggle/`,
        { item_id: product.id },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setInCart(res.data.status === 'added');
    } catch (err) {
      console.error("Sepet işlemi başarısız:", err);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return Alert.alert('Uyarı','Yorum boş olamaz');
    try {
      const token = await auth.currentUser?.getIdToken();
      await axios.post(
        `${API_URL}/products/${id}/comments/`,
        { text: newComment, rating: newRating },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setNewComment('');
      setNewRating(5);
      const refreshed = await axios.get(`${API_URL}/products/${id}/comments/`);
      setComments(refreshed.data);
    } catch (err) {
      console.error("Yorum gönderilemedi:", err);
      Alert.alert('Hata','Yorum gönderilemedi');
    }
  };

  if (loading || !product) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <HeaderOnly onMenuPress={() => setShowModal(true)} />

      <ScrollView style={styles.container}>
        <Image
          source={
            product.image
              ? { uri: `${BASE_URL}${product.image}` }
              : require('../../assets/placeholder.png')
          }
          style={styles.image}
        />

        <View style={styles.header}>
          <Text style={styles.title}>{product.title}</Text>
          <TouchableOpacity onPress={toggleFavorite}>
            <Icon
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={26}
              color="#ff3333"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.price}>{product.price_per_day} ₺ / gün</Text>
        <Text style={styles.meta}>Kategori: {product.category}</Text>
        <Text style={styles.meta}>
          Yayın: {product.created_at
            ? new Date(product.created_at).toLocaleDateString('tr-TR')
            : 'Belirtilmemiş'}
        </Text>

        <View style={styles.ownerSection}>
          <Image
            source={require('../../assets/default_profile.png')}
            style={styles.ownerImage}
          />
          <Text style={styles.ownerName}>{product.owner_name}</Text>
        </View>

        <Text style={styles.description}>{product.description}</Text>

        <TouchableOpacity style={styles.rentButton} onPress={toggleCart}>
          <Text style={styles.buttonText}>
            {inCart ? 'Sepetten Çıkar' : 'Sepete Ekle'}
          </Text>
        </TouchableOpacity>

        {/* Mevcut Yorumlar */}
        <View style={styles.commentSection}>
          <Text style={styles.commentHeader}>Yorumlar</Text>
          {comments.length === 0 ? (
            <Text style={styles.noComments}>Henüz yorum yok</Text>
          ) : (
            comments.map(c => (
              <View key={c.id} style={styles.commentCard}>
                <Text style={styles.commentUser}>{c.user_name}</Text>
                <Text style={styles.commentRating}>
                  {'★'.repeat(c.rating)}{'☆'.repeat(5 - c.rating)}
                </Text>
                <Text style={styles.commentText}>{c.text}</Text>
              </View>
            ))
          )}

          {/* Yeni Yorum Formu */}
          <View style={styles.commentForm}>
            <Text style={styles.commentFormTitle}>Yorum Yaz</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Yorumunuz..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <View style={styles.starRow}>
              {[1,2,3,4,5].map(star => (
                <TouchableOpacity key={star} onPress={() => setNewRating(star)}>
                  <Text style={[
                    styles.star, newRating >= star && styles.selectedStar
                  ]}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={submitComment} style={styles.sendBtn}>
              <Text style={styles.buttonText}>Gönder</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Benzer Ürünler */}
        {similarProducts.length > 0 && (
          <View style={styles.similarSection}>
            <Text style={styles.sectionTitle}>Benzer Ürünler</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.similarList}
            >
              {similarProducts.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.similarCard}
                  onPress={() => router.push(`/product/${item.id}`)}
                >
                  <Image
                    source={{ uri: `${BASE_URL}${item.image}` }}
                    style={styles.similarImage}
                  />
                  <Text style={styles.similarTitle}>{item.title}</Text>
                  <Text style={styles.similarPrice}>
                    {item.price_per_day} ₺ / gün
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Menü Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowModal(false)} />
        <View style={styles.modalMenu}>
          <Text style={styles.modalTitle}>Menü</Text>
          <TouchableOpacity onPress={() => router.push('/favorilerim')}>
            <Text style={styles.modalText}>❤️ Favorilerim</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/sepetim')}>
            <Text style={styles.modalText}>🛒 Sepetim</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowCategories(f => !f)}>
            <Text style={styles.modalText}>
              {showCategories ? '▲ Kapat' : '▼ Kategoriler'}
            </Text>
          </TouchableOpacity>
          {showCategories && ALL_CATEGORIES.map(cat => (
            <Text key={cat} style={styles.modalText}>• {cat}</Text>
          ))}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex:1, alignItems:'center', justifyContent:'center' },
  image: { width:'100%', height:250, resizeMode:'contain', backgroundColor:'#f1f1f1' },
  header: { flexDirection:'row', justifyContent:'space-between', padding:16, alignItems:'center' },
  title: { fontSize:22, fontWeight:'bold', color:'#333', flex:1, marginRight:8 },
  price: { fontSize:18, color:'#007bff', paddingHorizontal:16, marginBottom:4 },
  meta: { fontSize:14, color:'#555', paddingHorizontal:16 },
  ownerSection: { flexDirection:'row', alignItems:'center', paddingHorizontal:16, marginVertical:10 },
  ownerImage: { width:36, height:36, borderRadius:18, marginRight:10 },
  ownerName: { fontSize:16, color:'#333' },
  description: { fontSize:15, color:'#444', paddingHorizontal:16, lineHeight:22, marginBottom:20 },
  rentButton: { backgroundColor:'#ff6600', margin:16, padding:14, borderRadius:10, alignItems:'center' },
  buttonText: { color:'#fff', fontWeight:'bold', fontSize:16 },

  commentSection: { borderTopWidth:1, borderTopColor:'#eee', padding:16 },
  commentHeader: { fontSize:18, fontWeight:'bold', marginBottom:10 },
  noComments: { color:'#777', fontStyle:'italic' },
  commentCard: { backgroundColor:'#fafafa', padding:12, borderRadius:8, marginBottom:10, borderWidth:1, borderColor:'#eee' },
  commentUser: { fontWeight:'bold', color:'#444', marginBottom:4 },
  commentRating: { color:'#f39c12', marginBottom:6 },
  commentText: { color:'#333' },

  commentForm: { marginTop:20 },
  commentFormTitle: { fontSize:16, fontWeight:'600', marginBottom:8 },
  commentInput: {
    borderColor:'#ccc', borderWidth:1, borderRadius:8, padding:10,
    fontSize:15, marginBottom:10, minHeight:60
  },
  starRow: { flexDirection:'row', marginBottom:10 },
  star: { fontSize:24, color:'#ccc' },
  selectedStar: { color:'#fbc02d' },
  sendBtn: { backgroundColor:'#1976d2', padding:12, borderRadius:8, alignItems:'center' },

  similarSection: { paddingVertical:20, borderTopWidth:1, borderTopColor:'#ddd' },
  sectionTitle: { fontSize:20, fontWeight:'bold', paddingHorizontal:16, marginBottom:10 },
  similarList: { paddingLeft:16 },
  similarCard: { width:140, marginRight:12, backgroundColor:'#fff', borderRadius:8, overflow:'hidden', elevation:2 },
  similarImage: { width:'100%', height:80, resizeMode:'cover' },
  similarTitle: { fontSize:14, fontWeight:'600', padding:6 },
  similarPrice: { fontSize:13, color:'#007bff', paddingHorizontal:6, paddingBottom:8 },

  modalOverlay: { flex:1, backgroundColor:'#00000066' },
  modalMenu: { position:'absolute', top:0, bottom:0, left:0, width:270, backgroundColor:'#fff', paddingTop:40, paddingHorizontal:20 },
  modalTitle: { fontSize:20, fontWeight:'bold', marginBottom:20 },
  modalText: { fontSize:16, paddingVertical:8 },
});

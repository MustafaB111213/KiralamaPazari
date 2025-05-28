import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import Icon from '@expo/vector-icons/Ionicons';
import { debounce } from 'lodash';
import { auth } from '../firebase';
import HeaderWithSearch from '../components/HeaderWithSearch';


const API_URL = 'http://192.168.145.203:8000/api';

const ALL_CATEGORIES = [
  'Genel', 'Elektronik', 'Ev & Bahçe', 'Moda', 'Spor', 'Oyun',
  'Araçlar', 'Kamera', 'Kamp', 'Bisiklet', 'Müzik', 'Ofis', 'Diğer'
];

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});

  // Kullanıcının favorilerini başta çek ve state'e yükle
  useEffect(() => {
    (async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await axios.get(`${API_URL}/favorites/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const favMap: Record<number, boolean> = {};
        res.data.forEach((it: any) => { favMap[it.id] = true; });
        setFavorites(favMap);
      } catch (e) {
        console.error('Favoriler alınamadı:', e);
      }
    })();
  }, []);

  // Ürünleri arama/filtrele
  const fetchProducts = async (query = '') => {
    try {
      const res = await axios.get(
        `${API_URL}/products/?search=${encodeURIComponent(query)}`
      );
      setProducts(res.data);
    } catch (e) {
      console.error('Ürünler alınamadı:', e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const debounced = debounce((txt: string) => {
      setLoading(true);
      fetchProducts(txt);
    }, 500);
    fetchProducts();
    debounced(searchTerm);
    return debounced.cancel;
  }, [searchTerm]);

  // Favori toggle
  const toggleFavorite = async (id: number) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      await axios.post(
        `${API_URL}/favorites/toggle/`,
        { item_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites((p) => ({ ...p, [id]: !p[id] }));
    } catch (e) {
      console.error('Favori işlemi başarısız:', e);
    }
  };

  // Kategori seçildiğinde
  const handleCategorySelect = async (cat: string) => {
    setShowModal(false);
    setShowCategories(false);
    setSearchTerm('');
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/products/?category=${encodeURIComponent(cat)}`
      );
      setProducts(res.data);
    } catch (e) {
      console.error('Kategoriye göre ürünler alınamadı:', e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: API_URL.replace('/api', '') + item.image }}
          style={styles.image}
        />
        <TouchableOpacity
          style={styles.favoriteIcon}
          onPress={() => toggleFavorite(item.id)}
        >
          <Icon
            name={favorites[item.id] ? 'heart' : 'heart-outline'}
            size={22}
            color={favorites[item.id] ? '#ff3333' : '#ccc'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.price}>{item.price_per_day} ₺ / gün</Text>
        <Text style={styles.meta}>{item.owner_name} · {item.category}</Text>
        <Text style={styles.date}>
          {new Date(item.created_at).toLocaleDateString('tr-TR')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <HeaderWithSearch
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
/>

      {/* SLIDE MENU */}
      <Modal visible={showModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowModal(false)}
        />
        <View style={styles.modalMenu}>
          <ScrollView>
            <Text style={styles.modalTitle}>Menü</Text>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => router.push('/favorilerim')}
            >
              <Icon name="heart-outline" size={22} color="#333" />
              <Text style={styles.modalText}>Favorilerim</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => router.push('/sohbetler')}
            >
              <Icon name="chatbubble-ellipses-outline" size={22} color="#333" />
              <Text style={styles.modalText}>Sohbetler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem}>
              <Icon name="notifications-outline" size={22} color="#333" />
              <Text style={styles.modalText}>Bildirimler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => router.push('/sepetim')}
            >
              <Icon name="cart-outline" size={22} color="#333" />
              <Text style={styles.modalText}>Sepetim</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => setShowCategories((v) => !v)}
            >
              <Icon name="apps-outline" size={22} color="#333" />
              <Text style={styles.modalText}>Kategoriler</Text>
              <Icon
                name={showCategories ? 'chevron-up-outline' : 'chevron-down-outline'}
                size={20}
                color="#555"
                style={{ marginLeft: 'auto' }}
              />
            </TouchableOpacity>
            {showCategories && (
              <View style={styles.categoryList}>
                {ALL_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => handleCategorySelect(cat)}
                  >
                    <Text style={styles.categoryItem}>• {cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* PRODUCTS */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(i) => i.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#fff',
  paddingTop: 40,          // 🔼 Burayı artırdık
  paddingBottom: 10,
  paddingHorizontal: 16,
  borderBottomWidth: 0.5,
  borderBottomColor: '#ddd',
},

logoArea: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  alignSelf: 'center', // opsiyonel olarak eklendi
},
  logoText: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: '#333' },
  row: { justifyContent: 'space-between', paddingHorizontal: 10 },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
    elevation: 2,
  },
  imageWrapper: { position: 'relative', width: '100%', height: 130, backgroundColor: '#f0f0f0' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 20,
    zIndex: 10,
  },
  cardBody: { padding: 10 },
  title: { fontSize: 15, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  price: { fontSize: 14, color: '#007bff', marginBottom: 4 },
  meta: { fontSize: 13, color: '#555' },
  date: { fontSize: 12, color: '#999', marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: '#00000066' },
  modalMenu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 270,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 20,
    elevation: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  modalItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
  modalText: { fontSize: 16, color: '#333' },
  categoryList: { paddingLeft: 10, marginTop: 6 },
  categoryItem: { fontSize: 14, color: '#555', paddingVertical: 4 },
  logoWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
},

headerIcons: {
  flexDirection: 'row',
  alignItems: 'center',
},

});

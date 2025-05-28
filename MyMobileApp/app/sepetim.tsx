import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { auth } from '../firebase';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Icon from '@expo/vector-icons/Ionicons';
import HeaderOnly from '../components/HeaderOnly';

const API_URL = 'http://192.168.145.203:8000/api';
const ALL_CATEGORIES = [
  'Genel', 'Elektronik', 'Ev & Bahçe', 'Moda', 'Spor', 'Oyun',
  'Araçlar', 'Kamera', 'Kamp', 'Bisiklet', 'Müzik', 'Ofis', 'Diğer'
];

type CartItem = {
  id: number;
  title: string;
  price_per_day: number;
  category: string;
  image: string;
  owner_name: string; // 👈 eklendi
};


export default function Sepetim() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const router = useRouter();

  const handleRemove = async (id: number) => {
  try {
    const token = await auth.currentUser?.getIdToken();
    await axios.post(`${API_URL}/cart/toggle/`, { item_id: id }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    setItems(prev => prev.filter(i => i.id !== id));
  } catch (err) {
    console.error('Kaldırma hatası:', err);
  }
};

const handleCheckout = async (itemId: number) => {
  try {
    const token = await auth.currentUser?.getIdToken();
    const res = await axios.post(`${API_URL}/start-chat/`, { item_id: itemId }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const chatId = res.data.chat_id;
    router.push(`/sohbet/${chatId}`);
  } catch (err) {
    console.error('Sohbet başlatılamadı:', err);
  }
};

  const fetchCart = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await axios.get(`${API_URL}/cart/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data);
    } catch (err) {
      console.error('Sepet alınamadı:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

const renderItem = ({ item }: { item: CartItem }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => router.push(`/product/${item.id}`)}
  >
    <TouchableOpacity
      style={styles.removeIcon}
      onPress={() => handleRemove(item.id)}
    >
      <Icon name="close-circle-outline" size={22} color="#c00" />
    </TouchableOpacity>

    <Image
      source={{ uri: `http://192.168.145.203:8000${item.image}` }}
      style={styles.image}
    />

    <View style={styles.info}>
      <Text style={styles.owner}>👤 {item.owner_name}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>{item.price_per_day} ₺ / gün</Text>
      <Text style={styles.meta}>{item.category}</Text>

      <TouchableOpacity
        style={styles.checkoutBtn}
        onPress={() => handleCheckout(item.id)}
      >
        <Text style={styles.checkoutText}>Kirala</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderOnly onMenuPress={() => setShowModal(true)} />

      <Text style={styles.header}>🛒 Sepetim</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 40 }} />
      ) : items.length === 0 ? (
        <Text style={styles.empty}>Sepetiniz boş</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
        />
      )}

      {/* Menü Modalı */}
      <Modal visible={showModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowModal(false)}
        />
        <View style={styles.modalMenu}>
          <ScrollView>
            <Text style={styles.modalTitle}>Menü</Text>
            <TouchableOpacity style={styles.modalItem} onPress={() => router.push('/favorilerim')}>
              <Icon name="heart-outline" size={22} color="#333" />
              <Text style={styles.modalText}>Favorilerim</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => router.push('/sohbetler')}>
              <Icon name="chatbubble-ellipses-outline" size={22} color="#333" />
              <Text style={styles.modalText}>Sohbetler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => router.push('/bildirimler')}>
              <Icon name="notifications-outline" size={22} color="#333" />
              <Text style={styles.modalText}>Bildirimler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => router.push('/profil')}>
              <Icon name="person-outline" size={22} color="#333" />
              <Text style={styles.modalText}>Profil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => setShowCategories(prev => !prev)}>
              <Icon name="apps-outline" size={22} color="#333" />
              <Text style={styles.modalText}>Kategoriler</Text>
              <Icon name={showCategories ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} color="#555" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
            {showCategories && (
              <View style={styles.categoryList}>
                {ALL_CATEGORIES.map(cat => (
                  <TouchableOpacity key={cat}>
                    <Text style={styles.categoryItem}>• {cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', margin: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  image: { width: 100, height: 100, resizeMode: 'cover' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 14, color: '#007bff', marginVertical: 4 },
  meta: { fontSize: 13, color: '#555' },
  empty: { textAlign: 'center', marginTop: 40, color: '#777', fontSize: 16 },

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

  removeIcon: {
  position: 'absolute',
  top: 8,
  right: 8,
  zIndex: 2,
},


checkoutText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: 'bold',
},
info: {
  flex: 1,
  padding: 10,
  justifyContent: 'space-between',
},

checkoutBtn: {
  backgroundColor: '#007bff',
  borderRadius: 6,
  paddingVertical: 6,
  paddingHorizontal: 12,
  alignSelf: 'flex-start',
  marginTop: 8,
},
owner: {
  fontSize: 13,
  color: '#777',
  marginBottom: 4,
},

});

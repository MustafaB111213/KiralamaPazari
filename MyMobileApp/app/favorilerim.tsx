import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  ScrollView,
} from 'react-native';
import { auth } from '../firebase';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Icon from '@expo/vector-icons/Ionicons';
import HeaderOnly from '../components/HeaderOnly';

const API_URL = 'http://192.168.1.36:8000/api';

export default function Favorilerim() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await axios.get(`${API_URL}/favorites/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
      } catch (error) {
        console.error("Favoriler alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: `${API_URL.replace('/api', '')}${item.image}` }}
          style={styles.image}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.price}>{item.price_per_day} ₺ / gün</Text>
        <Text style={styles.meta}>{item.category}</Text>
        <Text style={styles.date}>
          {new Date(item.created_at).toLocaleDateString('tr-TR')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderOnly onMenuPress={() => setShowModal(true)} />

      <Modal visible={showModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowModal(false)}
        />
        <View style={styles.modalMenu}>
          <ScrollView>
            <Text style={styles.modalTitle}>Menü</Text>
            <TouchableOpacity style={styles.modalItem} onPress={() => router.push('/sepetim')}>
              <Icon name="cart-outline" size={22} color="#333" />
              <Text style={styles.modalText}>Sepetim</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => router.push('/favorilerim')}>
              <Icon name="heart-outline" size={22} color="#333" />
              <Text style={styles.modalText}>Favorilerim</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => router.push('/profile')}>
              <Icon name="person-outline" size={22} color="#333" />
              <Text style={styles.modalText}>Profil</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      <View style={styles.header}>
        <Text style={styles.headerText}>❤️ Favorilerim</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 40 }} />
      ) : items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="heart-dislike-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Henüz favori ürününüz yok.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={renderItem}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 12 }}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: { paddingVertical: 18, paddingHorizontal: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  headerText: { fontSize: 22, fontWeight: 'bold', color: '#222' },
  card: { width: '48%', backgroundColor: '#fff', borderRadius: 10, marginVertical: 10, overflow: 'hidden', elevation: 2 },
  imageWrapper: { width: '100%', height: 130, backgroundColor: '#f0f0f0' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  info: { padding: 10 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 14, color: '#007bff' },
  meta: { fontSize: 13, color: '#666' },
  date: { fontSize: 12, color: '#999' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { marginTop: 10, fontSize: 16, color: '#777' },
  modalOverlay: { flex: 1, backgroundColor: '#00000066' },
  modalMenu: { position: 'absolute', top: 0, bottom: 0, left: 0, width: 270, backgroundColor: '#fff', paddingTop: 40, paddingHorizontal: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  modalItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
  modalText: { fontSize: 16, color: '#333' },
});

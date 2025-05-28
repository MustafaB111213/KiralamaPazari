import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../firebase';
import axios from 'axios';
import HeaderOnly from '../components/HeaderOnly';
import Icon from '@expo/vector-icons/Ionicons';

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');

  const API_URL = 'http://192.168.145.203:8000/api';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const response = await axios.get(`${API_URL}/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setProducts(response.data.items || []);
      } catch (error: any) {
        console.error('Profil çekme hatası:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  const handleDelete = async (itemId: number) => {
    Alert.alert(
      "Ürünü Sil",
      "Bu ürünü silmek istediğinize emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await auth.currentUser?.getIdToken();
              await axios.delete(`${API_URL}/products/${itemId}/`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setProducts(prev => prev.filter(item => item.id !== itemId));
            } catch (err) {
              Alert.alert("Hata", "Ürün silinemedi.");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <HeaderOnly onMenuPress={() => setShowModal(true)} />
        <View style={styles.inner}>
          <Image source={require('../assets/default_profile.png')} style={styles.profileImage} />
          <Text style={styles.name}>{profile?.firstName} {profile?.lastName}</Text>
          <Text style={styles.email}>{profile?.email}</Text>

          

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{products.length}</Text>
              <Text style={styles.statLabel}>Kiralık Ürün</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>⭐ 4.5</Text>
              <Text style={styles.statLabel}>Ortalama Puan</Text>
            </View>
          </View>

          <View style={styles.productSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Kiralık Ürünlerim</Text>
              <TouchableOpacity onPress={() => router.push('/add-product')} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Ürün Ekle</Text>
              </TouchableOpacity>
            </View>

            {products.length === 0 ? (
              <Text style={{ color: '#555' }}>Henüz ürün eklenmemiş.</Text>
            ) : (
              <View style={styles.productList}>
                {products.map((item) => (
                  <View key={item.id} style={styles.productCard}>
                    <Image
                      source={{ uri: `http://192.168.145.203:8000${item.image}` }}
                      style={styles.productImage}
                    />
                    <Text style={styles.productTitle}>{item.title}</Text>
                    <Text style={styles.productPrice}>{item.price_per_day} ₺ / gün</Text>

                    <View style={styles.productActions}>
                      <TouchableOpacity onPress={() => router.push(`/product/${item.id}`)} style={styles.btnView}>
                        <Text style={styles.btnText}>Görüntüle</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => router.push(`/urun-duzenle/${item.id}`)} style={styles.btnEdit}>
                        <Text style={styles.btnText}>Düzenle</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.btnDelete}>
                        <Text style={styles.btnText}>Sil</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowModal(false)} />
        <View style={styles.modalMenu}>
          <Text style={styles.modalTitle}>Menü</Text>
          <TouchableOpacity style={styles.modalItem} onPress={() => router.push('/favorilerim')}>
            <Icon name="heart-outline" size={22} color="#333" />
            <Text style={styles.modalText}>Favorilerim</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalItem} onPress={() => router.push('/sepetim')}>
            <Icon name="cart-outline" size={22} color="#333" />
            <Text style={styles.modalText}>Sepetim</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { alignItems: 'center', padding: 24 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  email: { fontSize: 16, color: '#777', marginBottom: 24 },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#007bff' },
  statLabel: { fontSize: 14, color: '#666' },
  productSection: { width: '100%', paddingHorizontal: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  addButton: {
    backgroundColor: '#ff6f00',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  productList: { gap: 16, width: '100%' },
  productCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
  },
  productImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 8 },
  productTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  productPrice: { fontSize: 14, color: '#555' },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  btnView: { backgroundColor: '#2196f3', padding: 6, borderRadius: 6 },
  btnEdit: { backgroundColor: '#4caf50', padding: 6, borderRadius: 6 },
  btnDelete: { backgroundColor: '#f44336', padding: 6, borderRadius: 6 },
  btnText: { color: '#fff', fontSize: 13 },
  logoutButton: {
    backgroundColor: '#ff3333',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
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
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  modalItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
  modalText: { fontSize: 16, color: '#333' },
});

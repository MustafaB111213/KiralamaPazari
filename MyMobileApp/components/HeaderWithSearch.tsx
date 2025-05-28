import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ScrollView
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const ALL_CATEGORIES = [
  'Genel', 'Elektronik', 'Ev & Bahçe', 'Moda', 'Spor', 'Oyun',
  'Araçlar', 'Kamera', 'Kamp', 'Bisiklet', 'Müzik', 'Ofis', 'Diğer'
];

export default function HeaderWithSearch({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (text: string) => void;
}) {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  return (
    <>
      <View>
        {/* Üst Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Icon name="menu" size={26} color="#007bff" />
          </TouchableOpacity>

          <View style={styles.logoWrapper}>
            <Icon name="storefront" size={24} color="#ff6600" />
            <Text style={styles.logoText}>Kiralama Pazarı</Text>
          </View>

          <View style={styles.icons}>
            <TouchableOpacity onPress={() => router.push('/bildirimler')}>
              <Icon name="notifications-outline" size={22} color="#333" style={{ marginRight: 12 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/sepetim')}>
              <Icon name="cart-outline" size={22} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Arama Kutusu */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={18} color="#888" />
          <TextInput
            placeholder="Ürün ara..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Menü Modalı */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={{ flex: 1 }} onPress={() => setModalVisible(false)} />
        <View style={styles.menuContainer}>
          <ScrollView>
            <Text style={styles.menuTitle}>Menü</Text>

            <TouchableOpacity onPress={() => { router.push('/favorilerim'); setModalVisible(false); }}>
              <Text style={styles.menuItem}>❤️ Favorilerim</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { router.push('/sepetim'); setModalVisible(false); }}>
              <Text style={styles.menuItem}>🛒 Sepetim</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { router.push('/bildirimler'); setModalVisible(false); }}>
              <Text style={styles.menuItem}>🔔 Bildirimler</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { router.push('/profil'); setModalVisible(false); }}>
              <Text style={styles.menuItem}>👤 Profil</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowCategories(prev => !prev)}>
              <Text style={styles.menuItem}>📂 Kategoriler</Text>
            </TouchableOpacity>

            {showCategories && (
              <View style={styles.categoryList}>
                {ALL_CATEGORIES.map((cat, idx) => (
                  <Text key={idx} style={styles.categoryItem}>• {cat}</Text>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 6,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#333',
  },
  menuContainer: {
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
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menuItem: {
    fontSize: 16,
    paddingVertical: 12,
    color: '#333',
  },
  categoryList: {
    paddingLeft: 12,
    paddingBottom: 10,
  },
  categoryItem: {
    fontSize: 14,
    paddingVertical: 4,
    color: '#666',
  },
});

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const ALL_CATEGORIES = [
  'Genel', 'Elektronik', 'Ev & Bahçe', 'Moda', 'Spor', 'Oyun',
  'Araçlar', 'Kamera', 'Kamp', 'Bisiklet', 'Müzik', 'Ofis', 'Diğer'
];

export default function HeaderOnly({ onMenuPress }: { onMenuPress?: () => void }) {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="menu" size={26} color="#007bff" />
        </TouchableOpacity>

        <View style={styles.logoWrapper}>
          <Icon name="storefront" size={24} color="#ff6600" />
          <Text style={styles.logoText}>Kiralama Pazarı</Text>
        </View>

        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={() => router.push('/bildirimler')}>
            <Icon name="notifications-outline" size={24} color="#333" style={{ marginRight: 12 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/sepetim')}>
            <Icon name="cart-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal */}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
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
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
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

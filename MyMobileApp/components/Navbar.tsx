import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function Navbar() {
  const router = useRouter();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => router.push('/home')} style={styles.tab}>
        <Icon name="home-outline" size={24} color="#444" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/favorilerim')} style={styles.tab}>
        <Icon name="heart-outline" size={24} color="#444" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/add-product')} style={styles.addTab}>
        <Icon name="add-circle-outline" size={36} color="#007bff" />
        <Text style={styles.addText}>Ürün Ekle</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/sohbetler')} style={styles.tab}>
        <Icon name="chatbubble-ellipses-outline" size={24} color="#444" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/profile')} style={styles.tab}>
        <Icon name="person-outline" size={24} color="#444" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  tab: {
    alignItems: 'center',
  },
  addTab: {
    alignItems: 'center',
  },
  addText: {
    fontSize: 10,
    color: '#007bff',
    marginTop: -4,
  },
});

import React from 'react';
import { View, TextInput, StyleSheet, Image } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function HeaderBar() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Arama çubuğu */}
      <View style={styles.searchBox}>
        <Icon name="search-outline" size={20} color="#888" />
        <TextInput
          placeholder="Ürün ara..."
          placeholderTextColor="#888"
          style={styles.input}
        />
      </View>

      {/* Sepet ikonu */}
      <Icon
        name="cart-outline"
        size={26}
        color="#333"
        onPress={() => router.push('/sepetim')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 4,
    zIndex: 999,
  },
  logo: { width: 100, height: 30, marginRight: 10 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 10,
    height: 36,
  },
  input: {
    flex: 1,
    paddingHorizontal: 6,
    color: '#333',
    fontSize: 14,
  },
});

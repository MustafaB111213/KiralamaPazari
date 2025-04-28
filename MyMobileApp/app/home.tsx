import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

const mockProducts = [
  {
    id: '1',
    title: 'Dağ Bisikleti',
    pricePerDay: 150,
    image: 'https://images.unsplash.com/photo-1595433707802-1639266e4e27?auto=format&fit=crop&w=800&q=60',
  },
  {
    id: '2',
    title: 'Profesyonel Kamera',
    pricePerDay: 250,
    image: 'https://images.unsplash.com/photo-1519183071298-a2962be96c71?auto=format&fit=crop&w=800&q=60',
  },
  {
    id: '3',
    title: 'Kamp Çadırı',
    pricePerDay: 100,
    image: 'https://images.unsplash.com/photo-1519455953755-af066f52f1d7?auto=format&fit=crop&w=800&q=60',
  },
];

export default function Home() {
  const router = useRouter();

  const goToProfile = () => {
    router.push('/profile');
  };

  const renderItem = ({ item }: { item: typeof mockProducts[0] }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>{item.pricePerDay} ₺ / gün</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToProfile}>
          <Image
            source={require('../assets/default_profile.png')}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    width: '100%',
    padding: 20,
    alignItems: 'flex-end',
    backgroundColor: '#f2f2f2',
  },
  profileIcon: { width: 40, height: 40, borderRadius: 20 },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3, // Android için gölge
    shadowColor: '#000', // iOS için gölge
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  image: { width: '100%', height: 150 },
  title: { fontSize: 18, fontWeight: 'bold', margin: 10 },
  price: { fontSize: 16, color: '#666', marginHorizontal: 10, marginBottom: 10 },
});

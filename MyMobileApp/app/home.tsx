import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

const mockProducts = [
  {
    id: '1',
    title: 'Dağ Bisikleti',
    pricePerDay: 150,
    image:
      'https://images.unsplash.com/photo-1595433707802-1639266e4e27?auto=format&fit=crop&w=800&q=60',
  },
  {
    id: '2',
    title: 'Profesyonel Kamera',
    pricePerDay: 250,
    image:
      'https://images.unsplash.com/photo-1519183071298-a2962be96c71?auto=format&fit=crop&w=800&q=60',
  },
  {
    id: '3',
    title: 'Kamp Çadırı',
    pricePerDay: 100,
    image:
      'https://images.unsplash.com/photo-1519455953755-af066f52f1d7?auto=format&fit=crop&w=800&q=60',
  },
];

export default function Home() {
  const router = useRouter();

  const renderItem = ({
    item,
  }: {
    item: typeof mockProducts[0];
  }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>{item.pricePerDay} ₺ / gün</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  image: { width: '100%', height: 180 },
  title: { fontSize: 18, fontWeight: '600', margin: 12 },
  price: { fontSize: 16, color: '#666', marginHorizontal: 12, marginBottom: 12 },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  ScrollView,
} from 'react-native';
import { useSearchParams, useRouter } from 'expo-router';

const mockProducts = [
  {
    id: '1',
    title: 'Dağ Bisikleti',
    pricePerDay: 150,
    image:
      'https://images.unsplash.com/photo-1595433707802-1639266e4e27?auto=format&fit=crop&w=800&q=60',
    description: 'Zorlu parkurlar için dayanıklı dağ bisikleti.',
  },
  {
    id: '2',
    title: 'Profesyonel Kamera',
    pricePerDay: 250,
    image:
      'https://images.unsplash.com/photo-1519183071298-a2962be96c71?auto=format&fit=crop&w=800&q=60',
    description: 'Yüksek çözünürlüklü çekimler için profesyonel kamera.',
  },
  {
    id: '3',
    title: 'Kamp Çadırı',
    pricePerDay: 100,
    image:
      'https://images.unsplash.com/photo-1519455953755-af066f52f1d7?auto=format&fit=crop&w=800&q=60',
    description: '4 kişilik su geçirmez kamp çadırı.',
  },
];

export default function ProductDetail() {
  const { id } = useSearchParams<{ id: string }>();
  const router = useRouter();
  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Ürün bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>{product.pricePerDay} ₺ / gün</Text>
      <Text style={styles.desc}>{product.description}</Text>
      <Button title="Kirala" onPress={() => alert('Kiralandı!')} />
      <Button title="Geri Dön" onPress={() => router.back()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 16, backgroundColor: '#fff' },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  price: { fontSize: 18, color: '#666', marginBottom: 12 },
  desc: { fontSize: 16, lineHeight: 22, marginBottom: 24 },
});

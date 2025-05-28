// app/urun-duzenle/[id].tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { auth } from '../../firebase';
import HeaderOnly from '../../components/HeaderOnly';

const API_URL = 'http://192.168.145.203:8000/api';

export default function EditProduct() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    price_per_day: '',
    return_policy: '',
    image: null as any,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🗑️ Sadece silme, hata yoksa direkt profile yönlendirme
  const handleDelete = () => {
    Alert.alert(
      "Ürünü Sil",
      "Bu ürünü silmek istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await auth.currentUser?.getIdToken();
              await axios.delete(`${API_URL}/products/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              // Başarılıysa direkt profil sayfasına gider
              router.replace('/profile');
            } catch (err) {
              console.error("Silme hatası:", err);
              Alert.alert("Hata", "Ürün silinemedi.");
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await axios.get(`${API_URL}/products/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const product = res.data.product;
        setForm({
          title: product.title,
          description: product.description,
          category: product.category,
          price_per_day: String(product.price_per_day),
          return_policy: product.return_policy || '',
          image: null,
        });
        setPreview(`${API_URL.replace('/api', '')}${product.image}`);
      } catch (err: any) {
        if (err.response?.status === 404) {
          Alert.alert("Uyarı", "Bu ürün artık mevcut değil.", [
            { text: "Tamam", onPress: () => router.replace('/profile') }
          ]);
        } else {
          console.error(err);
          Alert.alert("Hata", "Ürün verisi alınamadı.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setForm(prev => ({ ...prev, image: asset }));
      setPreview(asset.uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'image' && value) {
          formData.append('image', {
            uri: value.uri,
            name: 'photo.jpg',
            type: 'image/jpeg',
          } as any);
        } else if (value) {
          formData.append(key, value);
        }
      });
      await axios.put(`${API_URL}/products/${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      router.replace('/profile');
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      Alert.alert("Hata", "Güncelleme başarısız");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderOnly />
      <Text style={styles.heading}>Ürünü Düzenle</Text>

      <TextInput
        style={styles.input}
        placeholder="Başlık"
        value={form.title}
        onChangeText={text => handleChange('title', text)}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Açıklama"
        multiline
        value={form.description}
        onChangeText={text => handleChange('description', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Kategori"
        value={form.category}
        onChangeText={text => handleChange('category', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Fiyat (₺ / gün)"
        keyboardType="numeric"
        value={form.price_per_day}
        onChangeText={text => handleChange('price_per_day', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="İade Politikası"
        value={form.return_policy}
        onChangeText={text => handleChange('return_policy', text)}
      />

      <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
        <Text style={styles.imageButtonText}>📷 Fotoğraf Seç</Text>
      </TouchableOpacity>

      {preview && <Image source={{ uri: preview }} style={styles.previewImage} />}

      <Button title="Güncelle" onPress={handleSubmit} color="#007bff" />

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>Ürünü Sil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  imageButton: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  imageButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

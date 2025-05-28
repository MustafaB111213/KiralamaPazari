import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { auth } from '../firebase';
import { useRouter } from 'expo-router';
import HeaderOnly from '../components/HeaderOnly';

const API_URL = 'http://192.168.145.203:8000/api';

const ALL_CATEGORIES = [
  'Genel', 'Elektronik', 'Ev & Bahçe', 'Moda', 'Spor',
  'Oyun', 'Araçlar', 'Kamera', 'Kamp', 'Bisiklet',
  'Müzik', 'Ofis', 'Diğer'
];

export default function UrunEkle() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [returnPolicy, setReturnPolicy] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [category, setCategory] = useState(ALL_CATEGORIES[0]);
  const [image, setImage] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.granted === false) {
      Alert.alert("İzin Gerekli", "Kamera izni gerekli.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !pricePerDay || !image) {
      Alert.alert("Uyarı", "Tüm alanları doldurun ve bir fotoğraf seçin.");
      return;
    }

    setUploading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const formData = new FormData();

      formData.append('title', title);
      formData.append('description', description);
      formData.append('price_per_day', pricePerDay);
      formData.append('category', category);
      formData.append('return_policy', returnPolicy);

      formData.append('image', {
        uri: image.uri,
        type: 'image/jpeg',
        name: 'product.jpg',
      } as any);

      await axios.post(`${API_URL}/products/create/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Başarılı', 'Ürün başarıyla eklendi.');
      router.push('/home');
    } catch (err) {
      console.error('Ürün ekleme hatası:', err);
      Alert.alert('Hata', 'Ürün eklenirken bir hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <HeaderOnly/>
      <Text style={styles.header}>Yeni Ürün Ekle</Text>

      <TextInput
        placeholder="Ürün Başlığı"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Açıklama"
        value={description}
        onChangeText={setDescription}
        multiline
        style={[styles.input, styles.textArea]}
      />

      <TextInput
        placeholder="Kargo ve İade Politikası"
        value={returnPolicy}
        onChangeText={setReturnPolicy}
        multiline
        style={[styles.input, styles.textArea]}
      />

      <TextInput
        placeholder="Günlük Fiyat (₺)"
        value={pricePerDay}
        onChangeText={setPricePerDay}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Kategori Seç:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
        {ALL_CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryItem, category === cat && styles.categorySelected]}
            onPress={() => setCategory(cat)}
          >
            <Text style={{ color: category === cat ? '#fff' : '#333' }}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {image && (
        <Image source={{ uri: image.uri }} style={styles.imagePreview} />
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
          <Text style={styles.photoButtonText}>📷 Fotoğraf Çek</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <Text style={styles.photoButtonText}>🖼️ Galeriden Seç</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={uploading}>
        <Text style={styles.submitButtonText}>{uploading ? 'Yükleniyor...' : 'Ekle'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', alignItems: 'stretch' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8,
    marginBottom: 12, fontSize: 16, backgroundColor: '#f9f9f9',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  label: { marginVertical: 6, fontWeight: '600', color: '#333' },
  categoryList: { flexDirection: 'row', marginBottom: 12 },
  categoryItem: {
    paddingHorizontal: 14, paddingVertical: 8, marginRight: 8,
    borderWidth: 1, borderColor: '#ccc', borderRadius: 20, backgroundColor: '#eee',
  },
  categorySelected: { backgroundColor: '#007bff', borderColor: '#007bff' },
  imagePreview: {
    width: '100%', height: 200, borderRadius: 8, marginVertical: 12,
    borderWidth: 1, borderColor: '#ccc',
  },
  buttonRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8,
  },
  photoButton: {
    flex: 1, padding: 12, marginHorizontal: 5,
    backgroundColor: '#17a2b8', borderRadius: 8, alignItems: 'center',
  },
  photoButtonText: { color: '#fff', fontWeight: 'bold' },
  submitButton: {
    backgroundColor: '#28a745', padding: 14, borderRadius: 8,
    alignItems: 'center', marginTop: 10,
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

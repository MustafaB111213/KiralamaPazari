import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../firebase';
import axios from 'axios';

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL = 'http://192.168.1.47:8000/api';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error('Kullanıcı oturum açmamış');
   
        const response = await axios.get(`${API_URL}/profile/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
   
        setProfile(response.data);
      } catch (error: any) {
        if (error.response) {
          console.error('Profil çekme hatası:', error.response.data);
        } else {
          console.error('Profil çekme hatası:', error.message);
        }
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

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Profil bilgisi alınamadı.</Text>
        <Button title="Çıkış Yap" onPress={handleLogout} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/default_profile.png')}
        style={styles.profileImage}
      />
      <Text style={styles.name}>{profile.firstName} {profile.lastName}</Text>
      <Text style={styles.email}>{profile.email}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Kiralanan Ürün</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>⭐ 4.5</Text>
          <Text style={styles.statLabel}>Ortalama Puan</Text>
        </View>
      </View>

      <Button title="Çıkış Yap" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, alignItems: 'center', justifyContent: 'center' },
  profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  email: { fontSize: 16, color: '#666', marginBottom: 20 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 20 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { fontSize: 14, color: '#666' },
});
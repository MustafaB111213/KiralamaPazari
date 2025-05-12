import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../../firebase';
import axios from 'axios';
import defaultProfile from '../../assets/default_profile.png';

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = 'http://10.14.10.6:8000/api';

  useEffect(() => {
    (async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error('Oturum açılmamış');
        const res = await axios.get(`${API_URL}/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = async () => {
    await auth.signOut();
    router.push('/auth');
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Profil bilgisi alınamadı.</Text>
        <Button title="Çıkış Yap" onPress={logout} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={defaultProfile} style={styles.image} />
      <Text style={styles.name}>
        {profile.firstName} {profile.lastName}
      </Text>
      <Text style={styles.email}>{profile.email}</Text>
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>5</Text>
          <Text>Kiralama</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>4.5</Text>
          <Text>Ortalama Puan</Text>
        </View>
      </View>
      <Button title="Çıkış Yap" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  image: { width: 120, height: 120, borderRadius: 60, marginBottom: 16 },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  email: { fontSize: 16, color: '#666', marginBottom: 24 },
  stats: { flexDirection: 'row', width: '100%', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: '600' },
});

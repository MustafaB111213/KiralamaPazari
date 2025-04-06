import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();
  const userProfile = {
    firstName: 'Mustafa',
    lastName: 'Yılmaz',
    bio: 'Benim hakkımda kısa bir bilgi buraya gelecek.',
    location: 'İstanbul, Türkiye',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profilim</Text>
      <Text style={styles.info}>Ad: {userProfile.firstName}</Text>
      <Text style={styles.info}>Soyad: {userProfile.lastName}</Text>
      <Text style={styles.info}>Bio: {userProfile.bio}</Text>
      <Text style={styles.info}>Konum: {userProfile.location}</Text>
      <Button title="Çıkış Yap" onPress={() => router.push('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  info: { fontSize: 18, marginVertical: 5 },
});

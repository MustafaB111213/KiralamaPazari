// MyMobileApp/app/profile/index.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();

  // Örnek kullanıcı verisi; daha sonra gerçek backend’den çekeceksiniz
  const userProfile = {
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    firstName: 'Mustafa',
    lastName: 'Yılmaz',
    bio: 'Bilgisayar mühendisliği öğrencisiyim. Mobil ve web uygulama geliştirme ile ilgileniyorum.',
    location: 'İstanbul, Türkiye',
    email: 'mustafa.yilmaz@example.com',
    joinedDate: 'Mart 2025',
  };

  const handleLogout = () => {
    // firebase işlemleri şimdilik kalsın
    router.replace('/');  // Giriş ekranına dön
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.card}>
        <Image source={{ uri: userProfile.avatarUrl }} style={styles.avatar} />

        <Text style={styles.name}>
          {userProfile.firstName} {userProfile.lastName}
        </Text>
        <Text style={styles.joined}>Katılım: {userProfile.joinedDate}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hakkında</Text>
          <Text style={styles.sectionText}>{userProfile.bio}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İletişim</Text>
          <Text style={styles.sectionText}>📧 {userProfile.email}</Text>
          <Text style={styles.sectionText}>📍 {userProfile.location}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  joined: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    width: '100%',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

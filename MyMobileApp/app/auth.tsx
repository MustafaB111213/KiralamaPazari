import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../firebase';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function AuthScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const API_URL = 'http://192.168.1.47:8000/api';

  const handleAuth = async (): Promise<void> => {
    if (!email || !email.includes('@')) {
      Alert.alert('Geçersiz Email', 'Lütfen geçerli bir email adresi girin.');
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert('Geçersiz Şifre', 'Şifre en az 6 karakter olmalı.');
      return;
    }
    if (!isLogin && (!firstName || !lastName)) {
      Alert.alert('Eksik Bilgi', 'Lütfen adınızı ve soyadınızı girin.');
      return;
    }

    setLoading(true);
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const token = await userCredential.user.getIdToken();

        const postData = {
          firebase_token: token,
          firstName: firstName,
          lastName: lastName
        };

        await axios.post(`${API_URL}/register/`, postData);
      }

      router.push('/(tabs)');
    } catch (error: any) {
      if (error.response) {
        console.error('Hata:', error.response.data);
        Alert.alert('Hata', JSON.stringify(error.response.data));
      } else {
        console.error('Hata:', error.message);
        Alert.alert('Hata', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</Text>

      {!isLogin && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Adınız"
            placeholderTextColor="#666"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Soyadınız"
            placeholderTextColor="#666"
            value={lastName}
            onChangeText={setLastName}
          />
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Şifre"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.toggleText}>
          {isLogin ? 'Hesabınız yok mu? Kayıt olun.' : 'Zaten hesabınız var mı? Giriş yapın.'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#333' },
  input: { height: 50, borderColor: '#999', borderWidth: 1, borderRadius: 8, marginBottom: 12, paddingHorizontal: 12, fontSize: 16, color: '#333' },
  button: { backgroundColor: '#007bff', paddingVertical: 14, borderRadius: 8, marginBottom: 12 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: '600' },
  toggleText: { textAlign: 'center', color: '#007bff', fontSize: 16 },
});
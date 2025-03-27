import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Giriş başarılı!");
      router.push("/profile");
    } catch (error: any) {
      Alert.alert("Hata", error.message);
    }    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Şifre" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Giriş Yap" onPress={handleLogin} />

      {/* Hesabınız yok mu? Kaydolun butonu */}
      <View style={styles.registerContainer}>
        <Text>Hesabınız yok mu?</Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.registerText}>Kaydolun</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  registerContainer: { marginTop: 20, alignItems: "center" },
  registerText: { color: "blue", marginTop: 5, fontWeight: "bold" },
});

export default LoginScreen;

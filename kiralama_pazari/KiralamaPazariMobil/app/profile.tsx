import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { auth } from "../firebaseConfig";
import { updateProfile, updateEmail, updatePassword, signOut } from "firebase/auth";
import { useRouter } from "expo-router";

const ProfileScreen = () => {
  const router = useRouter();
  const user = auth.currentUser;

  // Kullanıcı bilgilerini state'e aktaralım
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  // Düzenlenebilirlik için bayraklar
  const [isNameEditable, setIsNameEditable] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);

  const handleSave = async () => {
    try {
      if (!user) return;

      // Ad Soyad güncelleme
      if (isNameEditable && name !== user.displayName) {
        await updateProfile(user, { displayName: name });
      }
      // E-posta güncelleme
      if (isEmailEditable && email !== user.email) {
        await updateEmail(user, email);
      }
      // Şifre güncelleme (şifre alanı dolu ise)
      if (isPasswordEditable && password) {
        await updatePassword(user, password);
      }

      Alert.alert("Başarılı", "Bilgileriniz güncellendi.");

      // Güncellemeden sonra tüm alanları salt okunur yap
      setIsNameEditable(false);
      setIsEmailEditable(false);
      setIsPasswordEditable(false);
      setPassword(""); // Şifre alanını temizle
    } catch (error: any) {
      Alert.alert("Hata", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Çıkış Hatası", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Bilgileri</Text>

      {/* Ad Soyad Alanı */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Ad Soyad:</Text>
        <TextInput
          style={[styles.input, isNameEditable ? styles.editable : styles.readonly]}
          value={name}
          onChangeText={setName}
          editable={isNameEditable}
        />
        <TouchableOpacity onPress={() => setIsNameEditable(!isNameEditable)}>
          <Text style={styles.editButton}>{isNameEditable ? "İptal" : "Düzenle"}</Text>
        </TouchableOpacity>
      </View>

      {/* E-posta Alanı */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>E-posta:</Text>
        <TextInput
          style={[styles.input, isEmailEditable ? styles.editable : styles.readonly]}
          value={email}
          onChangeText={setEmail}
          editable={isEmailEditable}
          keyboardType="email-address"
        />
        <TouchableOpacity onPress={() => setIsEmailEditable(!isEmailEditable)}>
          <Text style={styles.editButton}>{isEmailEditable ? "İptal" : "Değiştir"}</Text>
        </TouchableOpacity>
      </View>

      {/* Şifre Alanı */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Şifre:</Text>
        <TextInput
          style={[styles.input, isPasswordEditable ? styles.editable : styles.readonly]}
          value={password}
          onChangeText={setPassword}
          editable={isPasswordEditable}
          secureTextEntry
          placeholder={isPasswordEditable ? "Yeni şifre giriniz" : "********"}
        />
        <TouchableOpacity onPress={() => setIsPasswordEditable(!isPasswordEditable)}>
          <Text style={styles.editButton}>{isPasswordEditable ? "İptal" : "Değiştir"}</Text>
        </TouchableOpacity>
      </View>

      <Button title="Kaydet" onPress={handleSave} />
      <View style={{ marginTop: 20 }}>
        <Button title="Çıkış Yap" onPress={handleLogout} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  fieldContainer: { marginBottom: 15 },
  label: { fontSize: 16, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5 },
  readonly: { backgroundColor: "#eee" },
  editable: { backgroundColor: "#fff" },
  editButton: { color: "blue", marginTop: 5, fontWeight: "bold" },
});

export default ProfileScreen;

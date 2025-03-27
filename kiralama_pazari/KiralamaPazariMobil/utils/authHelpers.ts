import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "firebase/auth";

// Oturum bilgisini AsyncStorage'e kaydet
export const saveUserToStorage = async (user: User) => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Oturum bilgisi kaydedilemedi:", error);
  }
};

// Oturum bilgisini AsyncStorage'den al
export const getUserFromStorage = async () => {
  try {
    const user = await AsyncStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Oturum bilgisi okunamadı:", error);
    return null;
  }
};

// AsyncStorage'den oturumu sil
export const removeUserFromStorage = async () => {
  try {
    await AsyncStorage.removeItem("user");
  } catch (error) {
    console.error("Oturum bilgisi silinemedi:", error);
  }
};

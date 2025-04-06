import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";


const firebaseConfig = {
    apiKey: "AIzaSyDPxMFmTDc450ap2oIbTuQ9xvwZ0KsIBxs",
    authDomain: "kiralamapazari-959db.firebaseapp.com",
    projectId: "kiralamapazari-959db",
    storageBucket: "kiralamapazari-959db.firebasestorage.app",
    messagingSenderId: "768709844857",
    appId: "1:768709844857:web:7df32297551379be3059a8",
    measurementId: "G-998HHFE2MY"
  };

  const app = initializeApp(firebaseConfig);

  // Oturumun kalıcı olması için AsyncStorage kullanıyoruz
  export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  
  // Ayrıca e-posta/parola ile giriş ve kayıt işlemlerinde kullanacağınız methodlar,
  // bu dosyada da bulunabilir veya direkt AuthScreen'de kullanılabilir.
  export { signInWithEmailAndPassword, createUserWithEmailAndPassword };
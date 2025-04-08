// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Firebase Console'dan alacağınız konfigürasyon bilgilerini buraya yapıştırın.
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
export const auth = getAuth(app);
export { createUserWithEmailAndPassword, signInWithEmailAndPassword };

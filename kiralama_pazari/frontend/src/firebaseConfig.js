import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAmD7MSoz_dvrmtUsAFQubDU-epUg3JFkg",
  authDomain: "kiralamapazari-d89a3.firebaseapp.com",
  projectId: "kiralamapazari-d89a3",
  storageBucket: "kiralamapazari-d89a3.firebasestorage.app",
  messagingSenderId: "211230898801",
  appId: "1:211230898801:web:d2c2734990bbf9361fb9d0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);


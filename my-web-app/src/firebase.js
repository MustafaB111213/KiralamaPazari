import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDPxMFmTDc450ap2oIbTuQ9xvwZ0KsIBxs",
  authDomain: "kiralamapazari-959db.firebaseapp.com",
  projectId: "kiralamapazari-959db",
  storageBucket: "kiralamapazari-959db.appspot.com",
  messagingSenderId: "768709844857",
  appId: "1:768709844857:web:7df32297551379be3059a8",
  measurementId: "G-998HHFE2MY"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

export { auth };
export default firebase;

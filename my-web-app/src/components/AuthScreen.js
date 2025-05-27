import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../firebase';

function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:8000/api';

  const handleAuth = async (e) => {
    e.preventDefault();

    const cleanedEmail =
      typeof email === 'string' ? email.trim() : '';
    const cleanedPassword =
      typeof password === 'string' ? password.trim() : '';

    if (
      Object.prototype.toString.call(cleanedEmail) !== '[object String]' ||
      !cleanedEmail.includes('@')
    ) {
      alert('Lütfen geçerli bir email adresi girin.');
      return;
    }

    if (
      Object.prototype.toString.call(cleanedPassword) !== '[object String]' ||
      cleanedPassword.length < 6
    ) {
      alert('Şifre en az 6 karakter olmalı.');
      return;
    }

    if (!isLogin && (!firstName || !lastName)) {
      alert('Lütfen adınızı ve soyadınızı girin.');
      return;
    }

    setLoading(true);

    try {
      let userCredential;
      if (isLogin) {
        userCredential = await auth.signInWithEmailAndPassword(email, password);

      } else {
        userCredential = await auth.createUserWithEmailAndPassword(email, password);

      }

      const token = await userCredential.user.getIdToken();

      const postData = { firebase_token: token };
      if (!isLogin) {
        postData.firstName = firstName;
        postData.lastName = lastName;
      }

      const endpoint = isLogin ? '/login/' : '/register/';
      const response = await axios.post(`${API_URL}${endpoint}`, postData);

      localStorage.setItem('firebaseToken', token);
      alert(response.data.message || 'İşlem başarılı.');
      navigate('/home');
    } catch (error) {
      console.error('Firebase Auth Hatası:', error);
      alert('Hata: ' + (error?.message || 'İşlem başarısız.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h1>
      <form onSubmit={handleAuth} style={styles.form}>
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Adınız"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Soyadınız"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={styles.input}
            />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Lütfen Bekleyin...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
        </button>
      </form>
      <p style={styles.toggleText} onClick={() => setIsLogin(!isLogin)}>
        {isLogin
          ? 'Hesabınız yok mu? Kayıt olun.'
          : 'Zaten hesabınız var mı? Giriş yapın.'}
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '18px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  toggleText: {
    marginTop: '10px',
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default AuthScreen;

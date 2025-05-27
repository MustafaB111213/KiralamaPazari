// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthScreen from './components/AuthScreen';
import Profile from './components/Profile';
import Home from './components/Home';
import ProductDetail from './components/ProductDetail';
import AddProduct from './components/AddProduct';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Favorites from './components/Favorites';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import EditProduct from './components/EditProduct';
import './firebase'; // sadece initialize çalışsın diye çağırıyoruz
import Cart from './components/Cart';
import ChatRoom from './components/ChatRoom';
import ChatList from './components/ChatList';

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/';

  const refreshToken = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      try {
        const idToken = await user.getIdToken(true);
        localStorage.setItem('firebaseToken', idToken);
      } catch (error) {
        console.error('Token yenileme hatası:', error);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken();
    }, 25 * 60 * 1000); // 25 dakika

    refreshToken(); // İlk yüklemede çalışsın

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<AuthScreen />} />
        <Route path="/home" element={<Home />} />
        <Route path="/kategori/:categoryName" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/favorilerim" element={<Favorites />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/sepetim" element={<Cart />} />
        <Route path="/sohbet/:chatId" element={<ChatRoom />} />
        <Route path="/sohbetler" element={<ChatList />} />

      </Routes>
    </>
  );
}

export default App;

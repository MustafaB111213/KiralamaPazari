// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthScreen from './components/AuthScreen';
import Profile from './components/Profile';
import Home from './components/Home';
import ProductDetail from './components/ProductDetail';
import AddProduct from './components/AddProduct';
import '@fortawesome/fontawesome-free/css/all.min.css';

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

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<AuthScreen />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/kategori/:categoryName" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/add-product" element={<AddProduct />} />
      </Routes>
    </>
  );
}

export default App;

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthScreen from './components/AuthScreen';
import Profile from './components/Profile';
import Home from './components/Home';
import ProductDetail from './components/ProductDetail'; // 👈 en üstteki importlara ekle
import AddProduct from './components/AddProduct'; // eklendi

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthScreen />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/add-product" element={<AddProduct />} /> {/* eklendi */}

      </Routes>
    </Router>
  );
}

export default App;

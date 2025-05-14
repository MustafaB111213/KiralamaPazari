import React from 'react';
import { Slot } from 'expo-router';

export default function RootLayout() {
  // Tüm alt sayfalar burada render edilecek
  return <Slot />;
}

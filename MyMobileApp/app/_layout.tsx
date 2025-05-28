import { Slot, useSegments } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Navbar from '../components/Navbar';

export default function RootLayout() {
  const segments = useSegments();
  const showNavbar = !segments.includes('auth');

  return (
    <View style={styles.container}>
      <Slot />
      {showNavbar && <Navbar />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const categories = ['Genel', 'Elektronik', 'Ev & Bahçe', 'Moda', 'Spor', 'Oyun', 'Kamera', 'Araçlar', 'Kamp', 'Diğer'];

export default function CategoryScroll({ onSelect }: { onSelect: (cat: string) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {categories.map((cat) => (
        <TouchableOpacity key={cat} style={styles.button} onPress={() => onSelect(cat)}>
          <Text style={styles.text}>{cat}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 10, paddingHorizontal: 10, backgroundColor: '#f2f2f2' },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    marginRight: 10,
  },
  text: { fontSize: 14, color: '#333' },
});

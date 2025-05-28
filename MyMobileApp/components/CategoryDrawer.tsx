import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const CATEGORIES = [
  'Genel', 'Elektronik', 'Ev & Bahçe', 'Moda', 'Spor',
  'Oyun', 'Araçlar', 'Kamera', 'Kamp', 'Bisiklet', 'Müzik', 'Ofis', 'Diğer',
];

export default function CategoryDrawer({ visible, onClose, onSelect }: {
  visible: boolean;
  onClose: () => void;
  onSelect: (category: string) => void;
}) {
  return (
    <Modal animationType="slide" visible={visible} transparent>
      <View style={styles.overlay}>
        <View style={styles.drawer}>
          <Text style={styles.title}>Kategoriler</Text>
          <FlatList
            data={CATEGORIES}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { onSelect(item); onClose(); }}>
                <Text style={styles.item}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-start' },
  drawer: { backgroundColor: '#fff', width: '70%', height: '100%', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  item: { fontSize: 16, paddingVertical: 10 },
  close: { marginTop: 20, color: 'blue', fontWeight: '600' },
});

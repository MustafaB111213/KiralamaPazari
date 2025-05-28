// app/sohbetler.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { auth } from '../firebase';
import HeaderOnly from '../components/HeaderOnly';

const API_URL = 'http://192.168.145.203:8000/api';

type Chat = {
  chat_id: number;
  item_id: number;
  buyer_uid: string;
  seller_uid: string;
  item_title: string;
  last_message: string;
  last_sender: string;
  other_user: string;
  unread: boolean;
};

export default function SohbetListesi() {
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchChats = async () => {
      const token = await auth.currentUser?.getIdToken();
      try {
        const res = await axios.get(`${API_URL}/chats/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChats(res.data);
      } catch (err) {
        console.error('Sohbetler alınamadı:', err);
      }
    };
    fetchChats();
  }, []);

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={[styles.item, item.unread && styles.unread]}
      onPress={() =>
        router.push({
          pathname: `/sohbet/${item.chat_id}`,
          params: {
            item: String(item.item_id),
            buyer: item.buyer_uid,
            seller: item.seller_uid,
          },
        })
      }
    >
      <Text style={styles.title}>{item.item_title}</Text>
      <Text style={styles.subtitle}>
        <Text style={{ fontWeight: 'bold' }}>{item.last_sender}:</Text> {item.last_message}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderOnly />
      <Text style={styles.header}>📨 Sohbetler</Text>
      {chats.length === 0 ? (
        <Text style={styles.empty}>Henüz sohbet yok</Text>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={c => c.chat_id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  item: {
    backgroundColor: '#f2f2f2',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  unread: {
    backgroundColor: '#e6f0ff',
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  title: { fontWeight: '600', fontSize: 15 },
  subtitle: { marginTop: 6, fontSize: 14, color: '#444' },
  empty: { textAlign: 'center', color: '#777', marginTop: 20 },
});

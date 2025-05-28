// app/sohbet/[chat_id].tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { auth } from '../../firebase';

const API_URL = 'http://192.168.1.36:8000/api';

export default function ChatRoom() {
  const { chat_id } = useLocalSearchParams<{ chat_id: string }>();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    const token = await auth.currentUser?.getIdToken();
    try {
      const res = await axios.get(`${API_URL}/chat/${chat_id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Mesajlar alınamadı:', err);
    } finally {
      setLoading(false);
    }
  }, [chat_id]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSend = async () => {
    const token = await auth.currentUser?.getIdToken();
    if (!input.trim()) return;

    try {
      await axios.post(
        `${API_URL}/chat/${chat_id}/send/`,
        { content: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setInput('');
      fetchMessages();
    } catch (err) {
      console.error('Mesaj gönderilemedi:', err);
    }
  };

  const renderItem = ({ item }: any) => (
    <View
      style={[
        styles.message,
        item.is_self ? styles.self : styles.other,
      ]}
    >
      <Text style={styles.sender}>{item.sender}</Text>
      <Text>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ padding: 12 }}
        inverted
      />

      <View style={styles.inputArea}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Mesaj yaz..."
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendText}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  message: {
    marginVertical: 8,
    padding: 10,
    borderRadius: 10,
    maxWidth: '75%',
  },
  self: {
    backgroundColor: '#d1e7ff',
    alignSelf: 'flex-end',
  },
  other: {
    backgroundColor: '#f1f3f5',
    alignSelf: 'flex-start',
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 13,
  },
  inputArea: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
  },
});

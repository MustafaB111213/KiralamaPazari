import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { auth } from '../../firebase';

const API_URL = 'http://192.168.145.203:8000/api';

export default function ChatRoom() {
  const { chat_id } = useLocalSearchParams<{ chat_id: string }>();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

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

    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
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
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      console.error('Mesaj gönderilemedi:', err);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={[styles.message, item.is_self ? styles.self : styles.other]}>
      <Text style={styles.sender}>{item.sender}</Text>
      <Text>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderItem}
              keyExtractor={(_, index) => index.toString()}
              contentContainerStyle={styles.messageList}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <View style={styles.inputArea}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Mesaj yaz..."
                style={styles.input}
                multiline
              />
              <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                <Text style={styles.sendText}>Gönder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    justifyContent: 'space-between',
  },
  messageList: {
    padding: 12,
    paddingBottom: 10,
  },
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
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
  },
});

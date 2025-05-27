import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ChatRoom.css';

function ChatRoom() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const API_URL = 'http://localhost:8000/api';

  const fetchMessages = useCallback(async () => {
    const token = localStorage.getItem('firebaseToken');
    try {
      const res = await axios.get(`${API_URL}/chat/${chatId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Mesajlar alınamadı:", err);
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  const handleSend = async () => {
    const token = localStorage.getItem('firebaseToken');
    if (!input.trim()) return;

    try {
      await axios.post(`${API_URL}/chat/${chatId}/send/`, { content: input }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setInput('');
      fetchMessages();
    } catch (err) {
      console.error("Mesaj gönderilemedi:", err);
    }
  };

  const fetchUserId = async () => {
    const token = localStorage.getItem('firebaseToken');
    try {
      const res = await axios.get(`${API_URL}/profile/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserId(res.data.uid || res.data.user_id);
    } catch {}
  };

  useEffect(() => {
    fetchMessages();
    fetchUserId();
  }, [fetchMessages]);

  return (
    <div className="chatroom-container">
      <h2 className="chatroom-title">Sohbet</h2>

      <div className="chatbox">
        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          messages.map((msg, index) => (
            <div
              className={`chat-message-bubble ${msg.is_self ? 'self' : 'other'}`}
              key={index}
            >
              <div className="chat-sender">{msg.sender}</div>
              <div className="chat-content">{msg.content}</div>
            </div>
          ))
        )}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mesaj yaz..."
          className="chat-input"
        />
        <button onClick={handleSend} className="send-button">Gönder</button>
      </div>
    </div>
  );
}

export default ChatRoom;

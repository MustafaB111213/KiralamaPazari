import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChatList.css';

function ChatList() {
  const [chats, setChats] = useState([]);
  const API_URL = 'http://localhost:8000/api';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      const token = localStorage.getItem('firebaseToken');
      if (!token) return;

      try {
        const res = await axios.get(`${API_URL}/chats/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChats(res.data);
      } catch (err) {
        console.error("Sohbetler alınamadı:", err);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="chatlist-container">
      <h2 className="chatlist-title">📨 Gelen Kutusu</h2>
      {chats.length === 0 ? (
        <p className="chatlist-empty">Henüz sohbetiniz yok.</p>
      ) : (
        chats.map(chat => (
          <div
            className={`chatlist-item ${chat.unread ? 'unread' : ''}`}
            key={chat.chat_id}
            onClick={() => navigate(`/sohbet/${chat.chat_id}`)}
          >
            <div className="chatlist-header">
                <div><strong>{chat.last_sender}</strong> → <strong>{chat.other_user}</strong></div>
                <div className="chatlist-item-title">{chat.item_title}</div>
            </div>

            <div className="chatlist-message">
              {chat.last_sender && <strong>{chat.last_sender}: </strong>}
              {chat.last_message}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ChatList;

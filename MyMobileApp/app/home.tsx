import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, addDoc, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

const HomeScreen = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, []);

  const handleAddComment = async () => {
    if (!newComment || !selectedPostId) return;

    const postRef = doc(db, 'posts', selectedPostId);
    const post = posts.find((p) => p.id === selectedPostId);

    const updatedComments = [...(post.comments || []), newComment];
    await updateDoc(postRef, { comments: updatedComments });

    setNewComment('');
    setSelectedPostId(null);
  };

  const handleLike = async (postId: string) => {
    const postRef = doc(db, 'posts', postId);
    const post = posts.find((p) => p.id === postId);
    await updateDoc(postRef, { likes: (post.likes || 0) + 1 });
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.post}>
      <Text style={styles.text}>📝 {item.title || 'Post Başlığı'}</Text>
      <Text style={styles.text}>❤️ {item.likes || 0} Beğeni</Text>
      <FlatList
        data={item.comments || []}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => <Text style={styles.comment}>💬 {item}</Text>}
      />
      <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.likeButton}>
        <Text>👍 Beğen</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSelectedPostId(item.id)} style={styles.commentButton}>
        <Text>💬 Yorum Yap</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList data={posts} keyExtractor={(item) => item.id} renderItem={renderItem} />

      {selectedPostId && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Yorum yaz..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity onPress={handleAddComment} style={styles.sendButton}>
            <Text>Gönder</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  post: { marginBottom: 20, borderBottomWidth: 1, paddingBottom: 10 },
  text: { fontSize: 16 },
  comment: { marginLeft: 10, color: '#555' },
  likeButton: { marginTop: 5 },
  commentButton: { marginTop: 5 },
  inputContainer: { flexDirection: 'row', marginTop: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8 },
  sendButton: { marginLeft: 8, justifyContent: 'center' },
});

export default HomeScreen;

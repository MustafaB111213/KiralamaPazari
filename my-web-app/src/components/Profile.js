// src/components/Profile.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();

  // Örnek statik kullanıcı verisi; gerçek uygulamada API'den veya global state yönetiminden çekebilirsiniz.
  const userProfile = {
    firstName: "Mustafa",
    lastName: "Yılmaz",
    bio: "Kısa bir biyografi buraya gelecek.",
    location: "İstanbul, Türkiye",
  };

  const handleLogout = () => {
    // Firebase'den çıkış yapma kodunu da ekleyebilirsiniz (örneğin, auth.signOut())
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <h1>Profilim</h1>
      <p><strong>Ad:</strong> {userProfile.firstName}</p>
      <p><strong>Soyad:</strong> {userProfile.lastName}</p>
      <p><strong>Bio:</strong> {userProfile.bio}</p>
      <p><strong>Konum:</strong> {userProfile.location}</p>
      <button style={styles.button} onClick={handleLogout}>Çıkış Yap</button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    textAlign: 'left',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default Profile;

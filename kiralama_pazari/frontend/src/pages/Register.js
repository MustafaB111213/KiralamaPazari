import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Kayıt başarılı!");
      navigate("/login");
    } catch (error) {
      alert("Kayıt başarısız: " + error.message);
    }
  };

  return (
    <div>
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleRegister}>
        <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Kayıt Ol</button>
      </form>
    </div>
  );
};

export default Register;

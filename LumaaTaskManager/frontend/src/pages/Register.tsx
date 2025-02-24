import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (auth && (await auth.register(username, password))) {
        navigate('/login'); // ✅ Redirect to login after successful registration
      } else {
        alert('❌ Registration failed. Please try again.');
      }
    } catch (error: any) {
      console.error("❌ Registration Error:", error.response?.data || error.message);
      alert(`❌ Registration failed: ${error.response?.data?.error || "Unknown error"}`);
    }
  };

  return (
    <div className="p-6">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input className="border p-2 w-full" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input className="border p-2 w-full mt-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit" className="bg-green-500 text-white p-2 mt-4">Register</button>
      </form>
    </div>
  );
};

export default Register;

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (auth && (await auth.login(username, password))) {
      navigate('/tasks');
    } else {
      alert('Invalid login credentials');
    }
  };

  return (
    <div className="p-6">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input className="border p-2 w-full" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input className="border p-2 w-full mt-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-4">Login</button>
      </form>
    </div>
  );
};

export default Login;

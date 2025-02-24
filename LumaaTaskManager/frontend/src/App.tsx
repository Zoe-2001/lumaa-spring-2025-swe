import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar /> {/* ✅ Navbar is always visible */}
        <Routes>
          {/* ✅ Redirect `/` to `/login` */}
          <Route path="/" element={<Navigate replace to="/login" />} />

          {/* ✅ Define all necessary routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={<Tasks />} />

          {/* ✅ Catch-all route for unknown pages */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

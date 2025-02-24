import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const auth = useContext(AuthContext);

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between">
      <div>
        <Link to="/tasks" className="mr-4">Tasks</Link>
      </div>
      <div>
        {auth?.user ? (
          <button onClick={auth.logout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

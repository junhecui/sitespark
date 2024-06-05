import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = ({ token, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-2xl">My App</h1>
      <div>
        <Link to="/" className="mr-4">Home</Link>
        {token ? (
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        ) : (
          <>
            <Link to="/signup" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
              Signup
            </Link>
            <Link to="/login" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

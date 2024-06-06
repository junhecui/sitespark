import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AddWebsite = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/website', { name }, {
        headers: {
          'x-auth-token': token
        }
      });
      navigate('/');
    } catch (err) {
      setError(err.response.data.message || 'Error creating website');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold mb-4">Add Website</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Website Name
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
        Add Website
      </button>
    </form>
  );
};

export default AddWebsite;
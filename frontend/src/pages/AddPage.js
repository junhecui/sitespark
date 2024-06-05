import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AddPage = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { websiteId } = useParams();
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5001/api/website/${websiteId}/page`, { name }, {
        headers: {
          'x-auth-token': token
        }
      });
      navigate(`/website/${websiteId}/pages`);
    } catch (err) {
      setError(err.response.data.message || 'Error creating page');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold mb-4">Add Page</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Page Name
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
        Add Page
      </button>
    </form>
  );
};

export default AddPage;

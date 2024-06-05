import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const AddWebsite = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newWebsite = { id: uuidv4(), name };
    axios.post('http://localhost:5001/api/website', newWebsite)
      .then(() => navigate('/'))
      .catch(error => console.error('Error creating website:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold mb-4">Add Website</h1>
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

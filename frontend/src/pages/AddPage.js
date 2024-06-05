import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const AddPage = () => {
  const { websiteId } = useParams();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPage = { id: uuidv4(), name };
    axios.post(`http://localhost:5001/api/website/${websiteId}/page`, newPage)
      .then(() => navigate(`/website/${websiteId}/pages`))
      .catch(error => console.error('Error creating page:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold mb-4">Add Page</h1>
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

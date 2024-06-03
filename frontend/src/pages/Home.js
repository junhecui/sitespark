import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [pages, setPages] = useState([]);
  const [newPageName, setNewPageName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001/api/pages')
      .then(response => setPages(response.data))
      .catch(error => console.error('Error fetching pages:', error));
  }, []);

  const createPage = () => {
    axios.post('http://localhost:5001/api/pages', { name: newPageName })
      .then(response => setPages([...pages, response.data]))
      .catch(error => console.error('Error creating page:', error));
  };

  const deletePage = (id) => {
    axios.delete(`http://localhost:5001/api/pages/${id}`)
      .then(() => setPages(pages.filter(page => page.id !== id)))
      .catch(error => console.error('Error deleting page:', error));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Pages</h1>
      <div className="mb-4">
        <input
          type="text"
          value={newPageName}
          onChange={(e) => setNewPageName(e.target.value)}
          placeholder="New Page Name"
          className="p-2 border rounded"
        />
        <button onClick={createPage} className="ml-2 p-2 bg-blue-500 text-white rounded">Create Page</button>
      </div>
      <ul>
        {pages.map(page => (
          <li key={page.id} className="mb-2 flex justify-between items-center">
            <Link to={`/edit/${page.id}`} className="text-blue-500">{page.name}</Link>
            <button onClick={() => deletePage(page.id)} className="p-2 bg-red-500 text-white rounded">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;

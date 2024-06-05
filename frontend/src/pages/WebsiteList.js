import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const WebsiteList = () => {
  const [websites, setWebsites] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/websites')
      .then(response => setWebsites(response.data))
      .catch(error => console.error('Error fetching websites:', error));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Websites</h1>
      <ul>
        {websites.map(website => (
          <li key={website.id}>
            <Link to={`/website/${website.id}/pages`}>{website.name}</Link>
          </li>
        ))}
      </ul>
      <Link to="/add-website" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Website
      </Link>
    </div>
  );
};

export default WebsiteList;

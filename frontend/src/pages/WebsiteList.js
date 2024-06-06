import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const WebsiteList = () => {
  const [websites, setWebsites] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/websites', {
          headers: {
            'x-auth-token': token
          }
        });
        setWebsites(response.data);
      } catch (error) {
        console.error('Error fetching websites:', error);
      }
    };

    fetchWebsites();
  }, [token]);

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
      <Link to="/add-website" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
        Add Website
      </Link>
    </div>
  );
};

export default WebsiteList;
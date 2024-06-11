import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const WebsiteList = () => {
  const [websites, setWebsites] = useState([]);
  const [compiledUrls, setCompiledUrls] = useState({});
  const { token } = useAuth();

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/websites', {
          headers: { 'x-auth-token': token }
        });
        setWebsites(response.data);
      } catch (error) {
        console.error('Error fetching websites:', error);
      }
    };

    fetchWebsites();
  }, [token]);

  const compileWebsite = async (websiteId, homePageId) => {
    try {
      const response = await axios.post('http://localhost:5001/api/compile', {
        websiteId,
        homePageId
      }, {
        headers: { 'x-auth-token': token }
      });
      setCompiledUrls({ ...compiledUrls, [websiteId]: response.data.compiledUrl });
    } catch (error) {
      console.error('Error compiling website:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Websites</h1>
      <ul>
        {websites.map(website => (
          <li key={website.id} className="mb-4">
            <Link to={`/website/${website.id}/pages`} className="text-blue-500 mr-4">
              {website.name}
            </Link>
            <button
              onClick={() => compileWebsite(website.id, website.homePageId)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Compile
            </button>
            {compiledUrls[website.id] && (
              <a
                href={compiledUrls[website.id]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline ml-4"
              >
                View Compiled Website
              </a>
            )}
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
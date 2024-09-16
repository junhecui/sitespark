import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const WebsiteList = () => {
  const [websites, setWebsites] = useState([]);
  const [compiledUrls, setCompiledUrls] = useState({});
  const [pagesByWebsite, setPagesByWebsite] = useState({});
  const [selectedHomePage, setSelectedHomePage] = useState({});
  const { token } = useAuth();

  useEffect(() => {
    document.title = 'Home';

    const fetchWebsites = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/websites', {
          headers: { 'x-auth-token': token }
        });
        setWebsites(response.data);

        response.data.forEach(async (website) => {
          const pageResponse = await axios.get(`http://localhost:5001/api/website/${website.id}/pages`, {
            headers: { 'x-auth-token': token }
          });
          setPagesByWebsite((prevState) => ({
            ...prevState,
            [website.id]: pageResponse.data
          }));
        });
      } catch (error) {
        console.error('Error fetching websites:', error);
      }
    };

    fetchWebsites();
  }, [token]);

  const handleHomePageSelection = (websiteId, homePageId) => {
    setSelectedHomePage((prevState) => ({
      ...prevState,
      [websiteId]: homePageId
    }));
  };

  const compileWebsite = async (websiteId) => {
    const homePageId = selectedHomePage[websiteId];
    if (!homePageId) {
      alert('Please select a home page before compiling.');
      return;
    }
  
    try {
      // Assuming your compilation logic sends the request to the backend
      await axios.post('http://localhost:5001/api/compile', {
        websiteId,
        homePageId
      }, {
        headers: { 'x-auth-token': token }
      });
  
      // After successful compilation, construct the URL in the known format
      const compiledUrl = `https://sitespark.s3.us-west-2.amazonaws.com/${websiteId}/page_${homePageId}.html`;
  
      // Set the compiled URL for the website
      setCompiledUrls((prevState) => ({
        ...prevState,
        [websiteId]: compiledUrl
      }));
  
    } catch (error) {
      console.error('Error compiling website:', error);
    }
  };  

  const deleteWebsite = async (websiteId) => {
    try {
      await axios.delete(`http://localhost:5001/api/website/${websiteId}`, {
        headers: { 'x-auth-token': token }
      });
      setWebsites(websites.filter(website => website.id !== websiteId));
    } catch (error) {
      console.error('Error deleting website:', error);
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

            {}
            {pagesByWebsite[website.id] && (
              <select
                value={selectedHomePage[website.id] || ''}
                onChange={(e) => handleHomePageSelection(website.id, e.target.value)}
                className="mr-4"
              >
                <option value="" disabled>Select Home Page</option>
                {pagesByWebsite[website.id].map(page => (
                  <option key={page.id} value={page.id}>
                    {page.name}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => compileWebsite(website.id)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Compile
            </button>

            {/* Ensure compiled URL is set before displaying the View button */}
            {compiledUrls[website.id] && (
              <>
                <a
                  href={compiledUrls[website.id]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline ml-4"
                >
                  View Compiled Website
                </a>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
                  onClick={() => window.open(compiledUrls[website.id], '_blank')}
                >
                  View
                </button>
              </>
            )}

            <button
              onClick={() => deleteWebsite(website.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
            >
              Delete
            </button>
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
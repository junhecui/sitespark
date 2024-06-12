import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import '../index.css';

const FullWebsite = () => {
  const { websiteId } = useParams();
  const [pages, setPages] = useState([]);
  const [compiledUrls, setCompiledUrls] = useState({});
  const [homePageId, setHomePageId] = useState('');

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/website/${websiteId}/full`);
        setPages(response.data);
      } catch (error) {
        console.error('Error fetching full website data:', error);
      }
    };

    fetchPages();
  }, [websiteId]);

  const compileWebsite = async (pageId) => {
    try {
      const response = await axios.post('http://localhost:5001/api/compile', {
        websiteId,
        homePageId: pageId
      });
      setCompiledUrls({ ...compiledUrls, [pageId]: response.data.compiledUrl });
    } catch (error) {
      console.error('Error compiling website:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pages</h1>
      <ul>
        {pages.map(page => (
          <li key={page.id} className="mb-4">
            <Link to={`/page/${page.id}/edit`} className="text-blue-500 mr-4">
              {page.name}
            </Link>
            <button
              onClick={() => compileWebsite(page.id)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Compile
            </button>
            {compiledUrls[page.id] && (
              <a
                href={compiledUrls[page.id]}
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
    </div>
  );
};

export default FullWebsite;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PageList = () => {
  const [pages, setPages] = useState([]);
  const { websiteId } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/website/${websiteId}/pages`, {
          headers: {
            'x-auth-token': token
          }
        });
        setPages(response.data);
      } catch (error) {
        console.error('Error fetching pages:', error);
      }
    };

    fetchPages();
  }, [websiteId, token]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pages</h1>
      <ul>
        {pages.map(page => (
          <li key={page.id}>
            <Link to={`/page/${page.id}/edit`}>{page.name}</Link>
          </li>
        ))}
      </ul>
      <Link to={`/website/${websiteId}/add-page`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
        Add Page
      </Link>
    </div>
  );
};

export default PageList;
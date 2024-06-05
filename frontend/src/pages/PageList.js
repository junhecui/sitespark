import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const PageList = () => {
  const { websiteId } = useParams();
  const [pages, setPages] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5001/api/website/${websiteId}/pages`)
      .then(response => setPages(response.data))
      .catch(error => console.error('Error fetching pages:', error));
  }, [websiteId]);

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
      <Link to={`/website/${websiteId}/add-page`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Page
      </Link>
    </div>
  );
};

export default PageList;

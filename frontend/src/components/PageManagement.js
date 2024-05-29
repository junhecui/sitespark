import React, { useState } from 'react';
import './PageManagement.css';

const PageManagement = ({ pages, setPages, currentPage, setCurrentPage }) => {
  const [newPageName, setNewPageName] = useState('');

  const addPage = () => {
    if (newPageName.trim()) {
      const newPage = { name: newPageName, components: [] };
      setPages([...pages, newPage]);
      setCurrentPage(newPage);
      setNewPageName('');
    }
  };

  const deletePage = (pageName) => {
    if (pages.length > 1) {
      const filteredPages = pages.filter((page) => page.name !== pageName);
      setPages(filteredPages);
      setCurrentPage(filteredPages[0]);
    } else {
      alert('You must have at least one page.');
    }
  };

  const selectPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="page-management">
      <input
        type="text"
        value={newPageName}
        onChange={(e) => setNewPageName(e.target.value)}
        placeholder="New page name"
        className="new-page-input"
      />
      <button onClick={addPage} className="add-page-button">
        Add Page
      </button>
      <ul className="page-list">
        {pages.map((page, index) => (
          <li
            key={index}
            className={`page-item ${page.name === currentPage.name ? 'active' : ''}`}
            onClick={() => selectPage(page)}
          >
            {page.name}
            <button onClick={() => deletePage(page.name)} className="delete-page-button">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PageManagement;

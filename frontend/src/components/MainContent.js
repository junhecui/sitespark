import React, { useState } from 'react';
import DropZone from './DropZone';
import DraggableComponent from './DraggableComponent';
import PageManagement from './PageManagement';
import './MainContent.css';

const MainContent = () => {
  const [pages, setPages] = useState([{ name: 'Home', components: [] }]);
  const [currentPage, setCurrentPage] = useState(pages[0]);

  const handleDrop = (item) => {
    const updatedComponents = [...currentPage.components, { type: item.type, properties: {} }];
    const updatedPage = { ...currentPage, components: updatedComponents };
    setPages(pages.map((page) => (page.name === currentPage.name ? updatedPage : page)));
    setCurrentPage(updatedPage);
  };

  const saveProject = async () => {
    const response = await fetch('http://localhost:3001/api/projects/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pages }),
    });
    const data = await response.json();
    console.log('Project saved:', data);
  };

  const loadProject = async () => {
    const response = await fetch('http://localhost:3001/api/projects/load');
    const data = await response.json();
    setPages(data.pages);
    setCurrentPage(data.pages[0]);
  };

  return (
    <main className="main-content">
      <PageManagement pages={pages} setPages={setPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <DropZone onDrop={handleDrop} />
      <div className="components">
        {currentPage.components.map((component, index) => {
          if (component.type === 'Text') {
            return <div key={index} className="component">Text Component</div>;
          } else if (component.type === 'Image') {
            return <div key={index} className="component">Image Component</div>;
          }
          return null;
        })}
      </div>
      <button onClick={saveProject} className="save-button">Save Project</button>
      <button onClick={loadProject} className="load-button">Load Project</button>
    </main>
  );
};

export default MainContent;

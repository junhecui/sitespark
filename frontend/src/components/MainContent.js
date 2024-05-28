import React, { useState } from 'react';
import DropZone from './DropZone';
import './MainContent.css';

const MainContent = () => {
  const [components, setComponents] = useState([]);

  const handleDrop = (item) => {
    setComponents((prevComponents) => [...prevComponents, item.type]);
  };

  return (
    <main className="main-content">
      <DropZone onDrop={handleDrop} />
      <div className="components">
        {components.map((component, index) => (
          <div key={index} className="component-item">
            {component}
          </div>
        ))}
      </div>
    </main>
  );
};

export default MainContent;

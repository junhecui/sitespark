import React, { useState } from 'react';
import DropZone from './DropZone';
import TextComponent from './TextComponent';
import ImageComponent from './ImageComponent';
import './MainContent.css';

const MainContent = () => {
  const [components, setComponents] = useState([]);

  const handleDrop = (item) => {
    console.log('Dropped item:', item); // Debugging line
    setComponents((prevComponents) => [...prevComponents, item.type]);
  };

  const saveProject = async () => {
    const response = await fetch('/api/save-project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ components }),
    });
    const data = await response.json();
    console.log('Project saved:', data);
  };

  return (
    <main className="main-content">
      <DropZone onDrop={handleDrop} />
      <div className="components">
        {components.map((component, index) => {
          if (component === 'Text') {
            return <TextComponent key={index} />;
          } else if (component === 'Image') {
            return <ImageComponent key={index} />;
          } else if (component === 'Button') {
            return <button key={index} className="component-button">Button</button>;
          }
          return null;
        })}
      </div>
      <button onClick={saveProject} className="save-button">Save Project</button>
    </main>
  );
};

export default MainContent;

import React from 'react';
import DraggableComponent from './DraggableComponent';
import './ComponentLibrary.css';

const ComponentLibrary = () => {
  return (
    <div className="component-library">
      <h2>Component Library</h2>
      <DraggableComponent type="Text">
        <button className="library-item">Text</button>
      </DraggableComponent>
      <DraggableComponent type="Image">
        <button className="library-item">Image</button>
      </DraggableComponent>
      <DraggableComponent type="Button">
        <button className="library-item">Button</button>
      </DraggableComponent>
    </div>
  );
};

export default ComponentLibrary;

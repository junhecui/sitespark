import React from 'react';
import DraggableComponent from './DraggableComponent';

const ComponentLibrary = () => {
  return (
    <div className="sidebar">
      <h3>Component Library</h3>
      <DraggableComponent type="Button">
        <button>Button</button>
      </DraggableComponent>
      <DraggableComponent type="Input">
        <input placeholder="Input" />
      </DraggableComponent>
    </div>
  );
};

export default ComponentLibrary;

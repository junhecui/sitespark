import React from 'react';
import DraggableComponent from './DraggableComponent';
import './Toolbar.css';

const Toolbar = () => {
  return (
    <div className="toolbar">
      <h2>Toolbar</h2>
      <DraggableComponent type="Text">
        <button className="toolbar-item">Text</button>
      </DraggableComponent>
      <DraggableComponent type="Image">
        <button className="toolbar-item">Image</button>
      </DraggableComponent>
      <DraggableComponent type="Container">
        <button className="toolbar-item">Container</button>
      </DraggableComponent>
    </div>
  );
};

export default Toolbar;

import React from 'react';
import ComponentLibrary from './ComponentLibrary';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2>Components</h2>
      <ComponentLibrary />
    </aside>
  );
};

export default Sidebar;

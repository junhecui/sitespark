import React from 'react';

const Sidebar = ({ onAddWidget }) => {
  const widgetTypes = ['form', 'chart', 'text', 'image', 'button', 'shape'];

  return (
    <div className="w-48 p-4 bg-gray-800 text-white">
      <h2 className="text-xl font-bold mb-4">Add Widget</h2>
      {widgetTypes.map(type => (
        <button
          key={type}
          onClick={() => onAddWidget(type)}
          className="block w-full text-left mb-2 p-2 bg-blue-500 hover:bg-blue-700 rounded"
        >
          {type.charAt(0).toUpperCase() + type.slice(1)} Widget
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
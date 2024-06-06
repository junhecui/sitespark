import React from 'react';

const Sidebar = ({ widgets, onAddWidget }) => {
  return (
    <div className="w-1/4 bg-gray-200 p-4">
      <h2 className="font-bold text-lg mb-4">Widgets</h2>
      <div>
        {widgets.map((widget, index) => (
          <div
            key={widget.id}
            className="p-2 mb-2 bg-white border rounded cursor-pointer"
            onClick={() => onAddWidget(widget)}
          >
            {widget.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

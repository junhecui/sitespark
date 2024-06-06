import React from 'react';

const TextWidget = ({ id, data }) => {
  return (
    <div className="text-widget bg-white shadow-md rounded px-4 py-2 mb-4 relative">
      <p>{data.text || 'Enter Text:'}</p>
    </div>
  );
};

export default TextWidget;
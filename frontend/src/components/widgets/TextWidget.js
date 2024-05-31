import React from 'react';

const TextWidget = ({ data }) => {
  return (
    <div className="text-widget bg-white shadow-md rounded px-4 py-2 mb-4">
      <p>{data}</p>
    </div>
  );
};

export default TextWidget;

import React from 'react';

const TextWidget = ({ id, data, onDelete }) => {
  return (
    <div className="text-widget bg-white shadow-md rounded px-4 py-2 mb-4 relative">
      <button
        onClick={() => onDelete(id)}
        className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
      >
        X
      </button>
      <p>{data.text}</p> {}
    </div>
  );
};

export default TextWidget;

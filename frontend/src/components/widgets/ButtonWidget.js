import React from 'react';

const ButtonWidget = ({ id, data, onDelete }) => {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <div className="button-widget bg-white shadow-md rounded px-4 py-2 mb-4 relative">
      <button
        onClick={() => onDelete(id)}
        className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
      >
        X
      </button>
      <button onClick={handleClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {data.text}
      </button>
    </div>
  );
};

export default ButtonWidget;

import React from 'react';

const ButtonWidget = ({ data }) => {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <div className="button-widget bg-white shadow-md rounded px-4 py-2 mb-4">
      <button onClick={handleClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {data}
      </button>
    </div>
  );
};

export default ButtonWidget;

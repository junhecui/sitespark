import React from 'react';

const ImageWidget = ({ data }) => {
  return (
    <div className="image-widget bg-white shadow-md rounded px-4 py-2 mb-4">
      <img src={data} alt="Widget" className="w-full h-auto" />
    </div>
  );
};

export default ImageWidget;

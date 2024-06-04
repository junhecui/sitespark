import React, { useState } from 'react';

const ImageWidget = ({ id, data, onDelete, onUpdate }) => {
  const [imageUrl, setImageUrl] = useState(data.imageUrl || '');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
        onUpdate(id, { imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-widget bg-white shadow-md rounded px-4 py-2 mb-4 relative">
      <button
        onClick={() => onDelete(id)}
        className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
      >
        X
      </button>
      {imageUrl ? (
        <img src={imageUrl} alt="Uploaded" className="w-full h-auto" />
      ) : (
        <div>
          <input type="file" onChange={handleImageUpload} className="w-full" />
        </div>
      )}
    </div>
  );
};

export default ImageWidget;

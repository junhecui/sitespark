import React, { useState } from 'react';
import axios from 'axios';

const ImageWidget = ({ id, data, onDelete, onUpdate }) => {
  const [imageUrl, setImageUrl] = useState(data.imageUrl || '');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post('http://localhost:5001/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setImageUrl(response.data.imageUrl);
        onUpdate(id, { imageUrl: response.data.imageUrl });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
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

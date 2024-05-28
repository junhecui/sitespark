import React, { useState } from 'react';
import './ImageComponent.css';

const ImageComponent = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="image-component">
      <input type="file" onChange={handleImageChange} />
      {image && <img src={image} alt="Uploaded" />}
    </div>
  );
};

export default ImageComponent;

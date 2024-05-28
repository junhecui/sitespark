import React, { useState } from 'react';
import './TextComponent.css';

const TextComponent = () => {
  const [text, setText] = useState("Edit me!");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="text-component">
      <textarea value={text} onChange={handleChange} />
    </div>
  );
};

export default TextComponent;

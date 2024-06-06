import React from 'react';

const TextWidget = ({ id, data }) => {
  return (
    <div className="text-widget">
      <p>{data.text || 'Enter Text:'}</p>
    </div>
  );
};

export default TextWidget;
import React from 'react';

const TextWidget = ({ id, data }) => {
  const { text, fontSize, fontFamily, textAlign } = data;
  const style = {
    fontSize: fontSize ? `${fontSize}px` : '16px',
    fontFamily: fontFamily || 'Arial, sans-serif',
    textAlign: textAlign || 'left',
  };

  return (
    <div className="text-widget">
      <p style={style}>{text || 'Enter Text:'}</p>
    </div>
  );
};

export default TextWidget;
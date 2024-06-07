import React from 'react';

const TextWidget = ({ id, data }) => {
  const { text, fontSize, fontFamily, textAlign, fontColor, bold, italic } = data;
  const style = {
    fontSize: fontSize ? `${fontSize}px` : '16px',
    fontFamily: fontFamily || 'Arial, sans-serif',
    textAlign: textAlign || 'left',
    color: fontColor || '#000000',
    fontWeight: bold ? 'bold' : 'normal',
    fontStyle: italic ? 'italic' : 'normal'
  };

  return (
    <div className="text-widget" style={{ display: 'inline-block' }}>
      <p style={style}>{text || 'Enter Text:'}</p>
    </div>
  );
};

export default TextWidget;
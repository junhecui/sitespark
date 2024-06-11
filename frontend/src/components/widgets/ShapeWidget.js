import React from 'react';

const ShapeWidget = ({ id, data }) => {
  const shapeStyle = {
    width: `${data.width || 100}px`,
    height: `${data.height || 100}px`,
    backgroundColor: data.color || '#000000',
    opacity: data.opacity !== undefined ? data.opacity : 1,
    borderRadius: data.shape === 'circle' ? '50%' : '0'
  };

  if (data.clickable) {
    const link = data.pageLink ? `/page/${data.pageLink}` : data.link;
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
        <div style={shapeStyle}></div>
      </a>
    );
  }

  return <div style={shapeStyle}></div>;
};

export default ShapeWidget;
import React from 'react';

const ShapeWidget = ({ id, data }) => {
  const { shape, width, height, color, opacity } = data;
  const style = {
    width: width || 100,
    height: height || 100,
    backgroundColor: color || '#000000',
    opacity: opacity !== undefined ? opacity : 1,
    borderRadius: shape === 'circle' ? '50%' : '0'
  };

  return (
    <div className="shape-widget" style={style}></div>
  );
};

export default ShapeWidget;
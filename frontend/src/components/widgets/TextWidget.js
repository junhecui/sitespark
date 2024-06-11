import React from 'react';

const TextWidget = ({ id, data }) => {
  const content = (
    <p
      style={{
        fontSize: `${data.fontSize || 16}px`,
        fontFamily: data.fontFamily || 'Arial, sans-serif',
        color: data.fontColor || '#000000',
        fontWeight: data.bold ? 'bold' : 'normal',
        fontStyle: data.italic ? 'italic' : 'normal',
        textAlign: data.textAlign || 'left'
      }}
    >
      {data.text || 'Enter Text:'}
    </p>
  );

  if (data.clickable) {
    const link = data.pageLink ? `/page/${data.pageLink}` : data.link;
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <div className="text-widget">{content}</div>;
};

export default TextWidget;
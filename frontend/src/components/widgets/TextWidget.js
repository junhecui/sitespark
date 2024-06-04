import React, { useState } from 'react';

const TextWidget = ({ id, data, onDelete, onUpdate }) => {
  const [text, setText] = useState(data.text);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdate(id, { text });
    setIsEditing(false);
  };

  return (
    <div className="text-widget bg-white shadow-md rounded px-4 py-2 mb-4 relative">
      <button
        onClick={() => onDelete(id)}
        className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
      >
        X
      </button>
      {isEditing ? (
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
          <button onClick={handleSave} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
            Save
          </button>
        </div>
      ) : (
        <div onDoubleClick={() => setIsEditing(true)}>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

export default TextWidget;

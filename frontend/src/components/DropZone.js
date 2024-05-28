import React from 'react';
import { useDrop } from 'react-dnd';

const DropZone = ({ onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        border: '1px solid black',
        minHeight: '400px',
        backgroundColor: isOver ? 'lightgreen' : 'white',
      }}
    >
      Drop components here
    </div>
  );
};

export default DropZone;

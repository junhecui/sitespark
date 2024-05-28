import React from 'react';
import { useDrop } from 'react-dnd';
import './DropZone.css';

const DropZone = ({ onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item) => {
      onDrop(item);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`drop-zone ${isOver ? 'is-over' : ''}`}
    >
      {isOver ? "Release to drop" : "Drag components here"}
    </div>
  );
};

export default DropZone;

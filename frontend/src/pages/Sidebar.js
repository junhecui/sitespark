import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const widgets = [
  { id: 'chart', name: 'Chart Widget' },
  { id: 'form', name: 'Form Widget' },
  { id: 'text', name: 'Text Widget' },
  { id: 'image', name: 'Image Widget' },
  { id: 'button', name: 'Button Widget' }
];

function Sidebar() {
  return (
    <div className="w-1/4 p-4 bg-gray-100 border-r border-gray-300">
      <h2 className="text-lg font-bold mb-4">Widgets</h2>
      {widgets.map((widget, index) => (
        <Draggable key={widget.id} draggableId={widget.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="p-2 mb-2 bg-white border rounded shadow"
            >
              {widget.name}
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
}

export default Sidebar;
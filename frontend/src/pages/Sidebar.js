import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const Sidebar = ({ widgets }) => {
  return (
    <div className="w-1/4 bg-gray-200 p-4">
      <h2 className="font-bold text-lg mb-4">Widgets</h2>
      <Droppable droppableId="availableWidgets">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {widgets.map((widget, index) => (
              <Draggable key={widget.id} draggableId={widget.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="p-2 mb-2 bg-white border rounded cursor-pointer"
                  >
                    {widget.name}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Sidebar;

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import FormWidget from '../components/widgets/FormWidget';
import ChartWidget from '../components/widgets/ChartWidget';
import TextWidget from '../components/widgets/TextWidget';
import ImageWidget from '../components/widgets/ImageWidget';
import ButtonWidget from '../components/widgets/ButtonWidget';
import Sidebar from '../components/Sidebar';
import '../index.css';

function PageEditor() {
  const { pageId } = useParams();
  const [items, setItems] = useState([]);
  const [availableWidgets] = useState([
    { id: '1', name: 'Chart Widget', type: 'chart' },
    { id: '2', name: 'Form Widget', type: 'form' },
    { id: '3', name: 'Text Widget', type: 'text' },
    { id: '4', name: 'Image Widget', type: 'image' },
    { id: '5', name: 'Button Widget', type: 'button' },
  ]);
  const navigate = useNavigate();

  const fetchWidgets = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/widgets?pageId=${pageId}`);
      const fetchedItems = response.data.map((widget) => {
        let WidgetComponent;
        switch (widget.type) {
          case 'chart':
            WidgetComponent = ChartWidget;
            break;
          case 'form':
            WidgetComponent = FormWidget;
            break;
          case 'text':
            WidgetComponent = TextWidget;
            break;
          case 'image':
            WidgetComponent = ImageWidget;
            break;
          case 'button':
            WidgetComponent = ButtonWidget;
            break;
          default:
            WidgetComponent = null;
        }
        const data = typeof widget.data === 'string' ? JSON.parse(widget.data) : widget.data;
        return {
          id: widget.id,
          content: WidgetComponent ? <WidgetComponent key={widget.id} id={widget.id} data={data} onDelete={() => handleDelete(widget.id)} onUpdate={handleUpdate} /> : null,
        };
      });
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching widgets:', error);
    }
  }, [pageId]);

  useEffect(() => {
    fetchWidgets();
  }, [fetchWidgets]);

  const handleDelete = useCallback(async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/widget/${id}`);
      fetchWidgets();
    } catch (error) {
      console.error('Error deleting widget:', error);
    }
  }, [fetchWidgets]);

  const handleUpdate = useCallback(async (id, data) => {
    try {
      await axios.put(`http://localhost:5001/api/widget/${id}`, { data: JSON.stringify(data) });
      fetchWidgets();
    } catch (error) {
      console.error('Error updating widget:', error);
    }
  }, [fetchWidgets]);

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === 'editor' && destination.droppableId === 'editor') {
      const reorderedItems = Array.from(items);
      const [removed] = reorderedItems.splice(source.index, 1);
      reorderedItems.splice(destination.index, 0, removed);
      setItems(reorderedItems);
      return;
    }

    if (source.droppableId === 'availableWidgets' && destination.droppableId === 'editor') {
      const widget = availableWidgets[source.index];
      const newWidget = {
        id: uuidv4(),
        type: widget.type,
        data: JSON.stringify({ text: widget.name }), // Ensure data is correctly structured as JSON string
      };

      axios.post('http://localhost:5001/api/widget', { ...newWidget, pageId })
        .then(() => {
          fetchWidgets();
        })
        .catch(error => {
          console.error('Error creating widget:', error);
        });
    }
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-screen">
        <Sidebar widgets={availableWidgets} />
        <div className="flex-1 p-4 bg-gray-100 rounded">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Page Editor</h1>
            <button
              onClick={handleNavigateHome}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Go to Home
            </button>
          </div>
          <Droppable droppableId="editor">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="p-4 bg-gray-100 rounded h-full">
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-2 mb-2 bg-white border rounded"
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
}

export default PageEditor;

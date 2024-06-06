import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Rnd } from 'react-rnd';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import FormWidget from '../components/widgets/FormWidget';
import ChartWidget from '../components/widgets/ChartWidget';
import TextWidget from '../components/widgets/TextWidget';
import ImageWidget from '../components/widgets/ImageWidget';
import ButtonWidget from '../components/widgets/ButtonWidget';
import Sidebar from '../components/Sidebar';

const componentsMap = {
  form: FormWidget,
  chart: ChartWidget,
  text: TextWidget,
  image: ImageWidget,
  button: ButtonWidget,
};

function PageEditor() {
  const { pageId } = useParams();
  const { token } = useAuth();
  const [widgets, setWidgets] = useState([]);
  const [availableWidgets] = useState([
    { id: '1', name: 'Chart Widget', type: 'chart' },
    { id: '2', name: 'Form Widget', type: 'form' },
    { id: '3', name: 'Text Widget', type: 'text' },
    { id: '4', name: 'Image Widget', type: 'image' },
    { id: '5', name: 'Button Widget', type: 'button' },
  ]);

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:5001/api',
    headers: {
      'x-auth-token': token,
    },
  });

  const fetchWidgets = useCallback(async () => {
    try {
      console.log(`Fetching widgets for page: ${pageId}`);
      const response = await axiosInstance.get(`/page/${pageId}/widgets`);
      console.log("Widgets fetched: ", response.data);

      const fetchedWidgets = response.data.map((widget) => {
        console.log(`Processing widget: ${widget.id}`);
        return {
          ...widget,
          position: typeof widget.position === 'string' ? JSON.parse(widget.position) : widget.position,
          size: typeof widget.size === 'string' ? JSON.parse(widget.size) : widget.size,
          type: widget.type.replace(/\"/g, ''), // Clean up type value
        };
      });
      setWidgets(fetchedWidgets);
    } catch (error) {
      console.error('Error fetching widgets:', error);
    }
  }, [pageId, token]);

  useEffect(() => {
    fetchWidgets();
  }, [fetchWidgets]);

  const handleDelete = useCallback(async (id) => {
    try {
      await axiosInstance.delete(`/widget/${id}`);
      fetchWidgets();
    } catch (error) {
      console.error('Error deleting widget:', error);
    }
  }, [fetchWidgets]);

  const handleAddWidget = async (widgetType) => {
    try {
      const widget = {
        pageId,
        type: widgetType,
        data: {},
        position: { x: 0, y: 0 },
        size: { width: 200, height: 200 },
      };
      await axiosInstance.post(`/page/${pageId}/widget`, widget);
      fetchWidgets();
    } catch (error) {
      console.error('Error creating widget:', error);
    }
  };

  const handleDragStop = async (e, d, id) => {
    const newPosition = { x: d.x, y: d.y };
    const widget = widgets.find(w => w.id === id);
    if (widget) {
      try {
        await axiosInstance.put(`/widget/${id}`, { data: widget.data, position: newPosition, size: widget.size });
        fetchWidgets();
      } catch (error) {
        console.error('Error updating widget position:', error);
      }
    }
  };

  const handleResizeStop = async (e, direction, ref, delta, position, id) => {
    const newSize = { width: ref.style.width, height: ref.style.height };
    const widget = widgets.find(w => w.id === id);
    if (widget) {
      try {
        await axiosInstance.put(`/widget/${id}`, { data: widget.data, size: newSize, position });
        fetchWidgets();
      } catch (error) {
        console.error('Error updating widget size:', error);
      }
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        widgets={availableWidgets}
        onAddWidget={(widgetType) => handleAddWidget(widgetType.type)}
      />
      <div className="flex-1 p-4 bg-gray-100 rounded">
        <h1 className="text-2xl font-bold mb-4">Page Editor</h1>
        <div className="relative w-full h-full">
          {widgets.map((widget) => {
            const WidgetComponent = componentsMap[widget.type];
            if (!WidgetComponent) {
              console.error(`Widget type "${widget.type}" not recognized.`);
              return null;
            }
            return (
              <Rnd
                key={widget.id}
                default={{
                  x: widget.position.x,
                  y: widget.position.y,
                  width: widget.size.width,
                  height: widget.size.height,
                }}
                onDragStop={(e, d) => handleDragStop(e, d, widget.id)}
                onResizeStop={(e, direction, ref, delta, position) =>
                  handleResizeStop(e, direction, ref, delta, position, widget.id)
                }
              >
                <div className="bg-white shadow-md rounded p-2 mb-2 relative">
                  <button
                    onClick={() => handleDelete(widget.id)}
                    className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    X
                  </button>
                  <WidgetComponent id={widget.id} data={widget.data} onDelete={handleDelete} />
                </div>
              </Rnd>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PageEditor;

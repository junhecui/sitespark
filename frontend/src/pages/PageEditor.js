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

const PageEditor = () => {
  const { pageId } = useParams();
  const [widgets, setWidgets] = useState([]);
  const { token } = useAuth();
  const boundaryBoxRef = React.createRef();

  const fetchWidgets = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/page/${pageId}/widgets`, {
        headers: { 'x-auth-token': token }
      });
      const fetchedWidgets = response.data.map(widget => ({
        ...widget,
        data: typeof widget.data === 'string' ? JSON.parse(widget.data) : widget.data,
        position: typeof widget.position === 'string' ? JSON.parse(widget.position) : widget.position,
        size: typeof widget.size === 'string' ? JSON.parse(widget.size) : widget.size
      }));
      setWidgets(fetchedWidgets);
    } catch (error) {
      console.error('Error fetching widgets:', error);
    }
  }, [pageId, token]);

  useEffect(() => {
    fetchWidgets();
  }, [fetchWidgets]);

  const handleWidgetUpdate = useCallback(async (id, data, position, size) => {
    try {
      await axios.put(`http://localhost:5001/api/widget/${id}`, {
        data: JSON.stringify(data),
        position: JSON.stringify(position),
        size: JSON.stringify(size)
      }, {
        headers: { 'x-auth-token': token }
      });
      fetchWidgets();
    } catch (error) {
      console.error('Error updating widget:', error);
    }
  }, [fetchWidgets, token]);

  const handleAddWidget = async (widgetType) => {
    try {
      const newWidget = {
        pageId,
        type: widgetType,
        data: {},
        position: { x: 0, y: 0 },
        size: { width: 200, height: 200 }
      };
      const response = await axios.post(`http://localhost:5001/api/page/${pageId}/widget`, newWidget, {
        headers: { 'x-auth-token': token }
      });
      setWidgets([...widgets, response.data]);
    } catch (error) {
      console.error('Error creating widget:', error);
    }
  };

  const renderWidget = (widget) => {
    let WidgetComponent;
    switch (widget.type) {
      case 'form':
        WidgetComponent = FormWidget;
        break;
      case 'chart':
        WidgetComponent = ChartWidget;
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
        console.error(`Widget type "${widget.type}" not recognized.`);
        return null;
    }
    return (
      <Rnd
        key={widget.id}
        bounds=".boundary-box"
        size={{ width: widget.size.width, height: widget.size.height }}
        position={{ x: widget.position.x, y: widget.position.y }}
        onDragStop={(e, d) => handleWidgetUpdate(widget.id, widget.data, { x: d.x, y: d.y }, widget.size)}
        onResizeStop={(e, direction, ref, delta, position) =>
          handleWidgetUpdate(widget.id, widget.data, position, { width: ref.offsetWidth, height: ref.offsetHeight })
        }
      >
        <WidgetComponent data={widget.data} id={widget.id} onDelete={() => handleDeleteWidget(widget.id)} onUpdate={handleWidgetUpdate} />
      </Rnd>
    );
  };

  const handleDeleteWidget = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/widget/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setWidgets(widgets.filter(widget => widget.id !== id));
    } catch (error) {
      console.error('Error deleting widget:', error);
    }
  };

  return (
    <div className="flex">
      <Sidebar onAddWidget={handleAddWidget} />
      <div className="flex-1 p-4 bg-gray-100 rounded">
        <h1 className="text-2xl font-bold mb-4">Page Editor</h1>
        <div className="boundary-box" ref={boundaryBoxRef} style={{ width: '1200px', height: '800px', border: '2px solid black', position: 'relative', overflow: 'hidden' }}>
          {widgets.map(renderWidget)}
        </div>
      </div>
    </div>
  );
};

export default PageEditor;

import React, { useState, useEffect } from 'react';
import DragDrop from '../components/DragDrop';
import { getWidgets, createWidget, deleteWidget } from '../services/api';
import FormWidget from '../components/widgets/FormWidget';
import ChartWidget from '../components/widgets/ChartWidget';
import TextWidget from '../components/widgets/TextWidget';
import ImageWidget from '../components/widgets/ImageWidget';
import ButtonWidget from '../components/widgets/ButtonWidget';

function Dashboard() {
  const [items, setItems] = useState([]);
  const [widgetType, setWidgetType] = useState('');
  const [widgetData, setWidgetData] = useState('');

  useEffect(() => {
    fetchWidgets();
  }, []);

  const fetchWidgets = async () => {
    try {
      const response = await getWidgets();
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
        return {
          id: widget.id,
          content: WidgetComponent ? <WidgetComponent key={widget.id} id={widget.id} data={widget.data} onDelete={handleDelete} /> : null,
        };
      });
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching widgets:', error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }
    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);
    setItems(reorderedItems);
    // Optionally update widget positions in the backend if needed
  };

  const handleDelete = async (id) => {
    try {
      await deleteWidget(id);
      fetchWidgets();
    } catch (error) {
      console.error('Error deleting widget:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newWidget = {
        id: `widget_${Date.now()}`,
        type: widgetType,
        data: widgetData
      };
      await createWidget(newWidget);
      fetchWidgets();
    } catch (error) {
      console.error('Error creating widget:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="widgetType">
            Widget Type
          </label>
          <select
            id="widgetType"
            value={widgetType}
            onChange={(e) => setWidgetType(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a widget type</option>
            <option value="form">Form Widget</option>
            <option value="chart">Chart Widget</option>
            <option value="text">Text Widget</option>
            <option value="image">Image Widget</option>
            <option value="button">Button Widget</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="widgetData">
            Widget Data
          </label>
          <textarea
            id="widgetData"
            value={widgetData}
            onChange={(e) => setWidgetData(e.target.value)}
            placeholder="Enter widget data"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Widget
          </button>
        </div>
      </form>
      <DragDrop items={items} onDragEnd={handleDragEnd} />
    </div>
  );
}

export default Dashboard;

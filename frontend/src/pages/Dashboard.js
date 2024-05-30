import React, { useState, useEffect } from 'react';
import DragDrop from '../components/DragDrop';
import { getWidgets } from '../services/api';
import FormWidget from '../components/widgets/FormWidget';

function Dashboard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchWidgets();
  }, []);

  const fetchWidgets = async () => {
    try {
      const response = await getWidgets();
      const fetchedItems = response.data.map((widget) => ({
        id: widget.id,
        content: <FormWidget key={widget.id} data={widget.data} />
      }));
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

  return (
    <div>
      <h1>Dashboard</h1>
      <DragDrop items={items} onDragEnd={handleDragEnd} />
    </div>
  );
}

export default Dashboard;

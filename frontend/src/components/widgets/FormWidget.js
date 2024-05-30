import React, { useState } from 'react';
import { createWidget } from '../../services/api'; // Ensure you have this import

const FormWidget = ({ data }) => {
  const [input, setInput] = useState(data || '');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const widgetData = { type: 'form', data: input };
      await createWidget(widgetData);
      alert('Widget created successfully!');
    } catch (error) {
      console.error('Error creating widget:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormWidget;

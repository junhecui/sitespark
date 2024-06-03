const express = require('express');
const router = express.Router();
const { session } = require('../db/neo4j');

// Route to create a new widget
router.post('/widget', async (req, res) => {
  const { type, data } = req.body;
  const id = `widget_${Date.now()}`;
  
  try {
    const result = await session.run(
      'CREATE (w:Widget {id: $id, type: $type, data: $data}) RETURN w',
      { id, type, data: JSON.stringify(data) } // Serialize data to JSON string
    );
    const widget = result.records[0].get('w').properties;
    res.status(201).json(widget);
  } catch (error) {
    console.error('Error creating widget:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get all widgets
router.get('/widgets', async (req, res) => {
  try {
    const result = await session.run('MATCH (w:Widget) RETURN w');
    const widgets = result.records.map(record => {
      const widget = record.get('w').properties;
      widget.data = JSON.parse(widget.data); // Deserialize data from JSON string
      return widget;
    });
    res.status(200).json(widgets);
  } catch (error) {
    console.error('Error fetching widgets:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to delete a widget by its ID
router.delete('/widget/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await session.run('MATCH (w:Widget {id: $id}) DELETE w', { id });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting widget:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to delete all widgets
router.delete('/widgets', async (req, res) => {
  try {
    await session.run('MATCH (w:Widget) DELETE w');
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting all widgets:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
